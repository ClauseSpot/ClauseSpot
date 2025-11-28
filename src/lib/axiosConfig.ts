import axios from 'axios';

export function performLogout() {
  if (typeof window !== "undefined") {
    console.log("🚪 Realizando logout - Limpando dados de autenticação");
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userInfo");
    
    window.location.href = "/";
  }
}

let interceptorId: number | null = null;

export function setupAxiosInterceptors() {
  if (interceptorId !== null) {
    axios.interceptors.response.eject(interceptorId);
  }
  
  interceptorId = axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn("🚫 Token inválido ou expirado (401) - Realizando logout automático");
        performLogout();
      }
      
      return Promise.reject(error);
    }
  );
}
