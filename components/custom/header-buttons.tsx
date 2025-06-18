import { JSX } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function HeaderButtons(): JSX.Element {
  return (
    <>
      <Link href="/">
        <Button
          variant="link"
          size="sm"
          effect="hoverUnderline"
          className="font-semibold"
        >
          Home
        </Button>
      </Link>
      <Link href="/curriculum-vitae">
        <Button
          variant="link"
          size="sm"
          effect="hoverUnderline"
          className="font-semibold"
        >
          CV
        </Button>
      </Link>
      <Link href="/portfolio">
        <Button
          variant="link"
          size="sm"
          effect="hoverUnderline"
          className="font-semibold"
        >
          Portfolio
        </Button>
      </Link>
    </>
  );
}
