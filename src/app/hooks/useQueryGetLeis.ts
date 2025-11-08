import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface LeiAPI {
  id: number;
  uri: string;
  siglaTipo: string;
  codTipo: number;
  numero: number;
  ano: number;
  ementa: string;
}

export interface LeiResponse {
  data: LeiAPI[];
  links: {
    link: Array<{
      rel: string;
      href: string;
    }>;
  };
  pagina: number;
}

async function fetchLeis() {
  const response = await axios.get("http://localhost:3001/api/leis", {
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data;
}

export function useQueryGetLeis() {
  return useQuery<LeiResponse>({
    queryKey: ["leis"],
    queryFn: () => fetchLeis(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
