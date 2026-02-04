import { GameBoard } from "@/components/game/game-board";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-8 md:py-16">
      <GameBoard />
    </main>
  );
}
