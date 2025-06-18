import { JSX } from "react";

export default function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="container mx-auto mt-24">{children}</div>;
}