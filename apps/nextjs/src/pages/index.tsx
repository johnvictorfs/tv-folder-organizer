import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";

import { api, type RouterOutputs } from "~/utils/api";
import { NewDirectory } from "~/components/directory/NewDirectory";

const AddDirectoryForm: React.FC = () => {
  return (
    <div className="flex w-full max-w-2xl flex-col p-4">
      <NewDirectory />
      {/* <input
        className="mb-2 rounded bg-white/10 p-2 text-white"
        value={pathLocation}
        onChange={(e) => setPathLocation(e.target.value)}
        placeholder="Title"
      />

      {error?.data?.zodError?.fieldErrors.title && (
        <span className="mb-2 text-red-500">
          {error.data.zodError.fieldErrors.title}
        </span>
      )} */}

      <button
        className="rounded bg-pink-400 p-2 font-bold"
      >
        Create
      </button>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>TV Magic Organizer</title>
        <meta name="description" content="Self-hosted App to organize your TV shows folder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            TV <span className="text-pink-400">Magic</span> Organizer
          </h1>

          <AddDirectoryForm />
        </div>
      </main>
    </>
  );
};

export default Home;
