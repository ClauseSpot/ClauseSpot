"use client"

import { iBodyMessage, useMutationSendMessage } from "@/app/hooks/mutations/useMutateSendMessage"
import { useQueryGetArquivoById } from "@/app/hooks/useQueryGetArquivoById"
import { iMensagem, useQueryGetHistoricoConversa } from "@/app/hooks/useQueryGetChatHistory"
import { LoadingDots } from "@/components/LoadingDots"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { zodResolver } from "@hookform/resolvers/zod"
import { Ellipsis, SendHorizonal } from "lucide-react"
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

    const { data: arquivo, isLoading: loadingArquivos, isSuccess: successArquivo } = useQueryGetArquivoById(code)

    // console.log("Esse é o arquivo: ", arquivo)

    const { mutateAsync, isPending, isSuccess } = useMutationSendMessage()

    const scrollRef = useRef<HTMLDivElement>(null)

    const sendMessage = (dataForm: sendMessageType) => {
        const data = {
            message: dataForm.message,
            fileId: code,
            usuarioId: 1,
        }
        mutateAsync(data as iBodyMessage)
    }

    function scrollToBottom() {
        const scrollViewport = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]")
        if (scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight
        }
    }

    useEffect(() => {
        if (isSuccess) {
            sendMessageForm.reset({ message: '' })
            scrollToBottom()
        }
    }, [isSuccess])

    useEffect(() => {
        if (historico) {
            scrollToBottom()
        }
    }, [historico])

    useEffect(() => {
        if (isPending) {
            sendMessageForm.reset({ message: '' })
            scrollToBottom()
        }
    }, [isPending])

    return (
        <div className="flex min-h-screen bg-slate-50 items-center justify-center">
            <Card className="h-[600px] w-full max-w-2xl grid grid-rows-[min-content_1fr_min-content]">
                <div className="text-center p-4">
                    <CardTitle className="text-lg font-semibold"> Análise do arquivo {arquivo?.nome_original} </CardTitle>
                    <CardDescription className="text-sm text-slate-600 mt-1">
                        Faça alguma pergunta sobre o arquivo
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
                    {
                        isPending &&
                        <LoadingDots />
                    }
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