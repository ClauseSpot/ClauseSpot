import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

async function addLei(dadosLei: any) {
    const token = localStorage.getItem("token");
    const response = await axios.post("http://localhost:3001/api/upload-lei", 
        dadosLei,
        { headers: { 
            'Authorization': `Bearer ${token}`
        }}
    );

    if (!response) throw new Error("Erro ao enviar lei");

    return response.data
}

export function useMutationAddLeis() {

    const queryClient = useQueryClient()
    const { toast } = useToast();
    return useMutation({
        mutationKey: ['leis'],
        mutationFn: (dadosLei: any) => addLei(dadosLei),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leisAdicionadas'] })
            queryClient.invalidateQueries({ queryKey: ['leis'] })
            toast({
                title: "✅ Lei adicionada com sucesso!",
                duration: 3500,
            });
        }
    })
}