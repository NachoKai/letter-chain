"use client";

import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeButtonProps {
  onHome: () => void;
  show: boolean;
}

export function HomeButton({ onHome, show }: HomeButtonProps) {
  if (!show) return null;

  return (
    <Button variant="ghost" size="icon" onClick={onHome} className="z-50">
      <Home className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Volver al inicio</span>
    </Button>
  );
}
