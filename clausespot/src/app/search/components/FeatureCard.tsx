import { Card, CardContent } from './card';
import { Button } from './button';

interface FeatureCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

export const FeatureCard = ({ title, description, onClick }: FeatureCardProps) => {
  return (
    // O Card principal que é clicável
    <Card className="shadow-lg bg-white border-0 cursor-pointer hover:shadow-xl transition-shadow" onClick={onClick}>
      <CardContent className="p-6 text-center">
        
        {/* O botão que exibe o título */}
        <Button style={{ backgroundColor: '#2c5582' }} 
        className="w-full py-3 text-white font-medium rounded-lg mb-4 hover:opacity-90">{title}</Button>

        {/* O parágrafo que exibe a descrição */}
        <p className="text-gray-600 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};
