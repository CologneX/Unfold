import { BackgroundBeams } from "@/components/custom/background";
import { h2 } from "motion/react-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Unfold",
  description:
    "A modern platform for creating, managing, and showcasing your professional portfolio and curriculum vitae.",
};

const NameMovingGradient = () => {
  return (
    <h2 className="text-2xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
      Hi, I'm "Name" ✋
    </h2>
  );
};

export default function Home() {
  return (
    <>
      <section className="h-full w-full flex md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <BackgroundBeams />
        <div className=" p-4 max-w-7xl mx-auto relative z-10 w-full flex flex-col items-center justify-center md:pt-0">
          <NameMovingGradient />
          <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            I'm a "role"
          </h1>
          <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
            I'm a "role" with a passion for building products that
            help people live better lives.
          </p>
        </div>
      </section>
    </>
  );
}
