export function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">{children}</h1>;
}
export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl md:text-3xl font-semibold">{children}</h2>;
}