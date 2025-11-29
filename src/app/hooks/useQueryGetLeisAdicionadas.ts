import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function fetchLeisAdicionadas() {
  const response = await axios.get("http://localhost:3001/api/getLeisAdicionadas", {
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data;
}

export function useQueryGetLeisAdicionadas() {
  return useQuery({
    queryKey: ["leisAdicionadas"],
    queryFn: () => fetchLeisAdicionadas(),
    staleTime: 1000 * 60 * 5,
  });
}
