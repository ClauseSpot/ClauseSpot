"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./layout.css";
import ReactQueryClientProvider from "@/components/ReactQueryClientProvider";
import { useState, useEffect } from "react";
import { setupAxiosInterceptors, performLogout } from "@/lib/axiosConfig";

type UserInfo = {
  cargo: "Gestor" | "Curador" | "Usuário" | null;
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    setupAxiosInterceptors();

    if (typeof window !== "undefined") {
      const isAuthenticated =
        localStorage.getItem("isAuthenticated") === "true";
      const token = localStorage.getItem("token");

      if (!isAuthenticated || !token) {
        console.warn("⚠️ Sem autenticação ou token - Redirecionando para login");
        router.push("/");
        return;
      }

      const userInfoString = localStorage.getItem("userInfo");
      if (userInfoString) {
        try {
          const userInfo: UserInfo = JSON.parse(userInfoString);
          setUserRole(userInfo.cargo);
        } catch (e) {
          console.error("Falha ao parsear userInfo do localStorage", e);
          setUserRole(null);
        }
      }

      setIsCheckingAuth(false);
    }
  }, [router]);

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    performLogout();
  };

  if (isCheckingAuth) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#1A365D",
          color: "white",
          fontFamily: "sans-serif",
          fontSize: "1.2rem",
        }}
      >
        Carregando...
      </div>
    );
  }

  return (
    <ReactQueryClientProvider>
      <div>
        <nav className="navbar">
          <div className="navbar-logo">ClauseSpot</div>

          <div className="navbar-links">
            <Link
              href="/home"
              className={pathname === "/home" ? "active" : ""}
            >
              Home
            </Link>

            <Link
              href="/home/uploadArquivos"
              className={
                pathname === "/home/uploadArquivos" ? "active" : ""
              }
            >
              Arquivos
            </Link>

            <Link
              href="/home/leis"
              className={pathname === "/home/leis" ? "active" : ""}
            >
              Leis
            </Link>

            {userRole === "Gestor" && (
              <Link
                href="/home/gerenciaDeUsuario"
                className={
                  pathname === "/home/gerenciaDeUsuario"
                    ? "active"
                    : ""
                }
              >
                Usuários
              </Link>
            )}

            <a
              href="/"
              onClick={handleLogout}
              className={pathname === "/" ? "active" : ""}
            >
              Sair
            </a>
          </div>
        </nav>

        <main className="main-content">
          {pathname === "/home/gerenciaDeUsuario" &&
          userRole !== "Gestor" ? (
            <div className="text-center p-10">
              <h1 className="text-2xl font-bold text-red-600">
                Acesso Negado
              </h1>
              <p className="text-gray-700 mt-2">
                Você não tem permissão para acessar esta página.
              </p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </ReactQueryClientProvider>
  );
}
