"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // 🔹 LÓGICA DE VERIFICAÇÃO DE SESSÃO ATIVA
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");
      const savedUserInfo = localStorage.getItem("userInfo");
      const isAuthenticated = localStorage.getItem("isAuthenticated");

      if (!token || !savedUserInfo || isAuthenticated !== "true") {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/api/getUsers", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error("Sessão inválida");
        }

        const users = await response.json();
        const currentUser = JSON.parse(savedUserInfo);
        
        const userInDb = users.find((u: any) => u.id === currentUser.id);

        if (userInDb && userInDb.status === "Inativo") {
           throw new Error("Usuário desativado");
        }


        router.replace("/home");

      } catch (error) {
        console.warn("Sessão expirada ou usuário inativo:", error);
        
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("isAuthenticated");
        
        setIsCheckingAuth(false);
        
        toast({
          variant: "destructive",
          title: "Sessão encerrada",
          description: "Sua conta foi desativada ou a sessão expirou. Faça login novamente.",
        });
      }
    };

    verifySession();
  }, [router, toast]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.valid === true) {
        setError("");
        setUserInfo(data.user);
        
        if (data.token) {
          localStorage.setItem("token", data.token);
        } else {
          console.warn("⚠️ Token não encontrado na resposta do login");
        }
        
        setShowAuthModal(true);

        toast({
          title: "🔐 Verificação necessária",
          description: "Um código foi enviado para seu e-mail.",
          duration: 3500,
        });
      } else {
        setError(data.message || "Email ou senha inválidos");
        toast({
          variant: "destructive",
          title: "❌ Credenciais incorretas",
          description: "Verifique seu email e senha e tente novamente.",
          duration: 4000,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "⚠️ Erro de conexão",
        description: "Não foi possível realizar o login. Tente novamente.",
      });
    }
  }

  async function handleAuthSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userInfo?.email) {
      setAuthError("Email do usuário não disponível para verificação");
      return;
    }

    try {
      const res = await fetch("/api/verify2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userInfo.email, code: authCode }),
      });

      const result = await res.json();

      if (result?.success === true) {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem("isAuthenticated", "true");

        toast({
          title: "✅ Login efetuado com sucesso!",
          description: `Bem-vindo(a), ${userInfo.nome || "usuário"}!`,
          duration: 3500,
        });

        router.push("/home"); 
      } else {
        setAuthError(result?.message || "Código inválido");
        toast({
          variant: "destructive",
          title: "❌ Código incorreto",
          description: "Verifique o código de autenticação e tente novamente.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "⚠️ Erro inesperado",
        description: "Falha ao verificar o código. Tente novamente.",
      });
    }
  }

  function handleCancelAuth() {
    setShowAuthModal(false);
    setAuthCode("");
    setAuthError("");
    setUserInfo(null);
  }

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1A365D]">
        <div className="text-white font-medium">Verificando sessão...</div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-app-title">ClauseSpot</div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="login-error">{error}</div>}
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Senha" required />
        <button type="submit">Validar usuário</button>
      </form>

      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Autenticação de Dois Fatores</h3>
            <form onSubmit={handleAuthSubmit}>
              <p>Um código de autenticação foi enviado ao seu Email.</p>
              {authError && <div className="auth-error">{authError}</div>}
              <input
                type="text"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="Código de autenticação"
                required
              />
              <div className="modal-buttons">
                <button type="button" onClick={handleCancelAuth}>
                  Cancelar
                </button>
                <button type="submit">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}