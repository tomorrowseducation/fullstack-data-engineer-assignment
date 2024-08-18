import { logo } from "@/components/icons/logo";

export default function Header() {
  return (
    <header>
      <nav className="container">
        <a href="/" aria-label="Tomorrow University" className="flex w-fit">
          {logo}
        </a>
      </nav>
    </header>
  );
}
