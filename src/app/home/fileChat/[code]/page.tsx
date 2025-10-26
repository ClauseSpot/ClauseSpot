"use client"

import { iBodyMessage, useMutationSendMessage } from "@/app/hooks/mutations/useMutateSendMessage"
import { iMensagem, useQueryGetHistoricoConversa } from "@/app/hooks/useQueryGetChatHistory"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { zodResolver } from "@hookform/resolvers/zod"
import { SendHorizonal } from "lucide-react"
import React, { useRef } from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import z from "zod"


const sendMessageSchema = z.object({
    message: z.string().min(1, "É necessário escrever uma mensagem")
})

type sendMessageType = z.infer<typeof sendMessageSchema>


export default function FileChat({ params }: { params: Promise<{ code: string }> }){

    const resolvedParams = React.use(params)
    const code = Number(resolvedParams.code)

    const sendMessageForm = useForm<sendMessageType>({
        resolver: zodResolver(sendMessageSchema)
    })

    const { data: historico, isLoading: loadingHistorico, isSuccess: successHistorico } = useQueryGetHistoricoConversa(code)

    const { mutateAsync, isPending, isSuccess } = useMutationSendMessage()

    const scrollRef = useRef<HTMLDivElement>(null)

    const sendMessage = (dataForm: sendMessageType) => {
        const data = {
            message: dataForm.message,
            fileId: code,
            conversa_id: 1
        }
        mutateAsync(data as iBodyMessage)
    }

    useEffect(() => {
        if (isSuccess) {
            sendMessageForm.reset({message: ''})
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight
            }
        }
    }, [isSuccess])

    useEffect(() => {
        if (historico && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [historico])

    return (
        <div className="flex min-h-screen bg-slate-50 items-center justify-center">
            <Card className="h-[600px] w-full max-w-2xl grid grid-rows-[min-content_1fr_min-content]">
                <div className="text-center p-4">
                    <CardTitle className="text-lg font-semibold"> Chat com o Arquivo: {code} </CardTitle>
                    <CardDescription className="text-sm text-slate-600 mt-1">
                        Nesse chat você pode conversar com o arquivo {code} para obter informações relevantes de maneira rápida e eficiente
                    </CardDescription>
                </div>
                <CardContent className="overflow-hidden">
                    <ScrollArea ref={scrollRef} className="h-[350px] w-full pr-4">
                    {historico &&
                        historico.map((mensagem: iMensagem) => (
                        <div key={mensagem.id} className="flex gap-3 text-slate-600 text-sm mb-4">
                            <Avatar>
                            <AvatarFallback>{mensagem.usuario_tipo === "Usuário" ? "U" : "AI"}</AvatarFallback>
                            </Avatar>
                            <div>{mensagem.conteudo}</div>
                        </div>
                        ))}
                    </ScrollArea>
                </CardContent>
                <CardFooter>
                    <Form {...sendMessageForm}>
                        <form onSubmit={sendMessageForm.handleSubmit(sendMessage)} className="w-full flex gap-2">
                            <FormField
                                control={sendMessageForm.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                    <FormControl>
                                        <Input
                                        {...field}
                                        placeholder="Insira sua mensagem aqui"
                                        className="border border-blue-500 rounded-l-md"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                            variant="ghost"
                            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
                            type="submit"
                            disabled={isPending}
                            >
                                <SendHorizonal />
                            </Button>
                        </form>
                    </Form>
                </CardFooter>
            </Card>
        </div>
    )
}