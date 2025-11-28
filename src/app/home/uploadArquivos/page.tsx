"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ModalAdicionarArquivo } from "./componentes/modalAdicionarArquivo";
import { useEffect, useState } from "react";
import {
  iArquivos,
  useQueryGetArquivos,
} from "@/app/hooks/useQueryGetArquivos";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { BotaoConfirmarInativacao } from "./componentes/botaoConfirmacarInativacao";

export default function UploadArquivos() {
  const router = useRouter();
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const { data: listaArquivos, isLoading, isSuccess } = useQueryGetArquivos(userInfo.id);
  const [filtro, setFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas");

  const highlight = (text: string, keyword: string) => {
    if (!text) return "";
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.replace(
      regex,
      `<mark style="background: none; color: #bb9463; font-weight: bold;">$1</mark>`
    );
  };

  const categorias: string[] = Array.from(
    new Set(listaArquivos?.map((a: iArquivos) => a.categoria) || [])
  ).sort() as string[];

  const arquivosFiltrados =
    listaArquivos?.filter((a: iArquivos) => {
      const matchesNome = a.apelido_arquivo.toLowerCase().includes(filtro.toLowerCase());
      const matchesCategoria = categoriaFiltro === "todas" || a.categoria === categoriaFiltro;
      return matchesNome && matchesCategoria;
    }) || [];

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

    <div className="flex flex-col md:flex-row gap-4 my-4 px-6">
        <Input
            type="text"
            placeholder="Buscar arquivo..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full max-w-md border-[#C69F66] focus-visible:border-[#1A365D] focus-visible:ring-[#1A365D] bg-white"
        />
        
        <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
          <SelectTrigger className="w-full md:w-[200px] border-[#C69F66] focus:ring-[#1A365D] bg-white">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {categorias.map((categoria) => (
              <SelectItem key={categoria} value={categoria}>
                {categoria?.charAt(0).toUpperCase() + categoria?.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
    </div>

      {isLoading && (
        <p className="text-center text-[#1A365D] font-semibold mt-8">
          Carregando arquivos...
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {isSuccess && arquivosFiltrados.length > 0 ? (
          arquivosFiltrados.map((arquivo: iArquivos) => (
            <Card
            key={arquivo.id}
            className="min-h-[180px] shadow-md border border-[#C69F66] hover:shadow-2x1 hover:scale-105 hover:ring-1 hover:ring-[#C69F66] transition-all flex"
            >
                <div className="flex flex-col h-full justify-between w-full">
                    <CardHeader>
                    <CardTitle className="text-[#1A365D] font-bold truncate max-w-full block">
                        {arquivo.apelido_arquivo}
                    </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-grow">
                    <p className="text-[#2B6CB0] text-sm">
                        Data de Registro: {new Date(arquivo.criado_em).toLocaleDateString("pt-BR")}
                    </p>
                    </CardContent>

                    <CardContent className="flex-grow">
                    <p className="text-[#2B6CB0] text-sm">
                        Categoria: {arquivo.categoria?.charAt(0).toUpperCase() + arquivo.categoria?.slice(1).toLowerCase()}
                    </p>
                    </CardContent>

                    <CardFooter className="mt-2">
                        <div className="pt-10 grid items-center gap-2 w-full">
                            <Button
                                onClick={() => router.push(`/home/fileChat/${arquivo.id}`)}
                                className="w-full bg-[#1A365D] hover:bg-[#2B6CB0] text-white"
                                >
                                Conversar com o Arquivo
                            </Button>
                            <BotaoConfirmarInativacao fileId={arquivo.id} />
                        </div>
                    </CardFooter>

                </div>
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
