import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface iArquivos {
    id: number,
    usuario_id: number,
    nome_original: string,
    tipo: string,
    criado_em: string,
    ativo: boolean,
    categoria: string,
    apelido_arquivo: string
}

async function fetchFiles (userId: number) {
    const response = await axios.post("http://localhost:3001/api/files",
        { usuario_id: userId },
        { headers: { 'Content-Type': 'application/json'} },
    )

    return response.data.data
}

export function useQueryGetArquivos(userId: number) {
    return useQuery({
        queryKey: ['files'],
        queryFn: () => fetchFiles(userId)
    })
}