import { type ParsedShow, filenameParse } from '@ctrl/video-filename-parser'
import { readdir } from 'fs/promises'

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

export const setupFolderOrganization = (fileList: string[]): DirectoryStructure => {
  const root: DirectoryStructure = {
    name: '',
    isDirectory: true,
    children: [],
  }

  fileList.forEach((filePath) => {
    const { title: parsedTitle, seasons, episodeNumbers } = filenameParse(filePath, true) as ParsedShow

    if (!seasons && !episodeNumbers) {
      const standaloneTitle = filePath.split('.')[0] || filePath

      addChild(root, {
        name: standaloneTitle,
        isDirectory: false,
        children: [],
        originalPath: filePath,
      })

      return
    }

    const title = parsedTitle || filePath
    const season = seasons?.[0] || 1
    const episode = episodeNumbers?.[0] || 1

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
    const episodeName = `${title} - S${season.toString().padStart(2, '0')}E${formattedEpisodeNumber}.mkv`

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

export const organizeDirectory = async (directoryPath: string) => {
  // Get list of files (non-folder) inside directory
  const subFiles = (await readdir(directoryPath, { withFileTypes: true }))
    .filter(dirent => dirent.isFile())

  console.log(subFiles)
}
