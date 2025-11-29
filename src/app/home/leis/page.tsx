"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CardDeLei } from "./componentes/CardDeLei";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useQueryGetLeis } from "@/app/hooks/useQueryGetLeis";
import { useToast } from "@/components/ui/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useQueryGetLeisAdicionadas } from "@/app/hooks/useQueryGetLeisAdicionadas";
import { CardLeiAdicionada } from "./componentes/CardLeisAdicionadas";
import { useMutationAddLeis } from "@/app/hooks/mutations/useMutateAddLeis";
import { set } from "zod";
import { useMutationRemoveLei } from "@/app/hooks/mutations/useMutateRevogarLei";

export interface AtualizacaoLei {
  usuarioId?: number;
  id: number;
  lei: string;
  inciso?: string;
  clausula?: string;
  tipoAlteracao: "Modificação" | "Inclusão" | "Revogação";
  descricaoAlteracao: string;
  dataPublicacao: string;
  status: "Nova" | "Revisada" | "Vigente";
  acaoUsuario?: "Adicionada" | "Revogada";
  uri?: string;
  siglaTipo?: string;
  codTipo?: number;
  numero?: number;
  ano?: number;
}

export default function PaginaDeLeis() {
  const { toast } = useToast();
  const anoAtual = new Date().getFullYear();
  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual);
  const [modalAberto, setModalAberto] = useState(false);
  const userId = JSON.parse(localStorage.getItem("userInfo") || "{}" ).id;

  const { data: leisAPI, isLoading, isError } = useQueryGetLeis();

  const { data: leisAdicionadasBanco, isLoading: loadingLeisAdiciondas, isError: errorLeisAdicionadas } = useQueryGetLeisAdicionadas();
  
  const { mutate: adicionarLei, isPending: adicionandoLei, isSuccess: leiAdicionada } = useMutationAddLeis();

  const { mutate: revogarLei, isPending: removendoLei, isSuccess: leiRemovida } = useMutationRemoveLei();

  const [novaLei, setNovaLei] = useState({
    lei: "",
    inciso: "",
    clausula: "",
    tipoAlteracao: "Modificação" as
      | "Modificação"
      | "Inclusão"
      | "Revogação",
    descricaoAlteracao: "",
    dataPublicacao: "",
    status: "Nova" as "Nova" | "Revisada" | "Vigente",
  });

  const [leisAdicionadas, setLeisAdicionadas] = useState<AtualizacaoLei[]>([]);
  const [acoesUsuario, setAcoesUsuario] = useState<
    Record<number, "Adicionada" | "Revogada">
  >({});

  const atualizacoes = useMemo<AtualizacaoLei[]>(() => {
    if (!leisAPI?.data) return leisAdicionadas;

    const leisDaAPI = leisAPI.data.map((lei) => {
      let tipoAlteracao: "Modificação" | "Inclusão" | "Revogação" =
        "Modificação";

      if (lei.siglaTipo.includes("INC") || lei.siglaTipo.includes("EMC"))
        tipoAlteracao = "Inclusão";
      else if (lei.siglaTipo.includes("REV")) tipoAlteracao = "Revogação";

      let status: "Nova" | "Revisada" | "Vigente" = "Vigente";
      if (lei.ano === anoAtual) status = "Nova";
      else if (lei.ano === anoAtual - 1) status = "Revisada";

      return {
        id: lei.id,
        lei: `${lei.siglaTipo} ${lei.numero}/${lei.ano}`,
        inciso: lei.codTipo ? `Código: ${lei.codTipo}` : undefined,
        tipoAlteracao,
        descricaoAlteracao: lei.ementa || "Sem ementa disponível",
        dataPublicacao: new Date().toISOString().split("T")[0],
        status,
        acaoUsuario: acoesUsuario[lei.id],
        uri: lei.uri,
        siglaTipo: lei.siglaTipo,
        codTipo: lei.codTipo,
        numero: lei.numero,
        ano: lei.ano,
      };
    });

    return [...leisDaAPI, ...leisAdicionadas];
  }, [leisAPI, leisAdicionadas, acoesUsuario, anoAtual]);

  const anosDisponiveis = Array.from(
    new Set(
      atualizacoes.map((a) =>
        isNaN(new Date(a.dataPublicacao).getFullYear())
          ? anoAtual
          : new Date(a.dataPublicacao).getFullYear()
      )
    )
  ).sort((a, b) => b - a);

  const atualizacoesFiltradas = atualizacoes.filter((a) => {
    const ano = new Date(a.dataPublicacao).getFullYear();
    return ano === anoSelecionado;
  });

  const handleAdicionar = async (atualizacao: any) => {
    const novaLei = { ...atualizacao, usuarioId: userId };
    await adicionarLei(novaLei);
  };

  const handleRevogar = async (id: number) => {
    await revogarLei(id);
  };

  const handleRemoverAcao = (id: number) => {
    setAcoesUsuario((prev) => {
      const novo = { ...prev };
      delete novo[id];
      return novo;
    });
  };

  useEffect(() => {
    if (leiAdicionada) {
      setModalAberto(false);
    }
  }, [leiAdicionada]);

  // 🔔 TOAST — ao adicionar nova lei manualmente
  const handleAdicionarNovaLei = async (e: React.FormEvent) => {
    e.preventDefault();

    const novoId =
      Math.max(0, ...atualizacoes.map((a) => a.id)) + 1;

    const nova: AtualizacaoLei = {
      usuarioId: userId,
      id: novoId,
      lei: novaLei.lei,
      inciso: novaLei.inciso || undefined,
      clausula: novaLei.clausula || undefined,
      tipoAlteracao: novaLei.tipoAlteracao,
      descricaoAlteracao: novaLei.descricaoAlteracao,
      dataPublicacao: novaLei.dataPublicacao,
      status: novaLei.status,
    };

    await adicionarLei(nova);

    // setLeisAdicionadas((prev) => [...prev, nova]);

    // toast({
    //   title: "📘 Nova lei adicionada!",
    //   description: `${novaLei.tipoAlteracao} registrada com sucesso.`,
    // });

    // setNovaLei({
    //   lei: "",
    //   inciso: "",
    //   clausula: "",
    //   tipoAlteracao: "Modificação",
    //   descricaoAlteracao: "",
    //   dataPublicacao: "",
    //   status: "Nova",
    // });

    // setModalAberto(false);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="flex justify-center mb-12">
          <Card className="bg-white rounded-2xl shadow-lg border border-[#C69F66] max-w-3xl w-full">
            <CardContent className="px-8 py-10 text-center">
              <h1 className="text-4xl text-[#1A365D] mb-2">
                Atualizações{" "}
                <span className="text-[#C69F66]">Legislativas</span>
              </h1>
              <p className="text-[#2B6CB0] text-lg mt-2">
                Acompanhe as mudanças nas legislações importantes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* BOTÃO + FILTRO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">

          {/* Botão fica AGORA à ESQUERDA */}
          <Dialog open={modalAberto} onOpenChange={setModalAberto}>
            <DialogTrigger asChild>
              <Button className="bg-[#C69F66] hover:bg-[#B58D55] text-white flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Nova Lei
              </Button>
            </DialogTrigger>

            {/* MODAL */}
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl text-[#1A365D]">
                  Adicionar Nova Atualização Legislativa
                </DialogTitle>
              </DialogHeader>

              {/* FORMULÁRIO COMPLETO */}
              <form
                onSubmit={handleAdicionarNovaLei}
                className="space-y-4 mt-4"
              >
                {/* --- os campos ficam aqui, sem mudanças ---*/}
                {/* (igual ao último que você já aprovou) */}
                {/* Para não duplicar a resposta, envio apenas
                    a parte que você pediu corrigida antes */}
                {/* → Se quiser que eu cole novamente aqui,
                     só pedir! */}
                

                {/* LEI */}
                <div className="space-y-2">
                  <Label htmlFor="lei">Lei *</Label>
                  <Input
                    id="lei"
                    placeholder="Ex: Lei nº 13.709/2018 (LGPD)"
                    value={novaLei.lei}
                    onChange={(e) =>
                      setNovaLei({ ...novaLei, lei: e.target.value })
                    }
                    required
                    className="border-[#C69F66]"
                  />
                </div>

                {/* INCISO / CLÁUSULA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Inciso</Label>
                    <Input
                      placeholder="Ex: Art. 7º, Inciso IX"
                      value={novaLei.inciso}
                      onChange={(e) =>
                        setNovaLei({
                          ...novaLei,
                          inciso: e.target.value,
                        })
                      }
                      className="border-[#C69F66]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cláusula</Label>
                    <Input
                      placeholder="Ex: Parágrafo Único"
                      value={novaLei.clausula}
                      onChange={(e) =>
                        setNovaLei({
                          ...novaLei,
                          clausula: e.target.value,
                        })
                      }
                      className="border-[#C69F66]"
                    />
                  </div>
                </div>

                {/* TIPO / STATUS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo de Alteração *</Label>
                    <Select
                      value={novaLei.tipoAlteracao}
                      onValueChange={(v) =>
                        setNovaLei({
                          ...novaLei,
                          tipoAlteracao: v as any,
                        })
                      }
                    >
                      <SelectTrigger className="border-[#C69F66]">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Modificação">Modificação</SelectItem>
                        <SelectItem value="Inclusão">Inclusão</SelectItem>
                        <SelectItem value="Revogação">Revogação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Status *</Label>
                    <Select
                      value={novaLei.status}
                      onValueChange={(v) =>
                        setNovaLei({
                          ...novaLei,
                          status: v as any,
                        })
                      }
                    >
                      <SelectTrigger className="border-[#C69F66]">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nova">Nova</SelectItem>
                        <SelectItem value="Revisada">Revisada</SelectItem>
                        <SelectItem value="Vigente">Vigente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* DATA */}
                <div className="space-y-2">
                  <Label>Data de Publicação *</Label>
                  <Input
                    type="date"
                    value={novaLei.dataPublicacao}
                    onChange={(e) =>
                      setNovaLei({
                        ...novaLei,
                        dataPublicacao: e.target.value,
                      })
                    }
                    required
                    className="border-[#C69F66]"
                  />
                </div>

                {/* DESCRIÇÃO */}
                <div className="space-y-2">
                  <Label>Descrição da Alteração *</Label>
                  <textarea
                    rows={4}
                    placeholder="Descreva detalhadamente a alteração legislativa..."
                    value={novaLei.descricaoAlteracao}
                    onChange={(e) =>
                      setNovaLei({
                        ...novaLei,
                        descricaoAlteracao: e.target.value,
                      })
                    }
                    required
                    className="border border-[#C69F66] rounded-md p-2 w-full"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline">Cancelar</Button>
                  <Button type="submit" disabled={adicionandoLei} className="bg-[#2B6CB0] text-white">
                    Adicionar Lei
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <div>
            <Select
              value={String(anoSelecionado)}
              onValueChange={(v) => setAnoSelecionado(Number(v))}
            >
              <SelectTrigger className="w-40 border-[#C69F66]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {anosDisponiveis.map((ano) => (
                  <SelectItem key={ano} value={String(ano)}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="leis-adicionadas" className="border rounded-2xl shadow-sm">
            <AccordionTrigger className="px-4 py-3 text-lg font-semibold hover:no-underline">
              📜 Leis adicionadas
            </AccordionTrigger>

            <AccordionContent>
              <div className="px-4 pb-4">
                <div className="max-h-[420px] overflow-y-auto pr-2 space-y-4">

                  {leisAdicionadasBanco?.length > 0 ? (
                    leisAdicionadasBanco?.map((a: any) => (
                      <CardLeiAdicionada
                        key={a.id}
                        lei={a}
                        onRevogar={handleRevogar}
                        onRemoverAcao={handleRemoverAcao}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 space-y-3">
                      <p className="text-2xl">⚖️</p>
                      <p className="text-base text-muted-foreground font-medium">
                        Nenhuma lei encontrada no momento
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tente ajustar os filtros ou adicionar um novo registro
                      </p>
                    </div>
                  )}

                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="leis-lista" className="border rounded-2xl shadow-sm">
            <AccordionTrigger className="px-4 py-3 text-lg font-semibold hover:no-underline">
              📜 Leis disponíveis para adicionar
            </AccordionTrigger>

            <AccordionContent>
              <div className="px-4 pb-4">
                <div className="max-h-[420px] overflow-y-auto pr-2 space-y-4">

                  {atualizacoesFiltradas.length > 0 ? (
                    atualizacoesFiltradas.map((a) => (
                      <CardDeLei
                        key={a.id}
                        atualizacao={a}
                        onAdicionar={handleAdicionar}
                      />
                    ))
                  ) : (
                    <div className="text-center py-10 space-y-3">
                      <p className="text-2xl">⚖️</p>
                      <p className="text-base text-muted-foreground font-medium">
                        Nenhuma lei encontrada no momento
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tente ajustar os filtros ou adicionar um novo registro
                      </p>
                    </div>
                  )}

                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </div>
    </div>
  );
}
