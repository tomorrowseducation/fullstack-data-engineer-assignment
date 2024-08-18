import { logo } from "@/components/icons/logo";

export default function Header() {
  return (
    <header className="sticky top-0 bg-main z-10 flex items-center border-b">
      <nav className="w-full max-w-screen-xl px-8 mx-auto">
        <a href="/" aria-label="Tomorrow University" className="flex w-fit">
          {logo}
        </a>
      </nav>
    </header>
  );
}
