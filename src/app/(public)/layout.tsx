import Navbar from "@/components/navigation/navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex h-screen flex-col items-center justify-center">
        {children}
      </main>
    </>
  );
}
