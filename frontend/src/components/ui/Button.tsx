import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "voice";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2 shadow-sm",
    lg: "px-6 py-3.5 text-base gap-2.5 shadow-md",
  };

  const variantStyles = {
    primary: "bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 shadow-slate-900/10",
    secondary: "bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 shadow-emerald-600/10",
    outline: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
    danger: "bg-rose-600 hover:bg-rose-700 text-white border border-rose-600",
    voice: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20",
  };

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
