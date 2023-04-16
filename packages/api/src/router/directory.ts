import { z } from "zod";
import os from 'os'


import { readdir } from 'fs/promises'


import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const directoryRouter = createTRPCRouter({
  existingCategories: publicProcedure.query(async ({ ctx }) => {

    const categories = await ctx.prisma.directory.groupBy({
      by: ['category'],
    })

    return categories.map(directory => directory.category)
  }),
  delete: publicProcedure.input(
    z.object({
      id: z.string(),
    })
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
      }
    })
  }),
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.directory.findMany()
  }),
  add: publicProcedure.input(
    z.object({
      location: z.string(),
      category: z.string(),
      updateFrequencyInMinutes: z.number().optional().default(60),
    })
  ).mutation(({ input, ctx }) => {
    return ctx.prisma.directory.create({
      data: {
        location: input.location,
        category: input.category,
        updateFrequencyInMinutes: input.updateFrequencyInMinutes,
      }
    })
  }),
  getDirectoryStructure: publicProcedure.input(
    z.object({
      currentPath: z.string().optional(),
      includeHiddenDirectories: z.boolean().optional().default(false),
    }).optional()
  ).query(async ({ input }) => {
    // Consider '~' as home directory
    const path = !input?.currentPath || input.currentPath === '~' ? os.homedir() : input.currentPath;

    try {
      let subDirectories = (await readdir(path, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())

      if (!input?.includeHiddenDirectories) {
        subDirectories = subDirectories.filter(
          dirent => !dirent.name.startsWith('.')
        )
      }

      return {
        currentLocation: path,
        subDirectories: subDirectories.map(dirent => dirent.name),
      };
    } catch (error) {
      return {
        currentLocation: path,
        subDirectories: [],
        error: error,
      };
    }
  }),
});
