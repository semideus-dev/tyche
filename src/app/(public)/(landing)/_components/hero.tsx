"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import StockSearch from "./stock-search";

export default function Hero() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <div className="rounded-full border border-muted border-b-primary px-10 py-1 text-sm">
          The Black Friday sale is Now! 🎉
        </div>
        <h1 className="text-[120px] font-light">Tyche</h1>
        <p className="text-center text-xl text-muted-foreground">
          The future of investment research powered by AI.
        </p>
        <StockSearch />
      </div>
    </QueryClientProvider>
  );
}
