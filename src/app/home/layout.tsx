"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./layout.css";
import ReactQueryClientProvider from "@/components/ReactQueryClientProvider";
import { useState, useEffect } from 'react'; // MODIFICADO: Importa hooks
import {Toaster, toast} from 'sonner';

type UserInfo = {
  cargo: 'Gerente' | 'Curador' | 'Usuário' | null;
  // Outros campos do usuário podem ser adicionados aqui se necessário
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Garante que o código só rode no navegador (onde o localStorage existe)
    if (typeof window !== 'undefined') {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

      // 1. Se NÃO estiver autenticado, manda de volta para a página de login
      if (!isAuthenticated) {
        router.push('/');
        return; // Para a execução
      }

      // 2. Se ESTIVER autenticado, carrega os dados do usuário
      const userInfoString = localStorage.getItem('userInfo');
      if (userInfoString) {
        try {
          const userInfo: UserInfo = JSON.parse(userInfoString);
          setUserRole(userInfo.cargo);

          const toastShown = sessionStorage.getItem('welcomeToastShown');
          if (!toastShown) {
            let welcomeMessage = "Login realizado com sucesso!";
            switch(userInfo.cargo) {
              case 'Gerente':
                welcomeMessage = `Bem-vindo, ${userInfo.cargo}!`;
                break;
              case 'Curador':
                welcomeMessage = `Bem-vindo, ${userInfo.cargo}!`;
                break;
              case 'Usuário':
                welcomeMessage = `Bem-vindo, ${userInfo.cargo}!`;
                break;
            }
            // Exibe o toast
            toast.success("Login bem-sucedido!", {
              description: welcomeMessage,
              duration: 4000, // 4 segundos
            });
            // Marca que o toast foi exibido nesta sessão
            sessionStorage.setItem('welcomeToastShown', 'true');
          }
        } catch (e) {
          console.error("Falha ao parsear userInfo do localStorage", e);
          setUserRole(null);
        }
      }
      // 3. Termina a verificação e permite a renderização da página
      setIsCheckingAuth(false);
    }
  }, [router]);


  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userInfo');
      sessionStorage.removeItem('welcomeToastShown'); 
    }
    router.push('/'); 
  };

  if (isCheckingAuth) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        backgroundColor: '#1A365D', 
        color: 'white', 
        fontFamily: 'sans-serif',
        fontSize: '1.2rem'
      }}>
        Carregando...
      </div>
    );
  }

  return (
    <ReactQueryClientProvider>
      <Toaster position="top-right" richColors />
      <div>
        <nav className="navbar">
          <div className="navbar-logo">ClauseSpot</div>
          <div className="navbar-links">
            <Link href="/home" className={pathname === "/home" ? "active" : ""}>Home</Link>
            {/* <Link href="/home/buscar" className={pathname === "/home/buscar" ? "active" : ""}>Buscar</Link> */}
            <Link href="/home/uploadArquivos" className={pathname === "/home/uploadArquivos" ? "active" : ""}>Arquivos</Link>
            <Link href="/home/leis" className={pathname === "/home/leis" ? "active" : ""}>Leis</Link>
            {userRole === 'Gerente' && (
              <Link href="/home/gerenciaDeUsuario" className={pathname === "/home/gerenciaDeUsuario" ? "active" : ""}>Usuários</Link> 
            )}

            <a href="/" onClick={handleLogout} className={pathname === "/" ? "active" : ""}>Sair</a>
          </div>
        </nav>
        <main className="main-content">
          {pathname === "/home/gerenciaDeUsuario" && userRole !== 'Gerente' ? (
            <div className="text-center p-10">
              <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
              <p className="text-gray-700 mt-2">Você não tem permissão para acessar esta página.</p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </ReactQueryClientProvider>
  );
}