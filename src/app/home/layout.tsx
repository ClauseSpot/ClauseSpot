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
          {/* <Link href="/home/buscar" className={pathname === "/home/buscar" ? "active" : ""}>Buscar</Link> */}
          <Link href="/home/uploadArquivos" className={pathname === "/home/uploadArquivos" ? "active" : ""}>Arquivos</Link>
          <Link href="/home/leis" className={pathname === "/home/leis" ? "active" : ""}>Leis</Link>
          <Link href="/home/gerenciaDeUsuario" className={pathname === "/home/gerenciaDeUsuario" ? "active" : ""}>Usuários</Link> 
          <Link href="/" className={pathname === "/" ? "active" : ""}>Sair</Link>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
}