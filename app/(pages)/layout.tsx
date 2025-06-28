import { JSX } from "react";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="container mx-auto pt-20 pb-4 h-full px-4 md:px-0 w-full max-w-4xl">
      {children}
    </div>
  );
}
