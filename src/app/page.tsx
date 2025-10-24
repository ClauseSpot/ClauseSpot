"use client";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [userInfo, setUserInfo] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      
      if (data.valid === true) {
        setError("");
        setUserInfo(data.user);
        setShowAuthModal(true);
      } else {
        console.log("Validation failed:", data.message);
        setError(data.message || "Email ou senha inválidos");
      }
    } catch (error) {
      setError("Erro ao tentar fazer login. Tente novamente.");
    }
  }

  function handleAuthSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    (async () => {
      if (!userInfo || !userInfo.email) {
        setAuthError("Email do usuário não disponível para verificação");
        return;
      }

      try {
        const res = await fetch('/api/verify2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userInfo.email, code: authCode }),
        });

        const result = await res.json();

        if (result && result.success === true) {
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          localStorage.setItem('isAuthenticated', 'true');
          window.location.href = '/home';
        } else {
          setAuthError(result?.message || 'Código de autenticação inválido');
        }
      } catch (err) {
        setAuthError('Erro ao verificar código. Tente novamente.');
      }
    })();
  }

  function handleCancelAuth() {
    setShowAuthModal(false);
    setAuthCode("");
    setAuthError("");
    setUserInfo(null);
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
