import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

async function addFile(formData: any) {

    const response = await axios.post("http://localhost:3001/api/upload", 
        formData
    );

    if (!response) throw new Error("Erro ao enviar arquivo");

    return response.data
}

export function useMutationAddFiles() {

    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['file'],
        mutationFn: (formData: any) => addFile(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] })
            toast.success("Arquivo enviado com sucesso!");
        }
    })
}