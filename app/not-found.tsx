import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-muted">這個頁面不存在，或是已經搬走了。</p>
      <Link href="/" className="text-accent underline underline-offset-4">
        回首頁
      </Link>
    </div>
  );
}
