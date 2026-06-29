import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="p-4">
        <Link href="/" className="flex items-center gap-1 w-fit">
          <span className="text-2xl font-bold text-blue-600">Dom</span>
          <span className="text-2xl font-bold text-orange-500">Fix</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  );
}
