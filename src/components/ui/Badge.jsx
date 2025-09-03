export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-[#E3F2FD] text-[#0D47A1] border-[#BBDEFB]',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-orange-50 text-orange-700 border-orange-200',
    danger: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <span className={`
      inline-flex items-center px-2 py-1 text-xs font-medium rounded border
      ${variants[variant]} ${className}
    `}>
      {children}
    </span>
  );
};