import { X } from 'lucide-react';
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md shadow-[0_4px_16px_rgba(0,164,239,0.15)] max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b border-[#E3F2FD]">
          <h3 className="text-lg font-semibold text-[#263238]">{title}</h3>
          <button onClick={onClose} className="text-[#546E7A] hover:text-[#263238]">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};