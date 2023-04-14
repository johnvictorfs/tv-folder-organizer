import { z } from "zod";
import os from 'os'


import { readdir } from 'fs/promises'


import { createTRPCRouter, publicProcedure } from "../trpc";

export const directoryRouter = createTRPCRouter({
  getDirectoryStructure: publicProcedure.input(
    z.object({
      currentPath: z.string().optional(),
      includeHiddenDirectories: z.boolean().optional().default(false),
    }).optional()
  ).query(async ({ input }) => {
    // Consider '~' as home directory
    const path = !input?.currentPath || input.currentPath === '~' ? os.homedir() : input.currentPath;

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
  }),
});
