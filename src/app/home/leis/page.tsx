"use client";
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CardDeLei } from './componentes/CardDeLei';

// Tipo para as atualizações de leis
export interface AtualizacaoLei {
  id: number;
  lei: string;
  inciso?: string;
  clausula?: string;
  tipoAlteracao: 'Modificação' | 'Inclusão' | 'Revogação';
  descricaoAlteracao: string;
  dataPublicacao: string;
  status: 'Nova' | 'Revisada' | 'Vigente';
}

export default function PaginaDeLeis() {
  // Dados mockados de atualizações de leis
  const [atualizacoes] = useState<AtualizacaoLei[]>([
    {
      id: 1,
      lei: "Lei nº 13.709/2018 (LGPD)",
      inciso: "Art. 7º, Inciso IX",
      tipoAlteracao: "Modificação",
      descricaoAlteracao: "Alteração nas condições de tratamento de dados pessoais quando necessário para atender aos interesses legítimos do controlador ou de terceiro.",
      dataPublicacao: "2024-01-15",
      status: "Vigente"
    },
    {
      id: 2,
      lei: "Código Civil - Lei nº 10.406/2002",
      inciso: "Art. 421",
      clausula: "Parágrafo Único",
      tipoAlteracao: "Inclusão",
      descricaoAlteracao: "Inclusão de dispositivo sobre a função social do contrato e seus limites. A liberdade contratual será exercida nos limites da função social do contrato.",
      dataPublicacao: "2024-02-20",
      status: "Nova"
    },
    {
      id: 3,
      lei: "Lei nº 8.078/1990 (CDC)",
      inciso: "Art. 39, Inciso IV",
      tipoAlteracao: "Modificação",
      descricaoAlteracao: "Ampliação das práticas abusivas no fornecimento de produtos ou serviços, incluindo novas modalidades de venda casada e condições contratuais abusivas.",
      dataPublicacao: "2024-03-10",
      status: "Revisada"
    },
    {
      id: 4,
      lei: "Lei nº 14.195/2021",
      inciso: "Art. 2º",
      tipoAlteracao: "Revogação",
      descricaoAlteracao: "Revogação de dispositivo sobre prazos contratuais em operações de crédito durante período emergencial.",
      dataPublicacao: "2023-12-05",
      status: "Vigente"
    },
    {
      id: 5,
      lei: "Lei nº 13.874/2019 (Lei da Liberdade Econômica)",
      inciso: "Art. 3º, Inciso VII",
      tipoAlteracao: "Modificação",
      descricaoAlteracao: "Modificação dos requisitos para reconhecimento de responsabilidade solidária entre empresas de mesmo grupo econômico em relações contratuais.",
      dataPublicacao: "2024-01-30",
      status: "Vigente"
    },
    {
      id: 6,
      lei: "Código de Processo Civil - Lei nº 13.105/2015",
      inciso: "Art. 190",
      clausula: "Cláusula de Negócio Processual",
      tipoAlteracao: "Inclusão",
      descricaoAlteracao: "Inclusão de novas hipóteses de negócios processuais atípicos em contratos empresariais, permitindo maior flexibilidade na resolução de disputas.",
      dataPublicacao: "2024-02-28",
      status: "Nova"
    }
  ]);

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Card de boas-vindas */}
        <div className="flex justify-center mb-12">
          <Card className="bg-white rounded-2xl shadow-[0_8px_32px_0_rgba(26,54,93,0.12)] border-[1.5px] border-[#C69F66] max-w-3xl w-full">
            <CardContent className="px-8 py-10 text-center">
              <h1 className="text-4xl text-[#1A365D] mb-2">
                Atualizações <span className="text-[#C69F66]">Legislativas</span>
              </h1>
              <p className="text-[#2B6CB0] text-lg mt-2">
                Acompanhe as mudanças em leis, incisos e cláusulas relevantes para seus contratos.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-[#1A365D] to-[#2B6CB0] text-white border-0">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold">{atualizacoes.length}</p>
              <p className="text-sm mt-1 opacity-90">Total de Atualizações</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#2B6CB0] to-[#3182CE] text-white border-0">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold">
                {atualizacoes.filter(a => a.status === 'Nova').length}
              </p>
              <p className="text-sm mt-1 opacity-90">Novas Atualizações</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#C69F66] to-[#D4A574] text-white border-0">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold">
                {atualizacoes.filter(a => a.status === 'Vigente').length}
              </p>
              <p className="text-sm mt-1 opacity-90">Em Vigência</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de atualizações */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#1A365D] mb-4">
            Últimas Atualizações
          </h2>
          {atualizacoes.map((atualizacao) => (
            <CardDeLei key={atualizacao.id} atualizacao={atualizacao} />
          ))}
        </div>
      </div>
    </div>
  );
}
