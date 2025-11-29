"use client";
import { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FormularioDoUsuario, type DadosDoFormulario } from './componentes/FormularioDoUsuario';
import { CardDeUsuario } from './componentes/CardDeUsuario';

export interface User {
  id: number;
  usuario: string;
  nome: string;
  email: string;
  status: 'Ativo' | 'Inativo';
  criadoEm: string; 
  cargo: 'Gestor' | 'Curador' | 'Usuário' | null; 
}

const API_URL = 'http://localhost:3001/api';

export default function ManagementPage() {
  const { toast } = useToast(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      
      try {
        const response = await fetch(`${API_URL}/getUsers`,
          { headers: {
            'Authorization': `Bearer ${token}`
          }
        }
        );
        if (!response.ok) throw new Error('Falha ao buscar usuários');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Erro de conexão",
          description: "Não foi possível carregar a lista de usuários."
        });
      }
    };
    fetchUsers();
  }, [toast]); // Adicionado toast nas dependências

  const handleOpenModal = (user: User | null) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (formData: DadosDoFormulario) => {
    const token = localStorage.getItem("token");

    try {
      const isEditing = !!editingUser;
      const url = isEditing ? `${API_URL}/users/${editingUser.id}` : `${API_URL}/users`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ocorreu um erro ao salvar o usuário.');
      }

      const savedUser = await response.json();

      if (isEditing) {
        setUsers(users.map(u => (u.id === savedUser.id ? savedUser : u)));
        toast({
          title: "Sucesso!",
          description: "Usuário atualizado com sucesso.",
        });
      } else {
        setUsers(prevUsers => [...prevUsers, savedUser]);
        toast({
          title: "Sucesso!",
          description: "Novo usuário cadastrado.",
        });
      }
      
      handleCloseModal();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: errorMessage,
      });
      throw error; 
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const token = localStorage.getItem("token");

    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Falha ao excluir usuário.');

        setUsers(users.filter(user => user.id !== userId));
        toast({
          title: "Usuário excluído",
          description: "O usuário foi removido do sistema com sucesso.",
        });
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
        toast({
          variant: "destructive",
          title: "Erro ao excluir",
          description: errorMessage,
        });
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1A365D]">Gerenciamento de Usuários</h1>
            <p className="mt-1 text-gray-600">Adicione, edite ou visualize os usuários do sistema.</p>
          </div>
          <Button
            style={{ backgroundColor: '#2c5582' }}
            className="text-white hover:opacity-90 flex items-center gap-2"
            onClick={() => handleOpenModal(null)}
          >
            <UserPlus className="h-5 w-5" />
            Cadastrar Usuário
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <CardDeUsuario
              key={user.id}
              user={user}
              onEdit={() => handleOpenModal(user)}
              onDelete={() => handleDeleteUser(user.id)}
            />
          ))}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</DialogTitle>
            <DialogDescription>
                Preencha as informações abaixo para salvar o usuário.
            </DialogDescription>
          </DialogHeader>
          <FormularioDoUsuario
            onSave={handleSaveUser}
            onCancel={handleCloseModal}
            initialData={editingUser}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}