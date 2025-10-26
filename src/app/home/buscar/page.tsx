"use client";
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CardDeBusca } from "./componentes/CardDeBusca";
import { SecaoDeBusca } from "./componentes/SecaoDeBusca";

export default function PaginaDebusca() {
  const [termoDeBusca, setTermoDebusca] = useState('');
  const [filtroAberto, setIsFiltroAberto] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState('search');

  const handleBusca= () => console.log('Buscando por:', termoDeBusca);
  const handleLimpar = () => setTermoDebusca('');
  const toggleFiltro = () => setIsFiltroAberto(!filtroAberto);
  const handleSectionClick = (section: string) => setSecaoAtiva(section);

  const renderSecaoAtiva = () => {
    switch (secaoAtiva) {
      case 'search':
        return <SecaoDeBusca 
          termoDeBusca={termoDeBusca} 
          setTermoDeBusca={setTermoDebusca}
          filtroAberto={filtroAberto}
          toggleFiltro={toggleFiltro}
          handleBusca={handleBusca}
          handleLimpar={handleLimpar}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* <div className="flex justify-center mb-12">
          <Card className="bg-white rounded-2xl shadow-[0_8px_32px_0_rgba(26,54,93,0.12)] border-[1.5px] border-[#C69F66] max-w-2xl w-full">
            <CardContent className="px-8 py-10 text-center">
              <h1 className="text-4xl text-[#1A365D] mb-2">
                Bem-vindo à ferramenta de pesquisa do <span className="text-[#C69F66]">ClauseSpot</span>!
              </h1>
              <p className="text-[#2B6CB0] text-lg mt-2">
                Seu gerenciador inteligente de contratos.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <CardDeBusca titulo ="Pesquisar Contratos" descricao="Encontre contratos rapidamente usando palavras chave ou filtros avançados." onClick={() => handleSectionClick('search')} />
            <CardDeBusca titulo ="Analisar Cláusulas" descricao="Identifique e analise cláusulas específicas em seus contratos com facilidade." onClick={() => handleSectionClick('analyze')} />
            <CardDeBusca titulo ="Gerar Relatórios" descricao="Crie relatórios detalhados sobre os contratos pesquisados para melhor tomada de decisão." onClick={() => handleSectionClick('reports')} />
        </div>

        {renderSecaoAtiva()}
      </div>
    </div>
  );
}
