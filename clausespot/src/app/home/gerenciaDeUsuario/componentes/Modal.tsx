import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ title, isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in bg-[url('/ClauseSpotBg.png')] bg-cover bg-center">
      <Card className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

