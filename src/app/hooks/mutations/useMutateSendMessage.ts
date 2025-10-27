import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export interface iBodyMessage {
    message: string,
    fileId: number
}

async function sendMessage(bodyMessage: iBodyMessage) {

    const response = await axios.post("http://localhost:3001/api/chat", 
        bodyMessage
    );

    if (!response) throw new Error("Erro ao enviar mensagem");

    return response.data
}

export function useMutationSendMessage() {

    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['message'],
        mutationFn: (bodyMessage: iBodyMessage) => sendMessage(bodyMessage),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['historicoChat'] })
            toast.success("Mensagem enviada com sucesso!");
        }
    })
}