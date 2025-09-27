import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface DadosDoFormulario {
  usuario: string;
  nome: string;
  email: string;
  status: 'Ativo' | 'Inativo';
  senha?: string; // senha é opcional na edição
}

interface PropsFormDeUsuario {
  initialData?: DadosDoFormulario | null;
  onSave: (data: DadosDoFormulario) => void;
  onCancel: () => void;
}

export const FormularioDoUsuario = ({ initialData, onSave, onCancel }: PropsFormDeUsuario) => {
  const [formDados, setDadosDoForm] = useState<DadosDoFormulario>({
    usuario: '',
    nome: '',
    email: '',
    status: 'Ativo',
    senha: '',
  });

  // efeito para preencher o formulário quando estiver em modo de edição
  useEffect(() => {
    if (initialData) {
      setDadosDoForm({
        ...initialData,
        senha: '' // sempre limpa o campo senha por segurança
      });
    } else {
      // limpa o formulário se não houver dados iniciais (modo de criação)
       setDadosDoForm({ usuario: '', nome: '', email: '', status: 'Ativo', senha: '' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setDadosDoForm(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formDados);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">Usuário</label>
        <Input id="usuario" type="text" placeholder="Ex: ana.silva" className="mt-1" value={formDados.usuario} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
        <Input id="nome" type="text" placeholder="Ex: Ana Silva" className="mt-1" value={formDados.nome} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
        <Input id="email" type="email" placeholder="Ex: ana.silva@example.com" className="mt-1" value={formDados.email} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select id="status" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={formDados.status} onChange={handleChange}>
          <option>Ativo</option>
          <option>Inativo</option>
        </select>
      </div>
       <div>
        <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
        <Input id="senha" type="password" placeholder={initialData ? "Deixe em branco para não alterar" : "********"} className="mt-1" value={formDados.senha} onChange={handleChange} required={!initialData} />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" style={{ backgroundColor: '#2c5582' }} className="text-white hover:opacity-90">Salvar Usuário</Button>
      </div>
    </form>
  );
};