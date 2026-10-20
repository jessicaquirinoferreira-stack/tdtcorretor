import React from 'react';

interface BankLogoProps {
  bankId: string;
  className?: string;
}

export const BankLogo: React.FC<BankLogoProps> = ({ bankId, className = 'h-10' }) => {
  switch (bankId) {
    case 'santander':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Official Santander Flame Emblem */}
          <div className="w-10 h-10 rounded-lg bg-[#EC0000] flex items-center justify-center shrink-0 p-1.5 shadow-xs">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M50 8C43.5 18.5 45 28 49 35C52.5 41 54 48 48 56C43 62.5 35 63 32 58C30.5 55 31.5 51 33 48C28 52 25 58 26 65C27.5 74 35 81 44 83C38 80 36 74 37 70C38 66 42 63 46 65C50 67 52 72 50 78C55 76 60 72 62 66C64 60 62 55 58 52C53 48 51 43 53 38C56 31 63 26 62 18C61.5 14 57 10 50 8Z"
                fill="currentColor"
              />
              <path
                d="M48 56C51 48 49 41 46 35C42 28 43.5 18.5 50 8C38 15 36 26 39 34C41 39 42 44 38 48C35 51 32 54 32 58C35 63 43 62.5 48 56Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#EC0000] text-base leading-none tracking-tight font-sans">
              Santander
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
              Crédito Imobiliário
            </span>
          </div>
        </div>
      );

    case 'itau':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Official Itaú Emblem */}
          <div className="w-10 h-10 rounded-xl bg-[#EC7000] flex items-center justify-center shrink-0 shadow-xs border border-orange-600/20">
            <div className="w-7 h-7 rounded-lg bg-[#003399] flex items-center justify-center">
              <span className="text-white font-extrabold text-[12px] tracking-tight font-sans">
                itau
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#EC7000] text-base leading-none tracking-tight font-sans">
              Itaú
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
              Financiamentos
            </span>
          </div>
        </div>
      );

    case 'caixa':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Official Caixa X Emblem */}
          <div className="w-10 h-10 rounded-lg bg-[#005CA9] flex items-center justify-center shrink-0 shadow-xs p-1">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 22L42 42L22 62L38 78L58 58L78 78L94 62L74 42L94 22L78 6L58 26L38 6L22 22Z" fill="white" fillOpacity="0.15" />
              <path d="M30 20L50 40L30 60L42 72L62 52L82 72L94 60L74 40L94 20L82 8L62 28L42 8L30 20Z" fill="white" />
              {/* Distinctive Caixa orange triangle */}
              <path d="M50 40L65 25L50 10L35 25L50 40Z" fill="#F37021" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[#005CA9] text-base leading-none tracking-wider font-sans">
              CAIXA
            </span>
            <span className="text-[10px] text-[#F37021] uppercase tracking-widest font-semibold">
              Habitação
            </span>
          </div>
        </div>
      );

    case 'bb':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Official Banco do Brasil Geometric Ribbon Emblem */}
          <div className="w-10 h-10 rounded-lg bg-[#003882] flex items-center justify-center shrink-0 p-1.5 shadow-xs">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#FCDB00]" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M50 15L75 40L65 50L50 35L35 50L25 40L50 15Z"
                fill="currentColor"
              />
              <path
                d="M50 85L25 60L35 50L50 65L65 50L75 60L50 85Z"
                fill="currentColor"
              />
              <path
                d="M15 50L40 25L50 35L35 50L50 65L40 75L15 50Z"
                fill="currentColor"
              />
              <path
                d="M85 50L60 75L50 65L65 50L50 35L60 25L85 50Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#003882] text-sm leading-none tracking-tight font-sans">
              BANCO DO BRASIL
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium mt-0.5">
              Crédito Imobiliário
            </span>
          </div>
        </div>
      );

    case 'banrisul':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Official Banrisul Arcs Emblem */}
          <div className="w-10 h-10 rounded-lg bg-[#004B8D] flex items-center justify-center shrink-0 p-1.5 shadow-xs">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 70C25 45 45 30 75 30V42C52 42 37 53 32 70H20Z"
                fill="currentColor"
              />
              <path
                d="M36 70C40 52 54 44 80 44V54C60 54 48 60 45 70H36Z"
                fill="#55B5E6"
              />
              <path
                d="M50 70C53 60 62 56 85 56V64C70 64 60 66 58 70H50Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#004B8D] text-base leading-none tracking-tight font-sans">
              Banrisul
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
              Habitacional
            </span>
          </div>
        </div>
      );

    case 'bradesco':
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          {/* Official Bradesco Tree Emblem */}
          <div className="w-10 h-10 rounded-xl bg-[#CC092F] flex items-center justify-center shrink-0 p-1.5 shadow-xs">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white" xmlns="http://www.w3.org/2000/svg">
              {/* Outer arch */}
              <path
                d="M50 15C30 15 15 32 15 52C15 68 25 80 40 85V75C30 71 24 62 24 52C24 37 36 24 50 24C64 24 76 37 76 52C76 62 70 71 60 75V85C75 80 85 68 85 52C85 32 70 15 50 15Z"
                fill="currentColor"
              />
              {/* Inner branches */}
              <path
                d="M47 40V85H53V40H47Z"
                fill="currentColor"
              />
              <path
                d="M50 50L68 35L72 39L54 54L50 50Z"
                fill="currentColor"
              />
              <path
                d="M50 62L65 50L69 54L54 66L50 62Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#CC092F] text-base leading-none tracking-tight font-sans lowercase">
              bradesco
            </span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
              Crédito Imobiliário
            </span>
          </div>
        </div>
      );

    default:
      return null;
  }
};
