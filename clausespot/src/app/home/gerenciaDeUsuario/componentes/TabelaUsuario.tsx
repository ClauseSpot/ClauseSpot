import { RowTabelaUsuario} from './RowTabelaUsuario';

// Dados de exemplo.
const users = [
  { id: 1, name: 'Davi Castilho', email: 'davi@email.com', status: 'Ativo' },
  { id: 2, name: 'Leonardo Hilario', email: 'leonardo@email.com', status: 'Ativo' },
  { id: 3, name: 'Gabriel Torezan', email: 'gabrielt@email.com', status: 'Ativo' },
  { id: 4, name: 'Gabriel Vinente', email: 'gabrielv@email.com', status: 'Ativo' },
];

export const TabelaUsuario = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50 border-b">
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Nome</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">E-mail</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Cargo</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Status</th>
            <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-gray-600">Ações</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {users.map(user => (
            <RowTabelaUsuario key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
