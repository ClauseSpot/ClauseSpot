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
import { useToast } from "@/components/ui/use-toast";

interface LeiProps {
  id: number,
  codigo: string,
  titulo: string,
  conteudo: string,
  adicionadoEm: string,
}

interface CardDeLeiProps {
  lei: LeiProps;
  onRevogar: (id: number) => void;
  onRemoverAcao: (id: number) => void;
}

export const CardLeiAdicionada = ({
  lei,
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

  const handleRevogar = (id: number) => {
    onRevogar(id);
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
                  {lei.titulo}
                </h3>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {lei.conteudo}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                Adicionada em:{" "}
                <span className="font-semibold">
                  {(new Date(lei?.adicionadoEm).toLocaleDateString('pt-br'))}
                </span>
              </span>
            </div>
          </div>

          <div className="lg:w-48 flex lg:flex-col items-center lg:items-end gap-3">
            <div className="flex lg:flex-col gap-2 w-full lg:w-auto">
              <Button
                onClick={() => handleRevogar(lei.id)}
                variant="outline"
                className="border-[#C69F66] text-[#C69F66] hover:bg-[#C69F66] hover:text-white text-xs py-2 px-4 flex items-center gap-2 transition-colors"
                size="sm"
              >
                <Ban className="h-4 w-4" />
                Revogar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
