export const Button = ({ variant = 'primary', size = 'md', children, className = '', ...props }) => {
  const variants = {
    primary: 'bg-[#00A4EF] hover:bg-[#0D47A1] text-white shadow-[0_2px_8px_rgba(0,164,239,0.08)] hover:shadow-[0_4px_16px_rgba(0,164,239,0.15)]',
    secondary: 'bg-white border border-[#E3F2FD] hover:border-[#BBDEFB] text-[#263238] shadow-[0_2px_8px_rgba(0,164,239,0.08)]',
    danger: 'bg-[#F44336] hover:bg-red-700 text-white shadow-[0_2px_8px_rgba(244,67,54,0.08)]',
    ghost: 'text-[#546E7A] hover:bg-[#F8FAFC] border-transparent'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`
        ${variants[variant]} ${sizes[size]}
        rounded-md font-medium transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
        hover:transform hover:-translate-y-0.5 focus:outline-none focus:ring-3 focus:ring-[rgba(0,164,239,0.1)]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};