"use client";
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FeatureCard } from "@/app/home/search/componentes/FeatureCard";
import { SearchSection } from "@/app/home/search/componentes/SearchSection";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('search');

  const handleSearch = () => console.log('Buscando por:', searchTerm);
  const handleClear = () => setSearchTerm('');
  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
  const handleSectionClick = (section: string) => setActiveSection(section);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'search':
        return <SearchSection
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          isFilterOpen={isFilterOpen}
          toggleFilter={toggleFilter}
          handleSearch={handleSearch}
          handleClear={handleClear}
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
        </div> */}

        {/* Controle de navegação cards do Feature */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <FeatureCard title="Pesquisar Contratos" description="Encontre contratos rapidamente usando palavras chave ou filtros avançados." onClick={() => handleSectionClick('search')} />
            <FeatureCard title="Analisar Cláusulas" description="Identifique e analise cláusulas específicas em seus contratos com facilidade." onClick={() => handleSectionClick('analyze')} />
            <FeatureCard title="Gerar Relatórios" description="Crie relatórios detalhados sobre os contratos pesquisados para melhor tomada de decisão." onClick={() => handleSectionClick('reports')} />
        </div>

        {/* Seção Dinâmica Renderizada */}
        {renderActiveSection()}
      </div>
    </div>
  );
}

