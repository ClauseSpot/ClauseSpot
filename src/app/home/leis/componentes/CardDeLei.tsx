"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Plus,
  Ban,
  X,
} from "lucide-react";
import type { AtualizacaoLei } from "../page";
import { useToast } from "@/components/ui/use-toast"; // ✅ Importa o sistema global de notificações

interface CardDeLeiProps {
  atualizacao: AtualizacaoLei;
  onAdicionar: (id: number) => void;
  onRevogar: (id: number) => void;
  onRemoverAcao: (id: number) => void;
}

export const CardDeLei = ({
  atualizacao,
  onAdicionar,
  onRevogar,
  onRemoverAcao,
}: CardDeLeiProps) => {
  const { toast } = useToast(); // ✅ Inicializa o toast

  const getTipoAlteracaoColor = (tipo: string) => {
    switch (tipo) {
      case "Modificação":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Inclusão":
        return "bg-green-100 text-green-700 border-green-300";
      case "Revogação":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Nova":
        return "bg-yellow-100 text-yellow-700";
      case "Revisada":
        return "bg-purple-100 text-purple-700";
      case "Vigente":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // ✅ Toasts personalizados para cada ação
  const handleAdicionar = (id: number) => {
    onAdicionar(id);
    toast({
      title: "✅ Lei adicionada com sucesso!",
      description: `A lei "${atualizacao.lei}" foi marcada como adicionada.`,
    });
  };

  const handleRevogar = (id: number) => {
    onRevogar(id);
    toast({
      variant: "destructive",
      title: "⚠️ Lei revogada",
      description: `A lei "${atualizacao.lei}" foi marcada como revogada.`,
    });
  };

  const handleRemover = (id: number) => {
    onRemoverAcao(id);
    toast({
      title: "↩️ Ação removida",
      description: `A marcação da lei "${atualizacao.lei}" foi removida.`,
    });
  };

  return (
    <Card className="shadow-md bg-white border-l-4 border-[#C69F66] hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#1A365D]" />
                <h3 className="text-lg font-bold text-[#1A365D]">
                  {atualizacao.lei}
                </h3>
              </div>
              <span
                className={`py-1 px-3 rounded-full text-xs font-semibold ${getStatusColor(
                  atualizacao.status
                )}`}
              >
                {atualizacao.status}
              </span>

              {atualizacao.acaoUsuario && (
                <span
                  className={`py-1 px-3 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    atualizacao.acaoUsuario === "Adicionada"
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                      : "bg-rose-100 text-rose-700 border border-rose-300"
                  }`}
                >
                  {atualizacao.acaoUsuario === "Adicionada" ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Ban className="h-3 w-3" />
                  )}
                  {atualizacao.acaoUsuario}
                  <button
                    onClick={() => handleRemover(atualizacao.id)}
                    className="ml-1 hover:opacity-70 transition-opacity"
                    title="Remover ação"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>

            {(atualizacao.inciso || atualizacao.clausula) && (
              <div className="mb-3 flex flex-wrap gap-2 text-sm">
                {atualizacao.inciso && (
                  <span className="bg-[#E2E8F0] text-[#2B6CB0] py-1 px-3 rounded-md font-medium">
                    {atualizacao.inciso}
                  </span>
                )}
                {atualizacao.clausula && (
                  <span className="bg-[#E2E8F0] text-[#2B6CB0] py-1 px-3 rounded-md font-medium">
                    {atualizacao.clausula}
                  </span>
                )}
              </div>
            )}

            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {atualizacao.descricaoAlteracao}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                Publicado em:{" "}
                <span className="font-semibold">
                  {formatarData(atualizacao.dataPublicacao)}
                </span>
              </span>
            </div>
          </div>

          <div className="lg:w-48 flex lg:flex-col items-center lg:items-end gap-3">
            <div
              className={`py-2 px-4 rounded-lg border-2 text-center ${getTipoAlteracaoColor(
                atualizacao.tipoAlteracao
              )}`}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                {atualizacao.tipoAlteracao === "Inclusão" && (
                  <CheckCircle className="h-4 w-4" />
                )}
                {atualizacao.tipoAlteracao === "Revogação" && (
                  <AlertCircle className="h-4 w-4" />
                )}
                {atualizacao.tipoAlteracao === "Modificação" && (
                  <FileText className="h-4 w-4" />
                )}
              </div>
              <p className="text-xs font-bold uppercase tracking-wide">
                {atualizacao.tipoAlteracao}
              </p>
            </div>

            {/* ✅ Botões de ação com feedback visual */}
            {!atualizacao.acaoUsuario && (
              <div className="flex lg:flex-col gap-2 w-full lg:w-auto">
                <Button
                  onClick={() => handleAdicionar(atualizacao.id)}
                  className="bg-[#2B6CB0] hover:bg-[#1A365D] text-white text-xs py-2 px-4 flex items-center gap-2 transition-colors"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
                <Button
                  onClick={() => handleRevogar(atualizacao.id)}
                  variant="outline"
                  className="border-[#C69F66] text-[#C69F66] hover:bg-[#C69F66] hover:text-white text-xs py-2 px-4 flex items-center gap-2 transition-colors"
                  size="sm"
                >
                  <Ban className="h-4 w-4" />
                  Revogar
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
