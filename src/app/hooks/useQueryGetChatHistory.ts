import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface iMensagem {
    id: number,
    conversa_id: number,
    usuario_tipo: string,
    conteudo: string,
    criado_em: string
}

async function fetchHistorico (code: number) {
    const response = await axios.post("http://localhost:3001/api/chatHistory",
        { file_id: code },
        { headers: { 'Content-Type': 'application/json'} },
    )

    return response.data.data
}

export function useQueryGetHistoricoConversa(code: number) {
    return useQuery({
        queryKey: ['historicoChat'],
        queryFn: () => fetchHistorico(code)
    })
}