import { JSX } from "react";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="h-full px-4 md:px-0 w-full">
      {children}
    </div>
  );
}
