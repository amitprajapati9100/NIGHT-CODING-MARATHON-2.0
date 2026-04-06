import Navbar from "./Navbar";

const AppShell = ({ title, subtitle, actions, children }) => (
  <div className="min-h-screen bg-[#f5f3ec] text-slate-900">
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute left-[-10%] -top-48 h-104 w-104 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="absolute -bottom-40 right-[-10%] h-96 w-[24rem] rounded-full bg-cyan-200/30 blur-3xl" />
    </div>

    <div className="relative">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-5 rounded-4xl border border-white/50 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Personalized Interview Studio
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {subtitle}
              </p>
            ) : null}
          </div>

          {actions ? (
            <div className="flex flex-wrap items-center gap-3">{actions}</div>
          ) : null}
        </section>

        {children}
      </main>
    </div>
  </div>
);

export default AppShell;
