type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: `${slug} — Portfolio — Simone Conti` };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold capitalize">{slug.replaceAll("-", " ")}</h1>
      <p className="mt-4 text-zinc-600">
        Project details coming soon. Replace this with your template content.
      </p>
    </main>
  );
}