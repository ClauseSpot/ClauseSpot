"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { User, Mail, Shield, UserCog } from "lucide-react";
import { 
  FormularioDoUsuario, 
  type DadosDoFormulario 
} from "../gerenciaDeUsuario/componentes/FormularioDoUsuario";

interface UserProfile {
  id: number;
  usuario: string;
  nome: string;
  email: string;
  cargo: "Gestor" | "Curador" | "Usuário" | null;
  status: boolean;
}

const API_URL = 'http://localhost:3001/api';

export default function ProfilePage() {
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedInfo = localStorage.getItem("userInfo");
        if (storedInfo) {
          const parsedUser = JSON.parse(storedInfo);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleUpdateProfile = async (formData: DadosDoFormulario) => {
    if (!user) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar perfil.');
      }

      const updatedUser = await response.json();

      const newUserState = { ...user, ...updatedUser };
      setUser(newUserState);

      localStorage.setItem("userInfo", JSON.stringify(newUserState));

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
      
      setIsModalOpen(false);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido.';
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: errorMessage,
      });
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando perfil...</div>;
  if (!user) return <div className="p-8 text-center text-red-500">Não foi possível carregar os dados do usuário.</div>;

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1A365D] mb-2">Meu Perfil</h1>
        <p className="text-gray-600 mb-8">Visualize e gerencie suas informações pessoais.</p>

        <Card className="shadow-md">
          <CardHeader className="border-b bg-gray-50/50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-[#2c5582] flex items-center gap-2">
                <UserCog className="h-6 w-6" />
                Dados da Conta
              </CardTitle>
              <Button onClick={() => setIsModalOpen(true)} className="bg-[#2c5582] hover:opacity-90">
                Editar Dados
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                  <p className="text-lg font-semibold text-gray-800">{user.nome}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Usuário (Login)</p>
                  <p className="text-lg font-semibold text-gray-800">{user.usuario}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">E-mail</p>
                  <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Cargo / Permissão</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-gray-800">
                        {user.cargo || 'Cargo não definido'}
                    </p>
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Atualize suas informações. O cargo não pode ser alterado por aqui.
            </DialogDescription>
          </DialogHeader>
          
          <FormularioDoUsuario
            onSave={handleUpdateProfile}
            onCancel={() => setIsModalOpen(false)}
            initialData={{
              usuario: user.usuario,
              nome: user.nome,
              email: user.email,
              status: user.status ? "Ativo" : "Inativo",
              cargo: user.cargo,
            }}
            currentUserRole="Usuário" 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}