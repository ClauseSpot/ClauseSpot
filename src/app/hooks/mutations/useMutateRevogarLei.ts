import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

async function removeLei(idLei: number) {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`http://localhost:3001/api/delete-lei/${idLei}`);

    if (!response) throw new Error("Erro ao remover lei");

    return response.data
}

export function useMutationRemoveLei() {

    const queryClient = useQueryClient()
    const { toast } = useToast();
    return useMutation({
        mutationKey: ['leiRemovida'],
        mutationFn: (idLei: number) => removeLei(idLei),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leisAdicionadas'] })
            queryClient.invalidateQueries({ queryKey: ['leis'] })
            toast({
                title: "✅ Lei removida com sucesso!",
                duration: 3500,
            });
        }
    })
}