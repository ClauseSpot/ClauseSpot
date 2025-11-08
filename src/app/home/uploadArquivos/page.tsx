"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModalAdicionarArquivo } from "./componentes/modalAdicionarArquivo";
import { useEffect, useState } from "react";
import {
  iArquivos,
  useQueryGetArquivos,
} from "@/app/hooks/useQueryGetArquivos";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export default function UploadArquivos() {
  const router = useRouter();
  const { data: listaArquivos, isLoading, isSuccess } = useQueryGetArquivos(1);
  const [filtro, setFiltro] = useState("");

  // Função de destaque da palavra
  const highlight = (text: string, keyword: string) => {
    if (!text) return "";
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(
      regex,
      `<mark style="background: none; color: #bb9463; font-weight: bold;">$1</mark>`
    );
  };

  // Filtra a lista
  const arquivosFiltrados =
    listaArquivos?.filter((a: iArquivos) =>
      a.nome_original.toLowerCase().includes(filtro.toLowerCase())
    ) || [];

  // Exibe toast quando a busca não encontra resultados
  useEffect(() => {
    if (filtro && arquivosFiltrados.length === 0) {
      toast({
        variant: "destructive",
        title: "🔎 Nenhum arquivo encontrado",
        description: `Nenhum resultado para "${filtro}".`,
      });
    }
  }, [filtro]);

  return (
    <>
      <ModalAdicionarArquivo />

      {/* Campo de busca */}
     <div className="flex justify-start my-4 px-6">
  <input
    type="text"
    placeholder="Buscar arquivo..."
    value={filtro}
    onChange={(e) => setFiltro(e.target.value)}
    className="border border-[#C69F66] rounded-md p-2 w-full max-w-md focus:ring-2 focus:ring-[#1A365D] placeholder:text-gray-500 shadow-sm"
  />
</div>

      {/* Estado de carregamento */}
      {isLoading && (
        <p className="text-center text-[#1A365D] font-semibold mt-8">
          Carregando arquivos...
        </p>
      )}

      {/* Lista de arquivos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {isSuccess && arquivosFiltrados.length > 0 ? (
          arquivosFiltrados.map((arquivo: iArquivos) => (
            <Card
              key={arquivo.id}
              className="shadow-md border border-[#C69F66] hover:shadow-lg transition-all"
            >
              <CardHeader>
                <CardTitle
                  className="text-[#1A365D]"
                  dangerouslySetInnerHTML={{
                    __html: highlight(arquivo.nome_original, filtro),
                  }}
                />
              </CardHeader>

              <CardContent>
                <p className="text-[#2B6CB0]">
                  Data de Registro:{" "}
                  {new Date(arquivo.criado_em).toLocaleDateString("pt-BR")}
                </p>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => router.push(`/home/fileChat/${arquivo.id}`)}
                  className="bg-[#1A365D] hover:bg-[#2B6CB0] text-white"
                >
                  Conversar com o Arquivo
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          !isLoading && (
            <p className="text-center text-[#2B6CB0] font-medium mt-6 col-span-full">
              Nenhum arquivo encontrado.
            </p>
          )
        )}
      </div>
    </>
  );
}
