import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';


async function deactivateFile(fileId: number) {

    const response = await axios.patch("http://localhost:3001/api/deactivateFile",
        {
            fileId: fileId
        },
    );

    if (!response) throw new Error("Erro ao inativar arquivo");

    return response.data
}

export function useMutationDeactivateFile() {

    const queryClient = useQueryClient()
    const { toast } = useToast();
    return useMutation({
        mutationKey: ['deactivateFile'],
        mutationFn: (fileId: number) => deactivateFile(fileId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] })
            toast({
                title: "✅ Arquivo inativado com sucesso!",
                duration: 3500,
            });
        }
    })
}