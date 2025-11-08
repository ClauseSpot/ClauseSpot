"use client";
import { useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CardDeLei } from './componentes/CardDeLei';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useQueryGetLeis } from '@/app/hooks/useQueryGetLeis';

export interface AtualizacaoLei {
  id: number;
  lei: string;
  inciso?: string;
  clausula?: string;
  tipoAlteracao: 'Modificação' | 'Inclusão' | 'Revogação';
  descricaoAlteracao: string;
  dataPublicacao: string;
  status: 'Nova' | 'Revisada' | 'Vigente';
  acaoUsuario?: 'Adicionada' | 'Revogada';
  // Campos da API
  uri?: string;
  siglaTipo?: string;
  codTipo?: number;
  numero?: number;
  ano?: number;
}

export default function PaginaDeLeis() {
  const anoAtual = new Date().getFullYear();
  const [anoSelecionado, setAnoSelecionado] = useState<number>(anoAtual);
  const [modalAberto, setModalAberto] = useState(false);
  
  // Buscar dados da API
  const { data: leisAPI, isLoading, isError } = useQueryGetLeis();
  
  const [novaLei, setNovaLei] = useState({
    lei: '',
    inciso: '',
    clausula: '',
    tipoAlteracao: 'Modificação' as 'Modificação' | 'Inclusão' | 'Revogação',
    descricaoAlteracao: '',
    dataPublicacao: '',
    status: 'Nova' as 'Nova' | 'Revisada' | 'Vigente'
  });
  
  const [leisAdicionadas, setLeisAdicionadas] = useState<AtualizacaoLei[]>([]);
  const [acoesUsuario, setAcoesUsuario] = useState<Record<number, 'Adicionada' | 'Revogada'>>({});

  // Converter dados da API para o formato do componente
  const atualizacoes = useMemo<AtualizacaoLei[]>(() => {
    if (!leisAPI?.data) return leisAdicionadas;

    const leisDaAPI = leisAPI.data.map((lei) => {
      // Determinar tipo de alteração baseado no siglaTipo
      let tipoAlteracao: 'Modificação' | 'Inclusão' | 'Revogação' = 'Modificação';
      if (lei.siglaTipo.includes('INC') || lei.siglaTipo.includes('EMC')) {
        tipoAlteracao = 'Inclusão';
      } else if (lei.siglaTipo.includes('REV')) {
        tipoAlteracao = 'Revogação';
      }

      // Determinar status baseado no ano
      let status: 'Nova' | 'Revisada' | 'Vigente' = 'Vigente';
      if (lei.ano === anoAtual) {
        status = 'Nova';
      } else if (lei.ano === anoAtual - 1) {
        status = 'Revisada';
      }

      const leiFormatada: AtualizacaoLei = {
        id: lei.id,
        lei: `${lei.siglaTipo} ${lei.numero}/${lei.ano || 'S/A'}`,
        inciso: lei.codTipo ? `Código: ${lei.codTipo}` : undefined,
        tipoAlteracao,
        descricaoAlteracao: lei.ementa || 'Sem ementa disponível',
        dataPublicacao: new Date().toISOString().split('T')[0], // Data atual como fallback
        status,
        acaoUsuario: acoesUsuario[lei.id],
        // Dados originais da API
        uri: lei.uri,
        siglaTipo: lei.siglaTipo,
        codTipo: lei.codTipo,
        numero: lei.numero,
        ano: lei.ano,
      };

      return leiFormatada;
    });

    // Combinar leis da API com leis adicionadas manualmente
    return [...leisDaAPI, ...leisAdicionadas];
  }, [leisAPI, leisAdicionadas, acoesUsuario, anoAtual]);

  const anosDisponiveis = Array.from(
    new Set(
      atualizacoes.map(atualizacao => {
        const ano = new Date(atualizacao.dataPublicacao).getFullYear();
        return isNaN(ano) ? anoAtual : ano;
      })
    )
  ).sort((a, b) => b - a);

  const atualizacoesFiltradas = atualizacoes
    .filter(atualizacao => {
      const anoPublicacao = new Date(atualizacao.dataPublicacao).getFullYear();
      return isNaN(anoPublicacao) ? false : anoPublicacao === anoSelecionado;
    })
    .sort((a, b) => {
      return new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime();
    });

  const handleAdicionar = (id: number) => {
    setAcoesUsuario(prev => ({
      ...prev,
      [id]: 'Adicionada'
    }));
  };

  const handleRevogar = (id: number) => {
    setAcoesUsuario(prev => ({
      ...prev,
      [id]: 'Revogada'
    }));
  };

  const handleRemoverAcao = (id: number) => {
    setAcoesUsuario(prev => {
      const newActions = { ...prev };
      delete newActions[id];
      return newActions;
    });
  };

  const handleAdicionarNovaLei = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoId = Math.max(0, ...atualizacoes.map(a => a.id), ...leisAdicionadas.map(a => a.id)) + 1;
    
    const leiCompleta: AtualizacaoLei = {
      id: novoId,
      lei: novaLei.lei,
      inciso: novaLei.inciso || undefined,
      clausula: novaLei.clausula || undefined,
      tipoAlteracao: novaLei.tipoAlteracao,
      descricaoAlteracao: novaLei.descricaoAlteracao,
      dataPublicacao: novaLei.dataPublicacao,
      status: novaLei.status
    };

    setLeisAdicionadas(prev => [...prev, leiCompleta]);
    
    // Resetar o formulário
    setNovaLei({
      lei: '',
      inciso: '',
      clausula: '',
      tipoAlteracao: 'Modificação',
      descricaoAlteracao: '',
      dataPublicacao: '',
      status: 'Nova'
    });
    
    setModalAberto(false);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4 py-8">
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#C69F66]" />
            <p className="ml-3 text-[#1A365D]">Carregando legislações...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card className="bg-red-50 border-red-200 mb-6">
            <CardContent className="p-6 text-center">
              <p className="text-red-700">
                Erro ao carregar as legislações. Por favor, tente novamente mais tarde.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !isError && (
          <>
        {/* Filtro de Ano e Botão Adicionar Lei */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Dialog open={modalAberto} onOpenChange={setModalAberto}>
            <DialogTrigger asChild>
              <Button className="bg-[#C69F66] hover:bg-[#B58D55] text-white flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Nova Lei
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl text-[#1A365D]">
                  Adicionar Nova Atualização Legislativa
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleAdicionarNovaLei} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="lei" className="text-[#1A365D] font-medium">
                    Lei <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lei"
                    placeholder="Ex: Lei nº 13.709/2018 (LGPD)"
                    value={novaLei.lei}
                    onChange={(e) => setNovaLei({...novaLei, lei: e.target.value})}
                    required
                    className="border-[#C69F66] focus:ring-[#C69F66]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inciso" className="text-[#1A365D] font-medium">
                      Inciso
                    </Label>
                    <Input
                      id="inciso"
                      placeholder="Ex: Art. 7º, Inciso IX"
                      value={novaLei.inciso}
                      onChange={(e) => setNovaLei({...novaLei, inciso: e.target.value})}
                      className="border-[#C69F66] focus:ring-[#C69F66]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clausula" className="text-[#1A365D] font-medium">
                      Cláusula
                    </Label>
                    <Input
                      id="clausula"
                      placeholder="Ex: Parágrafo Único"
                      value={novaLei.clausula}
                      onChange={(e) => setNovaLei({...novaLei, clausula: e.target.value})}
                      className="border-[#C69F66] focus:ring-[#C69F66]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipoAlteracao" className="text-[#1A365D] font-medium">
                      Tipo de Alteração <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={novaLei.tipoAlteracao}
                      onValueChange={(value: 'Modificação' | 'Inclusão' | 'Revogação') => 
                        setNovaLei({...novaLei, tipoAlteracao: value})
                      }
                    >
                      <SelectTrigger className="border-[#C69F66]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Modificação">Modificação</SelectItem>
                        <SelectItem value="Inclusão">Inclusão</SelectItem>
                        <SelectItem value="Revogação">Revogação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-[#1A365D] font-medium">
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={novaLei.status}
                      onValueChange={(value: 'Nova' | 'Revisada' | 'Vigente') => 
                        setNovaLei({...novaLei, status: value})
                      }
                    >
                      <SelectTrigger className="border-[#C69F66]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nova">Nova</SelectItem>
                        <SelectItem value="Revisada">Revisada</SelectItem>
                        <SelectItem value="Vigente">Vigente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataPublicacao" className="text-[#1A365D] font-medium">
                    Data de Publicação <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dataPublicacao"
                    type="date"
                    value={novaLei.dataPublicacao}
                    onChange={(e) => setNovaLei({...novaLei, dataPublicacao: e.target.value})}
                    required
                    className="border-[#C69F66] focus:ring-[#C69F66]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricaoAlteracao" className="text-[#1A365D] font-medium">
                    Descrição da Alteração <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="descricaoAlteracao"
                    placeholder="Descreva detalhadamente a alteração legislativa..."
                    value={novaLei.descricaoAlteracao}
                    onChange={(e) => setNovaLei({...novaLei, descricaoAlteracao: e.target.value})}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-[#C69F66] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C69F66] resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalAberto(false)}
                    className="border-gray-300"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#2B6CB0] hover:bg-[#1A365D] text-white"
                  >
                    Adicionar Lei
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-[#1A365D] to-[#2B6CB0] text-white border-0">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold">{atualizacoesFiltradas.length}</p>
              <p className="text-sm mt-1 opacity-90">Atualizações em {anoSelecionado}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#2B6CB0] to-[#3182CE] text-white border-0">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold">
                {atualizacoesFiltradas.filter(a => a.status === 'Nova').length}
              </p>
              <p className="text-sm mt-1 opacity-90">Novas Atualizações</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-[#C69F66] to-[#D4A574] text-white border-0">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold">
                {atualizacoesFiltradas.filter(a => a.status === 'Vigente').length}
              </p>
              <p className="text-sm mt-1 opacity-90">Em Vigência</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#1A365D] mb-4">
            Últimas Atualizações de {anoSelecionado}
          </h2>
          {atualizacoesFiltradas.length > 0 ? (
            atualizacoesFiltradas.map((atualizacao) => (
              <CardDeLei 
                key={atualizacao.id} 
                atualizacao={atualizacao}
                onAdicionar={handleAdicionar}
                onRevogar={handleRevogar}
                onRemoverAcao={handleRemoverAcao}
              />
            ))
          ) : (
            <Card className="bg-white border-[1.5px] border-gray-200">
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">
                  Nenhuma atualização legislativa encontrada para o ano de {anoSelecionado}.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
}
