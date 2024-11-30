import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Hero() {
  return (
    <div className="flex h-screen flex-col items-center justify-center w-screen">
      <div className="rounded-full border border-muted border-b-primary px-10 py-1 text-sm">
        The Black Friday sale is Now! 🎉
      </div>
      <h1 className="font-light text-[120px]">Tyche</h1>
      <p className="text-center text-xl text-muted-foreground">
        The future of investment research powered by AI.
      </p>
      <div className="relative w-[90%] md:w-[60%]">
        <Input
          className="my-10 rounded-full py-3 ps-9"
          placeholder="Search for the next investment idea..."
          type="email"
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <Search size={16} strokeWidth={2} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
