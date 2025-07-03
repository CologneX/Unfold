import { BackgroundBeams } from "@/components/custom/background";
import { ArrowDown } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Unfold",
  description:
    "A modern platform for creating, managing, and showcasing your professional portfolio and curriculum vitae.",
};

const NameMovingGradient = () => {
  return (
    <h2 className="text-3xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
      Hi, I&apos;m &ldquo;Name&rdquo; ✋
    </h2>
  );
};

export default function Home() {
  return (
    <>
      <section className="h-full w-full flex md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <BackgroundBeams />
        <div className=" p-4 max-w-7xl relative z-10 flex flex-col items-center justify-center md:pt-0 container mx-auto">
          <NameMovingGradient />
          <h1 className="text-5xl md:text-9xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            I&apos;m a &ldquo;role&rdquo;
          </h1>
          <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto text-md md:text-2xl">
            I&apos;m a &ldquo;role&rdquo; with a passion for building products that help people
            live better lives.
          </p>
          <p>
            <ArrowDown/>
            <br/>
          </p>
        </div>
      </section>
      <section className="h-full grid place-items-center">
        <h1 className="text-3xl md:text-5xl">Put another section here!</h1>
      </section>
    </>
  );
}
