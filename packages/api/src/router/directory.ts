import { z } from "zod";
import os from 'os'


import { readdir } from 'fs/promises'


import { createTRPCRouter, publicProcedure } from "../trpc";

export const directoryRouter = createTRPCRouter({
  // Gets directory structure for User's home folder
  getDirectoryStructure: publicProcedure.input(
    z.object({
      currentPath: z.string().optional(),
      includeHiddenDirectories: z.boolean().optional().default(false),
    }).optional()
  ).query(async ({ input }) => {
    const path = input?.currentPath || os.homedir();

    const subDirectories = (await readdir(path, { withFileTypes: true }))
      .filter(dirent => dirent.isDirectory())
      .filter(dirent => dirent.name.startsWith('.') ? input?.includeHiddenDirectories : true)
      .map(dirent => dirent.name)

    return {
      currentLocation: path,
      subDirectories
    };
  }),
});
