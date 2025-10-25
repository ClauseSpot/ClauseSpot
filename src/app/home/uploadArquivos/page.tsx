"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ModalAdicionarArquivo } from "./componentes/modalAdicionarArquivo";
import { useEffect, useState } from "react";
import { iArquivos, useQueryGetArquivos } from "@/app/hooks/useQueryGetArquivos";
import { useRouter } from "next/navigation";


export default function uploadArquivos() {

    const router = useRouter()

    const {
        data: listaArquivos,
        isLoading: loadingArquivos,
        isSuccess: successArquivos
    } = useQueryGetArquivos(1)

    return (
        <>
            <ModalAdicionarArquivo />

            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 mt-2 gap-x-5 gap-y-5">
            {successArquivos && listaArquivos.map((arquivo: iArquivos) => (
                <Card key={arquivo.id} className="shadow-md rounded-2xl border">
                    <CardHeader>
                        <CardTitle>{arquivo.nome_original}</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p> Data de Registro: {new Date(arquivo.criado_em).toLocaleDateString('pt-br')} </p>
                    </CardContent>

                    <CardFooter>
                        <Button onClick={() => router.push(`/home/fileChat/${arquivo.id}`)}>
                            Conversar com o Arquivo
                        </Button>
                    </CardFooter>
                </Card>
            ))}
            </div>
        </>
    )
}