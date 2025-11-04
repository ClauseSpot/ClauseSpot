"use client";
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CardDeLei } from './componentes/CardDeLei';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

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
}

export default function PaginaDeLeis() {
  const anoAtual = new Date().getFullYear();
  const [anoSelecionado, setAnoSelecionado] = useState<number>(anoAtual);
  const [modalAberto, setModalAberto] = useState(false);
  
  const [novaLei, setNovaLei] = useState({
    lei: '',
    inciso: '',
    clausula: '',
    tipoAlteracao: 'Modificação' as 'Modificação' | 'Inclusão' | 'Revogação',
    descricaoAlteracao: '',
    dataPublicacao: '',
    status: 'Nova' as 'Nova' | 'Revisada' | 'Vigente'
  });
  
  const [atualizacoes, setAtualizacoes] = useState<AtualizacaoLei[]>([
    {
      id: 7,
      lei: "Lei nº 13.709/2018 (LGPD)",
      inciso: "Art. 18, Inciso III",
      tipoAlteracao: "Modificação",
      descricaoAlteracao: "Ampliação dos direitos do titular de dados quanto à portabilidade de dados pessoais, incluindo novas modalidades de transferência entre controladores.",
      dataPublicacao: "2025-10-15",
      status: "Nova"
    },
    {
      id: 8,
      lei: "Lei nº 14.133/2021 (Nova Lei de Licitações)",
      inciso: "Art. 92",
      clausula: "§ 3º",
      tipoAlteracao: "Inclusão",
      descricaoAlteracao: "Inclusão de novos requisitos para contratos administrativos relacionados à sustentabilidade ambiental e práticas ESG nas contratações públicas.",
      dataPublicacao: "2025-09-22",
      status: "Vigente"
    },
    {
      id: 9,
      lei: "Código Civil - Lei nº 10.406/2002",
      inciso: "Art. 425",
      tipoAlteracao: "Modificação",
      descricaoAlteracao: "Atualização das regras sobre contratos eletrônicos e assinaturas digitais, estabelecendo novos parâmetros de validade jurídica.",
      dataPublicacao: "2025-08-10",
      status: "Vigente"
    },
    {
      id: 10,
      lei: "Lei nº 8.078/1990 (CDC)",
      inciso: "Art. 49",
      tipoAlteracao: "Modificação",
      descricaoAlteracao: "Extensão do direito de arrependimento em compras online, aumentando o prazo de 7 para 14 dias em determinadas categorias de produtos.",
      dataPublicacao: "2025-07-18",
      status: "Vigente"
    },
    {
      id: 11,
      lei: "Lei nº 13.874/2019 (Lei da Liberdade Econômica)",
      inciso: "Art. 5º",
      clausula: "Inciso II",
      tipoAlteracao: "Inclusão",
      descricaoAlteracao: "Inclusão de dispositivos sobre contratos inteligentes (smart contracts) e sua validade jurídica no âmbito empresarial.",
      dataPublicacao: "2025-06-05",
      status: "Nova"
    },
    {
      id: 12,
      lei: "Lei nº 14.457/2022 (Programa Emprega + Mulheres)",
      inciso: "Art. 12",
      tipoAlteracao: "Modificação",
      descricaoAlteracao: "Alteração nas cláusulas contratuais trabalhistas relacionadas à flexibilização do trabalho remoto para mães com filhos menores de 6 anos.",
      dataPublicacao: "2025-05-12",
      status: "Vigente"
    },
    {
      id: 13,
      lei: "Lei Complementar nº 123/2006 (Simples Nacional)",
      inciso: "Art. 3º",
      tipoAlteracao: "Modificação",
      descricaoAlteracao: "Atualização dos limites de faturamento para enquadramento de empresas no Simples Nacional, com impacto em contratos empresariais.",
      dataPublicacao: "2025-04-20",
      status: "Vigente"
    },
    {
      id: 14,
      lei: "Lei nº 9.279/1996 (Propriedade Industrial)",
      inciso: "Art. 88",
      tipoAlteracao: "Inclusão",
      descricaoAlteracao: "Inclusão de regras sobre licenciamento de patentes em contratos de tecnologia e inovação, com foco em inteligência artificial.",
      dataPublicacao: "2025-03-15",
      status: "Nova"
    },
    {
      id: 15,
      lei: "Código de Processo Civil - Lei nº 13.105/2015",
      inciso: "Art. 515",
      clausula: "§ 5º",
      tipoAlteracao: "Inclusão",
      descricaoAlteracao: "Inclusão de procedimentos para execução de sentenças em contratos internacionais com cláusula arbitral.",
      dataPublicacao: "2025-02-28",
      status: "Vigente"
    },
    {
      id: 16,
      lei: "Lei nº 12.965/2014 (Marco Civil da Internet)",
      inciso: "Art. 7º, Inciso XII",
      tipoAlteracao: "Modificação",
      descricaoAlteracao: "Modificação das regras de proteção de dados em contratos de prestação de serviços digitais, com adequação às normas internacionais.",
      dataPublicacao: "2025-01-22",
      status: "Vigente"
    },
    
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
      id: 17,
      lei: "Lei nº 8.666/1993 (Lei de Licitações - antiga)",
      inciso: "Art. 65",
      tipoAlteracao: "Revogação",
      descricaoAlteracao: "Revogação parcial de dispositivos sobre alteração unilateral de contratos administrativos.",
      dataPublicacao: "2023-06-15",
      status: "Vigente"
    }
  ]);

  const anosDisponiveis = Array.from(
    new Set(
      atualizacoes.map(atualizacao => 
        new Date(atualizacao.dataPublicacao).getFullYear()
      )
    )
  ).sort((a, b) => b - a);

  const atualizacoesFiltradas = atualizacoes
    .filter(atualizacao => {
      const anoPublicacao = new Date(atualizacao.dataPublicacao).getFullYear();
      return anoPublicacao === anoSelecionado;
    })
    .sort((a, b) => {
      return new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime();
    });

  const handleAdicionar = (id: number) => {
    setAtualizacoes(prevAtualizacoes =>
      prevAtualizacoes.map(atualizacao =>
        atualizacao.id === id
          ? { ...atualizacao, acaoUsuario: 'Adicionada' as const }
          : atualizacao
      )
    );
  };

  const handleRevogar = (id: number) => {
    setAtualizacoes(prevAtualizacoes =>
      prevAtualizacoes.map(atualizacao =>
        atualizacao.id === id
          ? { ...atualizacao, acaoUsuario: 'Revogada' as const }
          : atualizacao
      )
    );
  };

  const handleRemoverAcao = (id: number) => {
    setAtualizacoes(prevAtualizacoes =>
      prevAtualizacoes.map(atualizacao =>
        atualizacao.id === id
          ? { ...atualizacao, acaoUsuario: undefined }
          : atualizacao
      )
    );
  };

  const handleAdicionarNovaLei = (e: React.FormEvent) => {
    e.preventDefault();
    
    const novoId = Math.max(...atualizacoes.map(a => a.id)) + 1;
    
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

    setAtualizacoes(prev => [...prev, leiCompleta]);
    
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

          <div className="flex items-center gap-3">
            <label htmlFor="ano-select" className="text-[#1A365D] font-medium">
              Filtrar por período:
            </label>
            <Select
              value={anoSelecionado.toString()}
              onValueChange={(value) => setAnoSelecionado(Number(value))}
            >
              <SelectTrigger className="w-[180px] bg-white border-[#C69F66]">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {anosDisponiveis.map((ano) => (
                  <SelectItem key={ano} value={ano.toString()}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
      </div>
    </div>
  );
}
