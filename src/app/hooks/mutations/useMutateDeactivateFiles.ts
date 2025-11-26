import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

async function deactivateFile(fileId: number) {

    const response = await axios.post("http://localhost:3001/api/deactivateFile", {
        params: {
            fileId: fileId
        }
    }
    );

    if (!response) throw new Error("Erro ao inativar arquivo");

    return response.data
}

export function useMutationDeactivateFile() {

    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['deactivateFile'],
        mutationFn: (fileId: number) => deactivateFile(fileId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] })
            toast.success("Arquivo inativado com sucesso!");
        }
    })
}