"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModalAdicionarArquivo } from "./componentes/modalAdicionarArquivo";
import { useEffect, useState } from "react";


export default function uploadArquivos() {

    const [listaArquivos, setListaArquivos] = useState<any[]>([])

    useEffect(() => {
        // console.log("Lista de Arquivos Main: ", listaArquivos)
    })

    return (
        <>
            <ModalAdicionarArquivo                 
                listaArquivos={listaArquivos}
                setListaArquivos={setListaArquivos}
            />

            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 mt-2 gap-x-5 gap-y-5">
            {listaArquivos.map((arquivo: {base64: string, nome: string, link_download: string, data_registro: string}) => (
                <Card key={arquivo.base64} className="shadow-md rounded-2xl border">
                    <CardHeader>
                        <CardTitle>{arquivo.nome}</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {/* <p>Base64 do arquivo: {arquivo.base64}</p> */}
                        <p>Data de Registro: {new Date(arquivo.data_registro).toLocaleDateString('pt-br')}</p>
                    </CardContent>
                </Card>
            ))}
            </div>
        </>
    )
}