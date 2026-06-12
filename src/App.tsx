import { useEffect, useMemo, useState, type ReactNode } from "react"

type Metric = {
  id: number
  titulo: string
  valor: string
  descricao: string
  variacao: string
  tipo: "positivo" | "negativo"
}

type Channel = {
  id: number
  nome: string
  cliques: number
  conversoes: number
}

type CampaignStatus = "Ativa" | "Pausada" | "Finalizada"
type Period = "Hoje" | "7 dias" | "30 dias"
type StatusFilter = CampaignStatus | "Todos"

type Campaign = {
  id: number
  nome: string
  canal: string
  status: CampaignStatus
  periodo: Period
  investimento: string
  resultado: string
}

type PerformancePoint = {
  horario: string
  alcance: number
  engajamento: number
}

type DashboardData = {
  metricas: Metric[]
  desempenho: PerformancePoint[]
  canais: Channel[]
  campanhas: Campaign[]
}

const metricIcons = ["users", "heart", "cursor", "target"]
const metricTones = ["violet", "indigo", "emerald", "amber"]
const periodOptions: Period[] = ["Hoje", "7 dias", "30 dias"]
const statusOptions: StatusFilter[] = ["Todos", "Ativa", "Pausada", "Finalizada"]
const navItems = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Campanhas", href: "#campanhas" },
  { label: "Redes Sociais", href: "#redes-sociais" },
  { label: "Relatorios", href: "#relatorios" },
  { label: "Configuracoes", href: "#configuracoes" },
]

async function fetchDashboardData(): Promise<DashboardData> {
  const response = await fetch("/db.json")

  if (!response.ok) {
    throw new Error("Erro ao buscar os dados do dashboard")
  }

  return response.json()
}

function formatCompact(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`
  }

  return String(value)
}

function buildLinePath(values: number[], maxValue: number, width = 690, height = 210) {
  if (values.length === 0) {
    return ""
  }

  return values
    .map((value, index) => {
      const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width
      const y = height - (value / maxValue) * height

      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(" ")
}

function Icon({ name }: { name: string }) {
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

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.28em] text-violet-300/65">
        {children}
      </p>
      <div className="h-px flex-1 bg-slate-800/90" />
    </div>
  )
}

function ScreenMessage({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[#070b12] px-4 text-slate-100">
      <div className="rounded-2xl border border-slate-800 bg-[#111625] px-6 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <p className="text-sm font-bold text-slate-300">{children}</p>
      </div>
    </div>
  )
}

function App() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("7 dias")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Todos")

  useEffect(() => {
    async function loadData() {
      try {
        const dashboardData = await fetchDashboardData()
        setData(dashboardData)
      } catch {
        setError("Nao foi possivel carregar os dados do dashboard.")
      }
    }

    loadData()
  }, [])

  const filteredCampaigns = useMemo(() => {
    if (data === null) {
      return []
    }

    const normalizedSearch = searchTerm.trim().toLowerCase()

    return data.campanhas.filter((campaign) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        campaign.nome.toLowerCase().includes(normalizedSearch) ||
        campaign.canal.toLowerCase().includes(normalizedSearch)
      const matchesStatus = statusFilter === "Todos" || campaign.status === statusFilter
      const matchesPeriod =
        selectedPeriod === "30 dias" ||
        campaign.periodo === selectedPeriod ||
        (selectedPeriod === "7 dias" && campaign.periodo === "Hoje")

      return matchesSearch && matchesStatus && matchesPeriod
    })
  }, [data, searchTerm, selectedPeriod, statusFilter])

  const statusCounts = useMemo(() => {
    const initial = { Ativa: 0, Pausada: 0, Finalizada: 0 }

    return filteredCampaigns.reduce(
      (counts, campaign) => ({
        ...counts,
        [campaign.status]: counts[campaign.status] + 1,
      }),
      initial,
    )
  }, [filteredCampaigns])

  if (error !== null) {
    return <ScreenMessage>{error}</ScreenMessage>
  }

  if (data === null) {
    return <ScreenMessage>Carregando dados do dashboard...</ScreenMessage>
  }

  const maxClicks = Math.max(...data.canais.map((channel) => channel.cliques), 1)
  const maxConversions = Math.max(...data.canais.map((channel) => channel.conversoes), 1)
  const performanceMax = Math.max(...data.desempenho.flatMap((point) => [point.alcance, point.engajamento]), 1)
  const reachPath = buildLinePath(data.desempenho.map((point) => point.alcance), performanceMax)
  const engagementPath = buildLinePath(data.desempenho.map((point) => point.engajamento), performanceMax)
  const areaPath = `${reachPath} L690 210 L0 210 Z`

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-[236px] border-r border-slate-800/90 bg-[#0d1220] lg:block">
        <div className="flex h-[68px] items-center gap-3 border-b border-slate-800/80 px-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl border border-violet-400/40 bg-violet-400/10 text-violet-300">
            <span className="text-lg font-black">M</span>
          </div>
          <div className="text-sm font-black uppercase leading-4 tracking-widest">
            <p className="text-violet-300">Marketing</p>
            <p>Metrics</p>
          </div>
        </div>

        <nav className="space-y-2 px-2 py-5 text-sm font-medium text-slate-400">
          {navItems.map((item, index) => (
            <a
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                index === 0
                  ? "border border-violet-400/30 bg-violet-400/14 text-violet-300 shadow-[0_0_24px_rgba(139,92,246,0.12)]"
                  : "hover:bg-slate-900/80 hover:text-slate-200"
              }`}
              href={item.href}
              key={item.label}
            >
              <span className="grid h-4 w-4 place-items-center rounded bg-slate-700/70 text-[10px] text-current">
                {index + 1}
              </span>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <header className="sticky top-0 z-10 border-b border-slate-800/90 bg-[#0d1220]/95 backdrop-blur lg:pl-[236px]">
        <div className="flex min-h-[68px] flex-wrap items-center justify-between gap-4 px-5 py-3 md:px-6">
          <h1 className="text-lg font-extrabold text-white md:text-xl">Dashboard de Marketing</h1>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
            <label className="flex h-9 min-w-[220px] items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 text-sm text-slate-500">
              <span className="text-xs">Q</span>
              <input
                className="w-full bg-transparent text-slate-300 outline-none placeholder:text-slate-500"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar campanha..."
                value={searchTerm}
              />
            </label>

            <div className="flex h-9 rounded-xl border border-slate-700 bg-slate-900/70 p-1 text-xs font-semibold text-slate-500">
              {periodOptions.map((period) => (
                <button
                  className={`rounded-lg px-4 transition ${
                    selectedPeriod === period ? "bg-violet-500 text-slate-950" : "hover:text-slate-200"
                  }`}
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </button>
              ))}
            </div>

            <button className="h-9 w-9 rounded-full bg-violet-500 text-sm font-black text-slate-950">MS</button>
          </div>
        </div>
      </header>

      <main id="dashboard" className="scroll-mt-24 px-4 py-7 md:px-6 lg:ml-[236px]">
        <div className="mx-auto max-w-[1280px] space-y-7">
          <SectionTitle>Resumo do periodo</SectionTitle>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {data.metricas.map((metric, index) => (
              <article
                className="rounded-2xl border border-slate-800 bg-[#111625] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                key={metric.id}
              >
                <div className="mb-6 flex items-start justify-between">
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-xl border ${
                      metricTones[index] === "violet"
                        ? "border-violet-400/35 bg-violet-400/10 text-violet-300"
                        : metricTones[index] === "indigo"
                          ? "border-indigo-400/35 bg-indigo-400/10 text-indigo-300"
                          : metricTones[index] === "emerald"
                            ? "border-emerald-400/35 bg-emerald-400/10 text-emerald-300"
                            : "border-amber-400/35 bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    <Icon name={metricIcons[index] ?? "target"} />
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-black ${
                      metric.tipo === "negativo"
                        ? "border-red-400/25 bg-red-500/12 text-red-400"
                        : "border-emerald-400/25 bg-emerald-500/12 text-emerald-300"
                    }`}
                  >
                    {metric.variacao}
                  </span>
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{metric.titulo}</p>
                <strong className="mt-1 block text-3xl font-black tracking-wide text-slate-100">{metric.valor}</strong>
                <p className="mt-1 text-sm text-slate-500">{metric.descricao}</p>
              </article>
            ))}
          </section>

          <div id="relatorios" className="scroll-mt-24">
            <SectionTitle>Analise de desempenho</SectionTitle>
          </div>

          <section className="grid gap-4 xl:grid-cols-[1fr_490px]">
            <article id="redes-sociais" className="scroll-mt-24 rounded-2xl border border-slate-800 bg-[#111625] p-5">
              <div className="mb-7 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-extrabold text-white">Crescimento de Alcance</h2>
                  <p className="text-sm text-slate-500">Alcance vs engajamento no periodo</p>
                </div>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-2">
                    <i className="h-2 w-2 rounded-full bg-violet-400" />
                    Alcance
                  </span>
                  <span className="flex items-center gap-2">
                    <i className="h-2 w-2 rounded-full bg-cyan-400" />
                    Engajamento
                  </span>
                </div>
              </div>

              <div className="relative h-[250px] overflow-hidden">
                <div className="absolute inset-x-10 inset-y-0 grid grid-rows-4 border-b border-slate-700/50">
                  {[performanceMax, performanceMax * 0.75, performanceMax * 0.5, performanceMax * 0.25, 0].map((label) => (
                    <div className="relative border-t border-dashed border-slate-800 text-xs text-slate-500" key={label}>
                      <span className="absolute -left-8 -top-2">{formatCompact(Math.round(label))}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-x-10 bottom-0 top-0 grid grid-cols-8">
                  {data.desempenho.map((point) => (
                    <div className="border-l border-dashed border-slate-800/70" key={point.horario} />
                  ))}
                </div>
                <svg className="absolute inset-x-10 top-0 h-[218px] w-[calc(100%-5rem)] translate-y-5 overflow-visible" viewBox="0 0 690 210" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill="url(#lineFill)" />
                  <path d={reachPath} fill="none" stroke="#8b5cf6" strokeWidth="3" />
                  <path d={engagementPath} fill="none" stroke="#22d3ee" strokeDasharray="8 8" strokeWidth="3" />
                </svg>
                <div className="absolute bottom-0 left-10 right-10 grid grid-cols-8 text-xs text-slate-500">
                  {data.desempenho.map((point) => (
                    <span key={point.horario}>{point.horario}</span>
                  ))}
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-[#111625] p-5">
              <h2 className="font-extrabold text-white">Desempenho por Canal</h2>
              <p className="mb-7 text-sm text-slate-500">Cliques e conversoes por plataforma</p>

              <div className="relative h-[220px] border-b border-slate-700/60">
                <div className="absolute inset-x-10 inset-y-0 grid grid-rows-4">
                  {[maxClicks, maxClicks * 0.75, maxClicks * 0.5, maxClicks * 0.25, 0].map((label) => (
                    <div className="relative border-t border-dashed border-slate-800 text-xs text-slate-500" key={label}>
                      <span className="absolute -left-8 -top-2">{formatCompact(Math.round(label))}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-10 right-4 flex h-full items-end justify-between gap-7">
                  {data.canais.map((channel) => {
                    const clicksHeight = `${Math.max((channel.cliques / maxClicks) * 100, 8)}%`
                    const conversionHeight = `${Math.max((channel.conversoes / maxConversions) * 100, 8)}%`

                    return (
                      <div className="flex h-full flex-1 flex-col items-center justify-end gap-2" key={channel.id}>
                        <div className="flex h-full items-end gap-2">
                          <div className="w-5 rounded-t bg-violet-500" title={`${channel.cliques} cliques`} style={{ height: clicksHeight }} />
                          <div className="w-5 rounded-t bg-cyan-400" title={`${channel.conversoes} conversoes`} style={{ height: conversionHeight }} />
                        </div>
                        <span className="text-xs text-slate-500">{channel.nome}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-9 flex gap-5 text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  <i className="h-3 w-3 rounded-full bg-violet-400" />
                  Cliques
                </span>
                <span className="flex items-center gap-2">
                  <i className="h-3 w-3 rounded-full bg-cyan-400" />
                  Conversoes
                </span>
              </div>
            </article>
          </section>

          <div id="campanhas" className="scroll-mt-24">
            <SectionTitle>Campanhas</SectionTitle>
          </div>

          <section className="rounded-2xl border border-slate-800 bg-[#111625]">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
              <div>
                <h2 className="font-extrabold text-white">Campanhas Recentes</h2>
                <p className="text-sm text-slate-500">
                  {filteredCampaigns.length} de {data.campanhas.length} campanhas
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold">
                {statusOptions.map((status) => (
                  <button
                    className={`rounded-full border px-3 py-1 transition ${
                      statusFilter === status
                        ? "border-violet-400/50 bg-violet-500/15 text-violet-200"
                        : "border-slate-700 bg-slate-900/70 text-slate-400 hover:text-slate-200"
                    }`}
                    key={status}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === "Todos" ? "Todos" : `${statusCounts[status]} ${status}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  <tr className="border-b border-slate-800">
                    <th className="px-5 py-3">Campanha</th>
                    <th className="px-5 py-3">Canal</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Periodo</th>
                    <th className="px-5 py-3">Investimento</th>
                    <th className="px-5 py-3">Resultado</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {filteredCampaigns.map((campaign) => (
                    <tr className="border-b border-slate-800/70 last:border-0" key={campaign.id}>
                      <td className="px-5 py-4 font-bold text-white">{campaign.nome}</td>
                      <td className="px-5 py-4 text-slate-500">{campaign.canal}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            campaign.status === "Ativa"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : campaign.status === "Pausada"
                                ? "bg-amber-500/10 text-amber-300"
                                : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{campaign.periodo}</td>
                      <td className="px-5 py-4 text-slate-400">{campaign.investimento}</td>
                      <td className="px-5 py-4 font-bold text-violet-300">{campaign.resultado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredCampaigns.length === 0 && (
                <div className="border-t border-slate-800 px-5 py-10 text-center text-sm text-slate-500">
                  Nenhuma campanha encontrada com os filtros atuais.
                </div>
              )}
            </div>
          </section>

          <div id="configuracoes" className="scroll-mt-24">
            <SectionTitle>Configuracoes</SectionTitle>
          </div>

          <section className="grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-800 bg-[#111625] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Fonte atual</p>
              <strong className="mt-2 block text-lg font-black text-white">Dados simulados</strong>
              <p className="mt-2 text-sm text-slate-500">Os numeros saem de public/db.json para demonstrar a experiencia completa.</p>
            </article>
            <article className="rounded-2xl border border-slate-800 bg-[#111625] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Objetivo</p>
              <strong className="mt-2 block text-lg font-black text-white">Portfolio</strong>
              <p className="mt-2 text-sm text-slate-500">Projeto criado para apresentar dominio de React, TypeScript e dashboards.</p>
            </article>
            <article className="rounded-2xl border border-slate-800 bg-[#111625] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Status</p>
              <strong className="mt-2 block text-lg font-black text-emerald-300">Pronto para demonstracao</strong>
              <p className="mt-2 text-sm text-slate-500">Busca, filtros, graficos e tabela funcionam com dados mockados.</p>
            </article>
          </section>

          <footer className="pb-2 text-center text-xs text-slate-500">
            Desenvolvido por <span className="font-bold text-violet-300">Marcos Simoes</span> - React + TypeScript + Tailwind
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
