export const metadata = { title: "Portfolio — Simone Conti" };

export default function PortfolioPage() {
  // TODO: replace with data from your templates
  const projects = [
    { slug: "project-one", title: "Project One", role: "Frontend" },
    { slug: "project-two", title: "Project Two", role: "UI/UX + Frontend" },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Selected Work</h1>
      <ul className="mt-6 space-y-4">
        {projects.map(p => (
          <li key={p.slug}>
            <a href={`/portfolio/${p.slug}`} className="group inline-block">
              <span className="font-medium group-hover:underline">{p.title}</span>
              <span className="ml-2 text-sm text-zinc-500">— {p.role}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}