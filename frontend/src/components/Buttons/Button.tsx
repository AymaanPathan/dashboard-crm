import React from "react";

interface NotionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  icon?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<NotionButtonProps> = ({
  children,
  variant = "primary",
  icon,
  className = "",
  ...props
}) => {
  const baseStyles =
    "h-8 px-3 text-sm font-medium rounded-md transition-all inline-flex items-center gap-2";

  const variants = {
    primary: "bg-gray-800 hover:bg-black text-white",
    secondary: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  };

  return (
    <button
      className={`${baseStyles} cursor-pointer ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
