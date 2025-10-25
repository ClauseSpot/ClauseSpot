import { Search, Filter, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { Input } from '../../../../components/ui/input'; 
import { Button } from '../../../../components/ui/button';
import { Card, CardContent } from '../../../../components/ui/card';

interface SearchSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isFilterOpen: boolean;
  toggleFilter: () => void;
  handleSearch: () => void;
  handleClear: () => void;
}

export const SearchSection = ({ searchTerm, setSearchTerm, isFilterOpen, toggleFilter, handleSearch, handleClear }: SearchSectionProps) => {
  return (
    <div className="flex justify-center mb-12 animate-fade-in">
      <Card className="shadow-lg bg-white border-0 w-full max-w-2xl">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input type="text" placeholder="Digite sua busca aqui..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-3 w-full border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500" onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
                    </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleSearch} style={{ backgroundColor: '#2c5582' }} className="text-white hover:opacity-90" disabled={!searchTerm.trim()}><Search className="w-4 h-4 mr-2" />Buscar</Button>
              <Button onClick={handleClear} variant="outline" style={{ borderColor: '#2c5582' }} className="text-gray-700 hover:bg-gray-50" disabled={!searchTerm}><X className="w-4 h-4 mr-2" />Limpar</Button>
              <Button onClick={toggleFilter} 
                className={twMerge(clsx('text-white', !isFilterOpen && 'bg-orange-400 hover:bg-orange-500'))}
                style={isFilterOpen ? { backgroundColor: '#2c5582' } : {}}
              >
                <Filter className="w-4 h-4 mr-2" />Filtros
              </Button>
            </div>
            {isFilterOpen && (
              <div className="mt-6 p-6 rounded-lg border" style={{ backgroundColor: '#f8f9fa', borderColor: '#e9ecef' }}>
                <h3 className="mb-4 text-gray-800 font-semibold">Filtros Avançados</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Categoria</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white">
                      <option>Todas</option>
                      <option>Contratos de Trabalho</option>
                      <option>Contratos Comerciais</option>
                      <option>Contratos de Prestação</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Período</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white">
                      <option>Qualquer período</option>
                      <option>Último mês</option>
                      <option>Últimos 3 meses</option>
                      <option>Último ano</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            {searchTerm && (
              <div className="mt-6 p-6 rounded-lg bg-blue-50 border border-blue-200">
                <h3 className="mb-2 text-gray-800 font-semibold">Resultados da busca</h3>
                <p className="text-gray-600">Buscando por: "<strong className="text-blue-600">{searchTerm}</strong>"</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
