import { expect, test } from 'vitest'

import { setupFolderOrganization } from '../src/organizer'

test('organizer simple file names', () => {
  const sampleFileList = [
    'Kimetsu no Yaiba - S1E01.mkv',
    'Kimetsu no Yaiba - 02.mkv',
    'Kimetsu no Yaiba - S2E03.mkv',
    'Kimetsu no Yaiba - 1x4.mkv',
    'My Hero Academia S01E01.mkv',
    'My Hero Academia S01E02.mkv',
    'My Hero Academia Season 1 Episode 3.mkv',
  ]

  expect(
    setupFolderOrganization(sampleFileList),
  ).toMatchObject(
    {
      name: '',
      isDirectory: true,
      children: [
        {
          name: 'Kimetsu no Yaiba',
          isDirectory: true,
          children: [
            {
              name: 'Season 1',
              isDirectory: true,
              children: [
                {
                  name: 'Kimetsu no Yaiba - S01E01.mkv',
                  originalPath: 'Kimetsu no Yaiba - S1E01.mkv',
                  isDirectory: false,
                  children: [
                  ],
                },
                {
                  name: 'Kimetsu no Yaiba - S01E02.mkv',
                  originalPath: 'Kimetsu no Yaiba - 02.mkv',
                  isDirectory: false,
                  children: [
                  ],
                },
                {
                  name: 'Kimetsu no Yaiba - S01E04.mkv',
                  originalPath: 'Kimetsu no Yaiba - 1x4.mkv',
                  isDirectory: false,
                  children: [
                  ],
                },
              ],
            },
            {
              name: 'Season 2',
              isDirectory: true,
              children: [
                {
                  name: 'Kimetsu no Yaiba - S02E03.mkv',
                  originalPath: 'Kimetsu no Yaiba - S2E03.mkv',
                  isDirectory: false,
                  children: [
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'My Hero Academia',
          isDirectory: true,
          children: [
            {
              name: 'Season 1',
              isDirectory: true,
              children: [
                {
                  name: 'My Hero Academia - S01E01.mkv',
                  originalPath: 'My Hero Academia S01E01.mkv',
                  isDirectory: false,
                  children: [
                  ],
                },
                {
                  name: 'My Hero Academia - S01E02.mkv',
                  originalPath: 'My Hero Academia S01E02.mkv',
                  isDirectory: false,
                  children: [
                  ],
                },
                {
                  name: 'My Hero Academia - S01E03.mkv',
                  originalPath: 'My Hero Academia Season 1 Episode 3.mkv',
                  isDirectory: false,
                  children: [
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  )
})

test('Organizer with standalone shows', () => {
  const sampleFileList = [
    'Kimetsu no Yaiba - S01E01.mkv',
    'Akira.mkv',
  ]

  expect(
    setupFolderOrganization(sampleFileList),
  ).toMatchObject(
    {
      name: '',
      isDirectory: true,
      children: [
        {
          name: 'Kimetsu no Yaiba',
          isDirectory: true,
          children: [
            {
              name: 'Season 1',
              isDirectory: true,
              children: [
                {
                  name: 'Kimetsu no Yaiba - S01E01.mkv',
                  originalPath: 'Kimetsu no Yaiba - S01E01.mkv',
                  isDirectory: false,
                  children: [],
                },
              ],
            },
          ],
        },
        {
          name: 'Akira',
          originalPath: 'Akira.mkv',
          isDirectory: false,
          children: [],
        },
      ],
    },
  )
})

test('organizer with season names', () => {
  const sampleFileList = [
    'Kimetsu no Yaiba - 1x4.mkv',
    'My Hero Academia S01E01.mkv',
    'My Hero Academia S01E02.mkv',
    'Overlord II - 01.mkv',
    'Overlord II - 02.mkv',
    'Overlord IV - 03.mkv',
  ]

  expect(
    setupFolderOrganization(sampleFileList),
  ).toMatchObject(
    {
      name: '',
      isDirectory: true,
      children: [
        {
          name: 'Kimetsu no Yaiba',
          isDirectory: true,
          children: [
            {
              name: 'Season 1',
              isDirectory: true,
              children: [
                {
                  name: 'Kimetsu no Yaiba - S01E04.mkv',
                  originalPath: 'Kimetsu no Yaiba - 1x4.mkv',
                  isDirectory: false,
                  children: [],
                },
              ],
            },
          ],
        },
        {
          name: 'My Hero Academia',
          isDirectory: true,
          children: [
            {
              name: 'Season 1',
              isDirectory: true,
              children: [
                {
                  name: 'My Hero Academia - S01E01.mkv',
                  originalPath: 'My Hero Academia S01E01.mkv',
                  isDirectory: false,
                  children: [],
                },
                {
                  name: 'My Hero Academia - S01E02.mkv',
                  originalPath: 'My Hero Academia S01E02.mkv',
                  isDirectory: false,
                  children: [],
                },
              ],
            },
          ],
        },
        {
          name: 'Overlord II',
          isDirectory: true,
          children: [
            {
              name: 'Season 1',
              isDirectory: true,
              children: [
                {
                  name: 'Overlord II - S01E01.mkv',
                  originalPath: 'Overlord II - 01.mkv',
                  isDirectory: false,
                  children: [],
                },
                {
                  name: 'Overlord II - S01E02.mkv',
                  originalPath: 'Overlord II - 02.mkv',
                  isDirectory: false,
                  children: [],
                },
              ],
            },
          ],
        },
        {
          name: 'Overlord IV',
          isDirectory: true,
          children: [
            {
              name: 'Season 1',
              isDirectory: true,
              children: [
                {
                  name: 'Overlord IV - S01E03.mkv',
                  originalPath: 'Overlord IV - 03.mkv',
                  isDirectory: false,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  )
})
