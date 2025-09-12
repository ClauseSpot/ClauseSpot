"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./layout.css";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">ClauseSpot</div>
        <div className="navbar-links">        
          <Link href="/home" className={pathname === "/home" ? "active" : ""}>Home</Link>
          <Link href="/search" className={pathname === "/search" ? "active" : ""}>Pesquisar</Link>
          <Link href="/" className={pathname === "/" ? "active" : ""}>Login</Link>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
}
