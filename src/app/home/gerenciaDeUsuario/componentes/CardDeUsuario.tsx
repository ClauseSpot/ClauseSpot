import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { User } from '../page'; // Importando o tipo User da página principal

interface CardDeUsuarioProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}

export const CardDeUsuario = ({ user, onEdit, onDelete }: CardDeUsuarioProps) => {
  const statusIsActive = user.status === 'Ativo';
  
  return (
    <Card className="shadow-md bg-white border border-gray-200 hover:shadow-lg transition-shadow flex flex-col justify-between">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-[#1A365D]">{user.nome}</h3>
              <span className={`py-1 px-3 rounded-full text-xs font-semibold ${statusIsActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {user.status}
          </span>
        </div>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-semibold">Usuário:</span> {user.usuario}
          </p>
          <p>
            <span className="font-semibold">E-mail:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Criado em:</span> {new Date(user.criado_em).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </p>
        </div>
      </CardContent>
      <div className="border-t p-4 flex justify-end gap-2 bg-gray-50/50">
        <Button variant="outline" size="icon" onClick={onEdit} className="h-8 w-8">
            <Edit className="h-4 w-4 text-gray-600" />
        </Button>
        <Button variant="outline" size="icon" onClick={onDelete} className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default CardDeUsuario;