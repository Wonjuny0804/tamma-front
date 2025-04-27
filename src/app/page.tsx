import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar: FC = () => {
  return (
    <nav className="flex justify-center p-6 bg-[--background] font-['Inter']">
      <div className="flex items-center justify-between w-full max-w-[1280px] ">
      <div className="flex items-center gap-4 ">
        <div className="flex items-center">
          <Image
            src="/tamma_hor_logo.svg"
            alt="Tamma Logo"
            width={100}
            height={60}
          />
        </div>
      </div>
      <div>
        <Link href="/signin" className="px-4 py-2 font-medium text-forground rounded hover:opacity-90 transition-opacity">
          Log in
        </Link>
        <Link href="/signup" className="px-4 py-2 mr-2 font-medium text-background rounded bg-primary transition-colors">
          Start Automate
        </Link>
      </div>
      </div>
    </nav>
  );
};

const Hero: FC = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-32 text-center font-['Inter']">
      <h1 className="text-[64px] font-medium max-w-[800px] leading-[1.2] text-foreground font-['Inter_Tight']">Easily deploy your AWS Lambda functions</h1>
      <p className="text-xl leading-[1.4] font-[Inter_Tight] mt-4 text-">
        Tamma lets you deploy your serverless functions by talking to an agent, <br/>
      No more CLI, just let us handle everything. Tell us what we need to do.</p>
      <Link href="/signin" className="bg-primary text-background p-2 px-4 rounded mt-6">Deploy Lambda -{">"} </Link>
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
