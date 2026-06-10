
// definindo os modelos de metricas
type Metric = {
  id : number
  titulo : string
  valor : string
  descricao: string
  variacao : string
  tipo: "positivo" | "negativo"
}

type Channel = {
  id : number
  nome : string
  cliques : number
  conversoes : number

} 

type Campaign = {
    id: number
    nome : string
    canal : string 
    status : 'Ativa' | "Pausada" | 'Finalizada'
    investimento : string
    resultado : string

}

// puxando os valores dos tipo de dados 
type DashboardData = {
  metricas : Metric[]
  canais : Channel[]
  campanhas : Campaign[]
}

// fazendo a função para fazer o consumo da API

async function fethDashboardData(): Promise<DashboardData>{
  const response = await fetch("http://localhost:3000/db")
  if (!response.ok){
    throw new Error('Erro ao buscar os dados do dasborard')
  }
  return response.json()
}




// capitcaçao de de array com objetos
const metrics = [
  {
    icon: "users",
    label: "TOTAL DE ALCANCE",
    value: "48.2K",
    helper: "Usuarios unicos alcancados",
    trend: "+12.4%",
    tone: "cyan",
  },
  {
    icon: "heart",
    label: "ENGAJAMENTO",
    value: "3.8K",
    helper: "Curtidas, comentarios e compartilhamentos",
    trend: "-2.1%",
    tone: "violet",
    negative: true,
  },
  {
    icon: "cursor",
    label: "CLIQUES",
    value: "1.2K",
    helper: "Cliques totais nos anuncios",
    trend: "+8.7%",
    tone: "emerald",
  },
  {
    icon: "target",
    label: "CONVERSOES",
    value: "94",
    helper: "Leads e vendas gerados",
    trend: "+5.3%",
    tone: "amber",
  },
]

const channels = [
  { name: "Instagram", height: "78%" },
  { name: "Facebook", height: "54%" },
  { name: "TikTok", height: "42%" },
  { name: "LinkedIn", height: "25%" },
]

const campaigns = [
  { name: "Black Friday Ads", channel: "Instagram", status: "Ativa", budget: "R$ 4.800", result: "18.4K" },
  { name: "Lancamento Produto", channel: "Facebook", status: "Pausada", budget: "R$ 2.100", result: "9.7K" },
  { name: "Conteudo Viral", channel: "TikTok", status: "Ativa", budget: "R$ 1.650", result: "12.8K" },
]


// função pegando icon 
function Icon({ name }: { name: string }) { // pegando o nome do tipo string

  const common = "h-5 w-5"

  if (name === "users") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }

  if (name === "heart") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />
      </svg>
    )
  }

  if (name === "cursor") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m3 3 7.8 18 2.2-7 7-2.2Z" />
        <path d="m13 13 5 5" />
      </svg>
    )
  }

  if (name === "target") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    )
  }

  return null
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300/65">
        {children}
      </p>
      <div className="h-px flex-1 bg-slate-800/90" />
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100">
      <aside className="fixed inset-y-0 left-0 w-[236px] border-r border-slate-800/90 bg-[#0d1220]">
        <div className="flex h-[68px] items-center gap-3 border-b border-slate-800/80 px-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-violet-400/40 bg-violet-400/10 text-violet-300">
            <span className="text-lg">↗</span>
          </div>
          <div className="text-sm font-black uppercase leading-4 tracking-widest">
            <p className="text-violet-300">Marketing</p>
            <p>Metrics</p>
          </div>
        </div>

        <nav className="space-y-2 px-2 py-5 text-sm font-medium text-slate-400">
          {["Dashboard", "Campanhas", "Redes Sociais", "Relatorios", "Configuracoes"].map((item, index) => (
            <a
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                index === 0
                  ? "border border-violet-400/30 bg-violet-400/14 text-violet-300 shadow-[0_0_24px_rgba(139,92,246,0.12)]"
                  : "hover:bg-slate-900/80 hover:text-slate-200"
              }`}
              href="#"
              key={item}
            >
              <span className="grid h-4 w-4 place-items-center text-base text-current">
                {["⌘", "⊲", "⌯", "▧", "⚙"][index]}
              </span>
              {item}
            </a>
          ))}
        </nav>

        <div className="mt-auto p-2">
          <button className="h-9 w-full rounded-xl border border-slate-700 bg-slate-800/50 text-slate-500">
            ‹
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-10 border-b border-slate-800/90 bg-[#0d1220]/95 backdrop-blur lg:pl-[236px]">
        <div className="flex h-[68px] items-center justify-between gap-4 px-5 md:px-6">
          <h1 className="text-lg font-extrabold text-white md:text-xl">Dashboard de Marketing</h1>

          <div className="hidden items-center gap-3 md:flex">
            <label className="flex h-9 w-[220px] items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 text-sm text-slate-500">
              <span>⌕</span>
              <input
                className="w-full bg-transparent text-slate-300 outline-none placeholder:text-slate-500"
                placeholder="Buscar campanha..."
              />
            </label>

            <div className="flex h-9 rounded-xl border border-slate-700 bg-slate-900/70 p-1 text-xs font-semibold text-slate-500">
              <button className="rounded-lg bg-violet-500 px-4 text-slate-950">Hoje</button>
              <button className="px-4">7 dias</button>
              <button className="px-4">30 dias</button>
            </div>

            <button className="relative h-9 w-9 rounded-xl border border-slate-700 bg-slate-900/70 text-slate-400">
              ♧
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-400" />
            </button>
            <button className="h-9 w-9 rounded-xl border border-slate-700 bg-slate-900/70 text-slate-400">☼</button>
            <button className="h-9 w-9 rounded-full bg-violet-500 text-sm font-black text-slate-950">MS</button>
          </div>
        </div>
      </header>

      <main className="px-4 py-7 md:px-6 lg:ml-[236px]">
        <div className="mx-auto max-w-[1280px] space-y-7">
          <SectionTitle>Resumo do periodo</SectionTitle>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article
                className="rounded-2xl border border-slate-800 bg-[#111625] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                key={metric.label}
              >
                <div className="mb-6 flex items-start justify-between">
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-xl border ${
                      metric.tone === "cyan"
                        ? "border-violet-400/35 bg-violet-400/10 text-violet-300"
                        : metric.tone === "violet"
                          ? "border-indigo-400/35 bg-indigo-400/10 text-indigo-300"
                          : metric.tone === "emerald"
                            ? "border-emerald-400/35 bg-emerald-400/10 text-emerald-300"
                            : "border-amber-400/35 bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    <Icon name={metric.icon} />
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-black ${
                      metric.negative
                        ? "border-red-400/25 bg-red-500/12 text-red-400"
                        : "border-emerald-400/25 bg-emerald-500/12 text-emerald-300"
                    }`}
                  >
                    ↗ {metric.trend}
                  </span>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{metric.label}</p>
                <strong className="mt-1 block text-3xl font-black tracking-wide text-slate-100">{metric.value}</strong>
                <p className="mt-1 text-sm text-slate-500">{metric.helper}</p>
              </article>
            ))}
          </section>

          <SectionTitle>Analise de desempenho</SectionTitle>

          <section className="grid gap-4 xl:grid-cols-[1fr_490px]">
            <article className="rounded-2xl border border-slate-800 bg-[#111625] p-5">
              <div className="mb-7 flex items-start justify-between">
                <div>
                  <h2 className="font-extrabold text-white">Crescimento de Alcance</h2>
                  <p className="text-sm text-slate-500">Alcance vs engajamento no periodo</p>
                </div>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-violet-400" />Alcance</span>
                  <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-indigo-400" />Engajamento</span>
                </div>
              </div>

              <div className="relative h-[250px] overflow-hidden">
                <div className="absolute inset-x-10 inset-y-0 grid grid-rows-4 border-b border-slate-700/50">
                  {["14K", "11K", "7K", "4K", "0"].map((label) => (
                    <div className="relative border-t border-dashed border-slate-800 text-xs text-slate-500" key={label}>
                      <span className="absolute -left-8 -top-2">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-x-10 bottom-0 top-0 grid grid-cols-8">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div className="border-l border-dashed border-slate-800/70" key={index} />
                  ))}
                </div>
                <svg className="absolute inset-x-10 top-0 h-[218px] w-[calc(100%-5rem)] translate-y-5 overflow-visible" viewBox="0 0 690 210" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 170 C70 180 130 176 190 154 C260 118 325 82 410 42 C485 4 560 24 630 70 C656 88 674 106 690 124 L690 210 L0 210 Z" fill="url(#lineFill)" />
                  <path d="M0 170 C70 180 130 176 190 154 C260 118 325 82 410 42 C485 4 560 24 630 70 C656 88 674 106 690 124" fill="none" stroke="#8b5cf6" strokeWidth="3" />
                </svg>
                <div className="absolute bottom-0 left-10 right-10 grid grid-cols-8 text-xs text-slate-500">
                  {["00h", "03h", "06h", "09h", "12h", "15h", "18h", "21h"].map((time) => (
                    <span key={time}>{time}</span>
                  ))}
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-[#111625] p-5">
              <h2 className="font-extrabold text-white">Desempenho por Canal</h2>
              <p className="mb-7 text-sm text-slate-500">Cliques e conversoes por plataforma</p>

              <div className="relative h-[220px] border-b border-slate-700/60">
                <div className="absolute inset-x-10 inset-y-0 grid grid-rows-4">
                  {["16K", "12K", "8K", "4K", "0"].map((label) => (
                    <div className="relative border-t border-dashed border-slate-800 text-xs text-slate-500" key={label}>
                      <span className="absolute -left-8 -top-2">{label}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-10 right-4 flex h-full items-end justify-between gap-8">
                  {channels.map((channel) => (
                    <div className="flex h-full flex-1 flex-col items-center justify-end gap-2" key={channel.name}>
                      <div className="w-7 rounded-t bg-[#5474ef]" style={{ height: channel.height }} />
                      <span className="text-xs text-slate-500">{channel.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-9 flex gap-5 text-xs text-slate-500">
                <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-violet-400" />Cliques</span>
                <span className="flex items-center gap-2"><i className="h-3 w-3 rounded-full bg-indigo-400" />Conversoes</span>
              </div>
            </article>
          </section>

          <SectionTitle>Campanhas</SectionTitle>

          <section className="rounded-2xl border border-slate-800 bg-[#111625]">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
              <div>
                <h2 className="font-extrabold text-white">Campanhas Recentes</h2>
                <p className="text-sm text-slate-500">7 de 7 campanhas</p>
              </div>
              <div className="flex gap-2 text-xs font-bold">
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-emerald-300">3 Ativa</span>
                <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-300">2 Pausada</span>
                <span className="rounded-full border border-slate-600 bg-slate-800/70 px-3 py-1 text-slate-500">2 Finalizada</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  <tr className="border-b border-slate-800">
                    <th className="px-5 py-3">Campanha</th>
                    <th className="px-5 py-3">Canal</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Orcamento</th>
                    <th className="px-5 py-3">Resultado</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {campaigns.map((campaign) => (
                    <tr className="border-b border-slate-800/70 last:border-0" key={campaign.name}>
                      <td className="px-5 py-4 font-bold text-white">{campaign.name}</td>
                      <td className="px-5 py-4 text-slate-500">{campaign.channel}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                          campaign.status === "Ativa"
                            ? "bg-emerald-500/10 text-emerald-300"
                            : "bg-amber-500/10 text-amber-300"
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{campaign.budget}</td>
                      <td className="px-5 py-4 font-bold text-violet-300">{campaign.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <footer className="pb-2 text-center text-xs text-slate-500">
            Desenvolvido por <span className="font-bold text-violet-300">Marcos Simoes</span> — React + TypeScript + Tailwind
          </footer>
        </div>
      </main>

      <button className="fixed bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full border border-slate-600 bg-slate-800 text-lg text-white shadow-xl">
        ?
      </button>
    </div>
  )
}

export default App
