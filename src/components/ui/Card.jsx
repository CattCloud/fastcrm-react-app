export const Card = ({ children, className = '', hoverable = false, ...props }) => (
  <div
    className={`
      bg-white border border-[#E3F2FD] rounded-md shadow-[0_2px_8px_rgba(0,164,239,0.08)]
      transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
      ${hoverable ? 'hover:shadow-[0_4px_16px_rgba(0,164,239,0.15)] hover:border-[#BBDEFB] cursor-pointer' : ''}
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
);