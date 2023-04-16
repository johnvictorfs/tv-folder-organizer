import type { NextPage } from 'next'
import Head from 'next/head'

import { DirectoryList } from '~/components/directory/DirectoryList'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>TV Folder Organizer</title>
        <meta name="description" content="A TV Shows files organizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <DirectoryList />
      </main >
    </>
  )
}

export default Home
