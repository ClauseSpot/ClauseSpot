import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface iArquivos {
    id: number,
    usuario_id: number,
    nome_original: string,
    tipo: string,
    criado_em: string
}

async function fetchFile (fileId: number) {
    const response = await axios.get("http://localhost:3001/api/getFileById", 
        {
            params: {
                fileId: fileId
            }
        }
    )

    return response.data.data
}

export function useQueryGetArquivoById(fileId: number) {
    return useQuery({
        queryKey: ['file', fileId],
        queryFn: () => fetchFile(fileId)
    })
}