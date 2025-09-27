"use client";
import { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from './componentes/Modal';
import { FormularioDoUsuario, type DadosDoFormulario } from './componentes/FormularioDoUsuario';
import { CardDeUsuario } from './componentes/CardDeUsuario'; 
import { Card } from '@/components/ui/card';

// interface correspondente ao banco de dados
interface User {
  id: number;
  usuario: string;
  nome: string;
  email: string;
  status: 'Ativo' | 'Inativo';
  criado_em: string;
}

// dados mockados iniciais
const initialUsers: User[] = [
  { id: 1, usuario: 'davi.c', nome: 'Davi Castilho', email: 'davi@email.com', status: 'Ativo', criado_em: new Date().toISOString() },
  { id: 2, usuario: 'gabriel.t', nome: 'Gabriel Torezan', email: 'gtorezan@email.com', status: 'Inativo', criado_em: new Date().toISOString() },
];

export default function ManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);

  useEffect(() => {
    try {
      const storedUsers = window.localStorage.getItem('managedUsers');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.error("Erro ao ler usuários do localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (users.length > 0 && JSON.stringify(users) !== JSON.stringify(initialUsers)) {
      try {
        window.localStorage.setItem('managedUsers', JSON.stringify(users));
      } catch (error) {
        console.error("Erro ao salvar usuários no localStorage", error);
      }
    }
  }, [users]);

  const handleOpenModal = () => setIsModalOpen(true);
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null); // limpa o usuário em edição ao fechar o modal
  };

  const handleSaveUser = (data: DadosDoFormulario) => {
    if (editingUser) {
      // lógica de edição
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...data } : user
      ));
    } else {
      // lógica de criação
      const { senha, ...newUserData } = data;
      const newUser = {
        ...newUserData,
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        criado_em: new Date().toISOString(),
      };
      setUsers(prevUsers => [...prevUsers, newUser]);
    }
    handleCloseModal();
  };
  
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    handleOpenModal();
  };

  const handleDeleteUser = (userId: number) => {
    // implementação de um modal de confirmação ("Tem certeza?")
    setUsers(users.filter(user => user.id !== userId));
  };

  return (
    <>
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
              onClick={handleOpenModal}
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
                onEdit={() => handleEditUser(user)}
                onDelete={() => handleDeleteUser(user.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <Modal 
        title={editingUser ? 'Editar Usuário' : 'Cadastrar Novo Usuário'} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
      >
        <FormularioDoUsuario 
          onSave={handleSaveUser} 
          onCancel={handleCloseModal} 
          initialData={editingUser}
        />
      </Modal>
    </>
  );
}