import { type PrismaClient } from '@acme/db'
import { organizeDirectory } from '@acme/organizer'
import { newDirectorySchema } from '@acme/validators'
import { TRPCError } from '@trpc/server'
import { readdir } from 'fs/promises'
import os from 'os'
import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

const getDirectory = async (id: string, prisma: PrismaClient) => {
  const directory = await prisma.directory.findUnique({
    where: {
      id,
    },
  })

  if (!directory) {
    throw new TRPCError({ message: 'Directory not found', code: 'NOT_FOUND' })
  }

  return directory
}

export const directoryRouter = createTRPCRouter({
  organize: publicProcedure.input(
    z.object({
      directoryId: z.string(),
    }),
  ).mutation(async ({ ctx, input }) => {
    const directory = await getDirectory(input.directoryId, ctx.prisma)

    const { operations } = await organizeDirectory(directory.location)

    return {
      operations,
    }
  }),
  previewOrganization: publicProcedure.input(
    z.object({
      directoryId: z.string(),
    }),
  ).query(async ({ ctx, input }) => {
    const directory = await getDirectory(input.directoryId, ctx.prisma)

    const { operations, fileStructure } = await organizeDirectory(directory.location, {
      preview: true,
    })

    return {
      operations,
      fileStructure,
    }
  }),
  existingCategories: publicProcedure.query(async ({ ctx }) => {

    const categories = await ctx.prisma.directory.groupBy({
      by: ['category'],
    })

    return categories.map(directory => directory.category)
  }),
  get: publicProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).query(async ({ ctx, input }) => {
    return await getDirectory(input.id, ctx.prisma)
  }),
  delete: publicProcedure.input(
    z.object({
      id: z.string(),
    }),
  ).mutation(async ({ input, ctx }) => {
    const directory = await ctx.prisma.directory.findUnique({
      where: {
        id: input.id,
      },
    })

    if (!directory) {
      throw new TRPCError({ message: 'Directory not found', code: 'NOT_FOUND' })
    }

    await ctx.prisma.directory.delete({
      where: {
        id: input.id,
      },
    })
  }),
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.directory.findMany()
  }),
  add: publicProcedure.input(
    newDirectorySchema,
  ).mutation(({ input, ctx }) => {
    return ctx.prisma.directory.create({
      data: {
        location: input.location,
        category: input.category,
        updateFrequencyInMinutes: input.updateFrequencyInMinutes,
      },
    })
  }),
  getDirectoryStructure: publicProcedure.input(
    z.object({
      currentPath: z.string().optional(),
      includeHiddenDirectories: z.boolean().optional().default(false),
    }).optional(),
  ).query(async ({ input }) => {
    // Consider '~' as home directory
    const path = !input?.currentPath || input.currentPath === '~' ? os.homedir() : input.currentPath

    try {
      let subDirectories = (await readdir(path, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())

      if (!input?.includeHiddenDirectories) {
        subDirectories = subDirectories.filter(
          dirent => !dirent.name.startsWith('.'),
        )
      }

      return {
        currentLocation: path,
        subDirectories: subDirectories.map(dirent => dirent.name),
      }
    } catch (error) {
      return {
        currentLocation: path,
        subDirectories: [],
        error: error,
      }
    }
  }),
})
