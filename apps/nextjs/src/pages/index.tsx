import type { NextPage } from "next";
import Head from "next/head";

import { NewDirectory } from "~/components/directory/NewDirectory";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>TV Magic Organizer</title>
        <meta name="description" content="Self-hosted App to organize your TV shows folder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <NewDirectory />
      </main >
    </>
  );
};

export default Home;
