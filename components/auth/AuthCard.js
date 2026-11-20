export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16 sm:px-6">
      <div className="w-full rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="font-display text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-black/60">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-6 text-center text-sm text-black/60">{footer}</div>
      </div>
    </div>
  );
}