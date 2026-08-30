import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
  hoverEffect = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 transition-all duration-200 ${
        hoverEffect ? "hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};
