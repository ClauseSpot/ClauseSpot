import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PropsCardDeBusca {
  titulo: string;
  descricao: string;
  onClick: () => void;
}

export const CardDeBusca = ({ titulo, descricao, onClick }: PropsCardDeBusca) => {
  return (
    // O Card principal que é clicável
    <Card className="shadow-lg bg-white border-0 cursor-pointer hover:shadow-xl transition-shadow" onClick={onClick}>
      <CardContent className="p-6 text-center">
        
        {/* O botão que exibe o título */}
        <Button style={{ backgroundColor: '#2c5582' }} 
        className="w-full py-3 text-white font-medium rounded-lg mb-4 hover:opacity-90">{titulo}</Button>

        {/* O parágrafo que exibe a descrição */}
        <p className="text-gray-600 text-sm">{descricao}</p>
      </CardContent>
    </Card>
  );
};