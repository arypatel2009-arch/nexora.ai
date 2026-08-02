import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="text-gradient text-6xl font-bold">404</span>
      <h1 className="mt-4 text-2xl font-semibold text-ink">
        This page doesn&apos;t exist
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The page you&apos;re looking for may have moved, or the link might
        be outdated.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/">Back to home</Button>
        <Button href="/contact" variant="secondary">Contact us</Button>
      </div>
    </div>
  );
}
