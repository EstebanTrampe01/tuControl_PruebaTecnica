export default function Home() {
  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <article className="rounded-2xl border border-primary-100 bg-card p-5 shadow-sm shadow-primary-100/70 dark:border-border dark:shadow-none">
        <p className="text-sm text-muted-foreground">Productos en catalogo</p>
        <p className="mt-3 text-2xl font-semibold text-foreground">--</p>
      </article>

      <article className="rounded-2xl border border-primary-100 bg-card p-5 shadow-sm shadow-primary-100/70 dark:border-border dark:shadow-none">
        <p className="text-sm text-muted-foreground">Ventas de hoy</p>
        <p className="mt-3 text-2xl font-semibold text-foreground">--</p>
      </article>

      <article className="rounded-2xl border border-primary-100 bg-card p-5 shadow-sm shadow-primary-100/70 dark:border-border dark:shadow-none md:col-span-2 lg:col-span-1">
        <p className="text-sm text-muted-foreground">Stock critico</p>
        <p className="mt-3 text-2xl font-semibold text-foreground">--</p>
      </article>

      <article className="rounded-2xl border border-primary-100 bg-card p-5 shadow-sm shadow-primary-100/70 dark:border-border dark:shadow-none md:col-span-2 lg:col-span-3">
        <h1 className="text-lg font-semibold text-foreground">Dashboard NovaTech</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Base visual lista para continuar con la integracion de datos reales desde
          backend en las siguientes fases.
        </p>
      </article>
    </section>
  );
}
