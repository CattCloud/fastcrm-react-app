import { Card } from './Card';
import { Button } from './Button';


export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-[#263238] mb-2">{title}</h3>
        <p className="text-[#546E7A] mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button 
            variant={type} 
            onClick={onConfirm}
            className="flex-1"
          >
            Confirmar
          </Button>
        </div>
      </Card>
    </div>
  );
};