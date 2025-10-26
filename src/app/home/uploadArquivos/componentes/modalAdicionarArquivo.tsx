"use client"

import { Button } from "@/components/ui/button";

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

export function ModalAdicionarArquivo() {

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
        <div className="w-full flex items-center justify-center py-8 px-4">
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
                    >
                        <DialogClose asChild>
                            <Button disabled={pendent} variant="outline" className="w-[20%] xs:w-[40%]">Cancelar</Button>
                        </DialogClose>
                    </FormAdicionarArquivo>
                </DialogContent>
            </Dialog>
        </div>
    )
}