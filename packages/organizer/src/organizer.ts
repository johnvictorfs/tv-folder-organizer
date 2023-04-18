import { type ParsedShow, filenameParse } from '@ctrl/video-filename-parser'
import { readdir } from 'fs/promises'
import fs from 'fs/promises'
import path from 'path'

export type DirectoryStructure = {
  name: string
  originalPath?: string
  isDirectory: boolean
  children: DirectoryStructure[]
}

const findChildByName = (children: DirectoryStructure[], name: string) => {
  return children.find((child) => child.name === name)
}

const addChild = (parent: DirectoryStructure, child: DirectoryStructure) => {
  parent.children.push(child)
}

type ExtendedParsedShow = Pick<ParsedShow, 'title' | 'episodeNumbers' | 'seasons'>

const extendedFileNameParser = (filePath: string): ExtendedParsedShow | null => {
  const regex = /^(.+?)(?:-*)(?: Season (\d+))? (?:Ep|Part) (\d+)/i
  const match = filePath.match(regex)

  if (match) {
    const title = (match[1] || filePath).trim()
    const season = match[2] ? parseInt(match[2], 10) : undefined
    const episodeNumber = match[3] ? parseInt(match[3], 10) : undefined

    const result: ExtendedParsedShow = {
      title,
      episodeNumbers: episodeNumber ? [episodeNumber] : [],
      seasons: [],
    }

    if (season) {
      result.seasons = [season]
    }

    return result
  }

  return null
}

export const setupFolderOrganization = (fileList: string[]): DirectoryStructure => {
  const root: DirectoryStructure = {
    name: '',
    isDirectory: true,
    children: [],
  }

  fileList.forEach((filePath) => {
    const { title: parsedTitle, seasons, episodeNumbers } = filenameParse(filePath, true) as ParsedShow
    const customParsed = !!episodeNumbers ? null : extendedFileNameParser(filePath)

    const fileExtension = filePath.split('.').pop()

    const title = parsedTitle || customParsed?.title || filePath
    const season = seasons?.[0] || customParsed?.seasons?.[0] || 1
    const episode = episodeNumbers?.[0] || customParsed?.episodeNumbers?.[0] || 1

    if (!seasons && !episodeNumbers && !customParsed) {
      // If no parsers worked, consider it a standalone media file, like a movie or special
      const standaloneTitle = filePath.split('.')[0] || filePath

      addChild(root, {
        name: standaloneTitle,
        isDirectory: false,
        children: [],
        originalPath: filePath,
      })

      return
    }

    let showNode = findChildByName(root.children, title)
    if (!showNode) {
      showNode = {
        name: title,
        isDirectory: true,
        children: [],
      }
      addChild(root, showNode)
    }

    const seasonStr = `Season ${season}`
    let seasonNode = findChildByName(showNode.children, seasonStr)
    if (!seasonNode) {
      seasonNode = {
        name: seasonStr,
        isDirectory: true,
        children: [],
      }
      addChild(showNode, seasonNode)
    }

    const formattedEpisodeNumber = episode.toString().padStart(2, '0')
    const episodeName = `${title} - S${season.toString().padStart(2, '0')}E${formattedEpisodeNumber}.${fileExtension}`

    const episodeNode: DirectoryStructure = {
      name: episodeName,
      originalPath: filePath,
      isDirectory: false,
      children: [],
    }

    addChild(seasonNode, episodeNode)
  })

  return root
}

export const organizeDirectory = async (directoryPath: string): Promise<{
  /**
   * List of operations performed with files, a list of human-readable messages
   */
  operations: string[]
}> => {
  // Get list of files (non-folder) inside directory
  const subFiles = (await readdir(directoryPath, { withFileTypes: true }))
    .filter(dirent => dirent.isFile())

  const organization = setupFolderOrganization(subFiles.map(file => file.name))

  const operations: string[] = []

  for (const show of organization.children) {
    const showFolderPath = path.join(directoryPath, show.name)

    operations.push(`Created folder '${showFolderPath}'`)
    await fs.mkdir(showFolderPath, { recursive: true })

    for (const season of show.children) {
      const seasonFolderPath = path.join(showFolderPath, season.name)

      operations.push(`Created folder '${seasonFolderPath}'`)
      await fs.mkdir(seasonFolderPath, { recursive: true })

      for (const episode of season.children) {
        if (!episode.originalPath) {
          throw new Error('Episode file has no original path')
        }

        const oldFilePath = path.join(directoryPath, episode.originalPath)
        const newFilePath = path.join(seasonFolderPath, episode.name)

        operations.push(`Moved '${oldFilePath}' to '${newFilePath}'`)
        await fs.rename(oldFilePath, newFilePath)
      }
    }
  }

  return {
    operations,
  }
}
