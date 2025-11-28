import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export interface iMensagem {
    id: number,
    conversa_id: number,
    usuario_tipo: string,
    conteudo: string,
    criado_em: string
}

async function fetchHistorico (code: number) {
    const token = localStorage.getItem("token");
    const response = await axios.post("http://localhost:3001/api/chatHistory",
        { file_id: code },
        { headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }},
    )

    return response.data.data
}

export function useQueryGetHistoricoConversa(code: number) {
    const queryClient = useQueryClient()
    queryClient.invalidateQueries({ queryKey: ['historicoChat'] })

    return useQuery({
        queryKey: ['historicoChat', code],
        queryFn: () => fetchHistorico(code)
    })
}