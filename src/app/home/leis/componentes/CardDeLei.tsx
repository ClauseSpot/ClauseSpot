import { Card, CardContent } from '@/components/ui/card';
import { Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import type { AtualizacaoLei } from '../page';

interface CardDeLeiProps {
  atualizacao: AtualizacaoLei;
}

export const CardDeLei = ({ atualizacao }: CardDeLeiProps) => {
  // Define as cores com base no tipo de alteração
  const getTipoAlteracaoColor = (tipo: string) => {
    switch (tipo) {
      case 'Modificação':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Inclusão':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Revogação':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Define as cores com base no status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nova':
        return 'bg-yellow-100 text-yellow-700';
      case 'Revisada':
        return 'bg-purple-100 text-purple-700';
      case 'Vigente':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Card className="shadow-md bg-white border-l-4 border-[#C69F66] hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Seção Principal - Informações da Lei */}
          <div className="flex-1">
            {/* Cabeçalho com Lei e Status */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#1A365D]" />
                <h3 className="text-lg font-bold text-[#1A365D]">
                  {atualizacao.lei}
                </h3>
              </div>
              <span className={`py-1 px-3 rounded-full text-xs font-semibold ${getStatusColor(atualizacao.status)}`}>
                {atualizacao.status}
              </span>
            </div>

            {/* Inciso e Cláusula */}
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

            {/* Descrição da Alteração */}
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {atualizacao.descricaoAlteracao}
            </p>

            {/* Data de Publicação */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                Publicado em: <span className="font-semibold">{formatarData(atualizacao.dataPublicacao)}</span>
              </span>
            </div>
          </div>

          {/* Seção Lateral - Tipo de Alteração */}
          <div className="lg:w-48 flex lg:flex-col items-center lg:items-end gap-2">
            <div className={`py-2 px-4 rounded-lg border-2 text-center ${getTipoAlteracaoColor(atualizacao.tipoAlteracao)}`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                {atualizacao.tipoAlteracao === 'Inclusão' && <CheckCircle className="h-4 w-4" />}
                {atualizacao.tipoAlteracao === 'Revogação' && <AlertCircle className="h-4 w-4" />}
                {atualizacao.tipoAlteracao === 'Modificação' && <FileText className="h-4 w-4" />}
              </div>
              <p className="text-xs font-bold uppercase tracking-wide">
                {atualizacao.tipoAlteracao}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
