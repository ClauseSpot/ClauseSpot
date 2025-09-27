import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Reutilizando o botão

export const RowTabelaUsuario = ({ user }: { user: any }) => {
  const statusColor = user.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-3 px-4">{user.name}</td>
      <td className="py-3 px-4">{user.email}</td>
      <td className="py-3 px-4">{user.role}</td>
      <td className="py-3 px-4">
        <span className={`py-1 px-3 rounded-full text-xs ${statusColor}`}>
          {user.status}
        </span>
      </td>
      <td className="py-3 px-4 flex items-center gap-2">
        <Button variant="outline" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};
