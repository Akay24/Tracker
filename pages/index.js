import dynamic from "next/dynamic";
import Head from "next/head";

const SDETracker = dynamic(() => import("../components/SDETracker"), { ssr: false });

export default function HomePage() {
  return (
    <>
      <Head>
        <title>SDE Prep Engine</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SDETracker />
    </>
  );
}
