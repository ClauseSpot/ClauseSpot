import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { useState } from "react";
import { FormAdicionarArquivo } from "./formAdicionarArquivo";

interface Props {
    listaArquivos: any[]
    setListaArquivos: React.Dispatch<React.SetStateAction<any[]>>
}

export function ModalAdicionarArquivo({ listaArquivos, setListaArquivos }: Props) {

    const [pendent, setPendent] = useState(false);
    const [open, setOpen] = useState(false);

    function closeDialog() {
        setOpen(false)
    }

    const changePendentStatus = (boolean: boolean) => {
        if (boolean) {
        setPendent(true)
        }
        else {
        setPendent(false)
        }
    }

    return (
        <div className="w-full min-h-[200px] flex items-center justify-center py-8 px-4">
            <Card className="max-w-md w-full border" style={{ borderColor: '#C69F66', borderWidth: '1.5px' }}>
                <CardHeader>
                    <CardTitle className="text-center">Adicionar Arquivo</CardTitle>
                    <CardDescription>
                        Nesta tela, você pode enviar arquivos que servirão de base para o agente de IA compreender melhor seus pedidos e gerar respostas mais precisas. Clique no botão abaixo para abrir o formulário de envio.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full mx-3 bg-[#1A365D] text-white py-3 rounded-md hover:opacity-90 hover:bg-[#1A365D] transition-opacity">Adicionar Arquivo</Button>
                        </DialogTrigger>

                        <DialogContent className="w-full max-w-2xl rounded-md">
                            <DialogHeader>
                                <DialogTitle>Faça o upload de um arquivo</DialogTitle>
                                <DialogDescription>
                                    Preencha os campos abaixo:
                                </DialogDescription>
                            </DialogHeader>

                            <FormAdicionarArquivo 
                                setPendent={changePendentStatus} 
                                closeDialog={closeDialog} 
                                listaArquivos={listaArquivos}
                                setListaArquivos={setListaArquivos}
                            >
                                <DialogClose asChild>
                                    <Button disabled={pendent} variant="outline" className="w-[20%] xs:w-[40%]">Cancelar</Button>
                                </DialogClose>
                            </FormAdicionarArquivo>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    )
}