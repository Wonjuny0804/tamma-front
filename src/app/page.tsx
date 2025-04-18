import { FC } from "react";
import Image from "next/image";

const Navbar: FC = () => {
  return (
    <nav className="flex items-center justify-between p-6 bg-[--background] font-['Inter']">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <Image
            src="/images/tamma-logo.svg"
            alt="Tamma Logo"
            width={36}
            height={36}
          />
          <span className="ml-2 text-xl font-bold">tamma</span>
        </div>
      </div>
      <div>
        <button className="px-4 py-2 mr-2 text-[--primary] border border-[--primary] rounded hover:bg-[--primary] hover:text-white transition-colors">
          Start Automate
        </button>
        <button className="px-4 py-2 text-white bg-[--primary] rounded hover:opacity-90 transition-opacity">
          Sign Up
        </button>
      </div>
    </nav>
  );
};

const Hero: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center font-['Inter']">
      <h1 className="mb-6 text-5xl font-bold font-['Poppins']">
        Supercharge Your Workflow with AI
      </h1>
      <p className="max-w-2xl mb-10 text-xl text-[--foreground]/70">
        Experience the power of AI to transform your business processes and
        boost productivity.
      </p>
      <div className="w-full max-w-2xl">
        <div className="flex">
          <input
            type="text"
            placeholder="Enter your question or prompt..."
            className="w-full px-6 py-4 text-lg border border-[--secondary] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[--primary]"
          />
          <button className="px-6 py-4 text-lg font-medium text-white bg-[--primary] rounded-r-lg hover:opacity-90 transition-opacity">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const Home: FC = () => {
  return (
    <div className="min-h-screen bg-[--background] font-['Inter']">
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  );
};

export default Home;
