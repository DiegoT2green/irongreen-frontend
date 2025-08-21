// src/survey/components/StyledButton.tsx
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
};

export default function StyledButton({ children, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition"
    >
      {children}
    </button>
  );
}
