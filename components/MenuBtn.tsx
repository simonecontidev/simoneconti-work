"use client";

import React from "react";

type MenuBtnProps = {
  isOpen: boolean;
  toggleMenu: () => void;
};

export default function MenuBtn({ isOpen, toggleMenu }: MenuBtnProps) {
  return (
    <button
      onClick={toggleMenu}
      aria-label="Toggle menu"
      className={`fixed bottom-8 left-1/2 z-[1000] flex h-[53px] w-[130px] -translate-x-1/2 items-center justify-center rounded-full 
        bg-[rgba(242,237,230,0.75)] backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.075,0.82,0.165,1)] ${
          isOpen ? "w-[130px]" : "w-[130px]"
        }`}
    >
      {/* Icon circle */}
      <div
        className={`absolute left-[2.5px] top-[2.5px] flex h-[48px] w-[48px] items-center justify-center rounded-full 
          bg-black transition-all duration-500 ease-[cubic-bezier(0.075,0.82,0.165,1)]`}
      >
        <div className="relative h-[30px] w-[30px] flex items-center justify-center">
          <div
            className={`absolute h-[1.5px] w-[15px] bg-white transition-all duration-300 ease-out ${
              isOpen ? "translate-y-0 rotate-45 scale-x-[1.05]" : "-translate-y-[3px]"
            }`}
          />
          <div
            className={`absolute h-[1.5px] w-[15px] bg-white transition-all duration-300 ease-out ${
              isOpen ? "translate-y-0 -rotate-45 scale-x-[1.05]" : "translate-y-[3px]"
            }`}
          />
        </div>
      </div>

      {/* Copy */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <p className="font-sans text-[0.9rem] font-semibold text-neutral-700">Menu</p>
      </div>
    </button>
  );
}