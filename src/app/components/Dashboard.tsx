"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Treemap,
} from "recharts";
import {
  TOTAL,
  COMPOSITION,
  YEAR_OVER_YEAR,
  DEPARTMENTS,
  KEY_HIGHLIGHTS,
  WINNERS_LOSERS,
  type Department,
} from "../data/estimates";

// ─── Helpers ──────────────────────────────────────────────
function fmt(n: number, decimals = 1) {
  return `$${n.toFixed(decimals)}B`;
}

function fmtM(n: number) {
  if (n >= 1) return `$${n.toFixed(1)}B`;
  return `$${(n * 1000).toFixed(0)}M`;
}

// ─── Stat Card ────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="bg-white p-6 shadow-sm border border-[#e0e0e0] hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-[#868686] uppercase tracking-wide">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
      {sub && <p className="mt-1 text-sm text-[#9e9e9e]">{sub}</p>}
    </div>
  );
}

// ─── Insight Card ─────────────────────────────────────────
const ICON_MAP: Record<string, React.ReactNode> = {
  shield: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  "trending-up": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  send: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  "bar-chart": (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  landmark: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v4m4-4v4m4-4v4" />
    </svg>
  ),
};

function InsightCard({ title, detail, icon }: { title: string; detail: string; icon: string }) {
  return (
    <div className="flex gap-4 bg-white border border-[#e0e0e0] p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-shrink-0 w-10 h-10 bg-[#fcf4f4] text-[#932f2f] flex items-center justify-center">
        {ICON_MAP[icon] ?? ICON_MAP.shield}
      </div>
      <div>
        <p className="font-normal text-[#272727] font-[Soehne_Kraftig]">{title}</p>
        <p className="mt-1 text-sm text-[#868686] leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────
function BillionTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white shadow-lg border border-[#e0e0e0] p-3 text-sm">
      <p className="font-semibold text-[#272727] mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  );
}

// ─── Treemap Custom Content ───────────────────────────────
function TreemapContent(props: any) {
  const { x, y, width, height, name, value } = props;
  if (width < 60 || height < 36) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} style={{ fill: props.color || "#418599", stroke: "#fff", strokeWidth: 2, opacity: 0.9 }} />
      <text x={x + width / 2} y={y + height / 2 - 8} textAnchor="middle" fill="#fff" fontSize={width < 100 ? 10 : 12} fontWeight="400" fontFamily="Soehne Kraftig, sans-serif">
        {name && name.length > (width < 100 ? 12 : 20) ? name.slice(0, width < 100 ? 10 : 18) + "…" : name}
      </text>
      <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="#fff" fontSize={11} opacity={0.9} fontFamily="Founders Grotesk Mono, monospace">
        {fmtM(value)}
      </text>
    </g>
  );
}

// ─── Department Table ─────────────────────────────────────
function DeptTable({
  data,
  sortKey,
  sortDir,
  onSort,
}: {
  data: Department[];
  sortKey: keyof Department;
  sortDir: "asc" | "desc";
  onSort: (key: keyof Department) => void;
}) {
  const arrow = (key: keyof Department) =>
    sortKey === key ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-[#e0e0e0] text-left">
            <th className="py-3 px-4 font-semibold text-[#6d6d6d] cursor-pointer hover:text-[#272727] select-none" onClick={() => onSort("name")}>
              Department{arrow("name")}
            </th>
            <th className="py-3 px-4 font-semibold text-[#6d6d6d] text-right cursor-pointer hover:text-[#272727] select-none" onClick={() => onSort("voted")}>
              Voted{arrow("voted")}
            </th>
            <th className="py-3 px-4 font-semibold text-[#6d6d6d] text-right cursor-pointer hover:text-[#272727] select-none" onClick={() => onSort("statutory")}>
              Statutory{arrow("statutory")}
            </th>
            <th className="py-3 px-4 font-semibold text-[#6d6d6d] text-right cursor-pointer hover:text-[#272727] select-none" onClick={() => onSort("total")}>
              Total{arrow("total")}
            </th>
            <th className="py-3 px-4 font-semibold text-[#6d6d6d] text-right cursor-pointer hover:text-[#272727] select-none" onClick={() => onSort("prevTotal")}>
              YoY Change{arrow("prevTotal")}
            </th>
            <th className="py-3 px-4 font-semibold text-[#6d6d6d] w-48">Share of Voted</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => {
            const votedPct = (d.voted / TOTAL.budgetaryVoted) * 100;
            return (
              <tr key={d.name} className={`border-b border-[#e0e0e0] ${i % 2 === 0 ? "bg-[#fbf6f1]/50" : ""} hover:bg-[#f1f8fa]/40 transition-colors`}>
                <td className="py-3 px-4 font-medium text-[#272727]">{d.name}</td>
                <td className="py-3 px-4 text-right tabular-nums font-[Founders_Grotesk_Mono]">{fmtM(d.voted)}</td>
                <td className="py-3 px-4 text-right tabular-nums font-[Founders_Grotesk_Mono]">{fmtM(d.statutory)}</td>
                <td className="py-3 px-4 text-right font-semibold tabular-nums font-[Founders_Grotesk_Mono]">{fmtM(d.total)}</td>
                <td className="py-3 px-4 text-right tabular-nums font-[Founders_Grotesk_Mono]">
                  {(() => {
                    const pctChange = ((d.total - d.prevTotal) / d.prevTotal) * 100;
                    const isUp = pctChange > 0;
                    const color = isUp ? "text-[#2AB34B]" : "text-[#932f2f]";
                    return (
                      <span className={color}>
                        {isUp ? "+" : ""}{pctChange.toFixed(1)}%
                      </span>
                    );
                  })()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#e0e0e0] rounded-full overflow-hidden">
                      <div className="h-full bg-[#932f2f] rounded-full" style={{ width: `${Math.min(votedPct, 100)}%` }} />
                    </div>
                    <span className="text-xs text-[#868686] w-10 text-right tabular-nums font-[Founders_Grotesk_Mono]">{votedPct.toFixed(1)}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Pie Label ────────────────────────────────────────────
function renderPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, name, pct }: any) {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" className="text-xs fill-[#6d6d6d] font-medium">
      {name} ({pct}%)
    </text>
  );
}

// ─── Main Dashboard ───────────────────────────────────────
export default function Dashboard() {
  const [sortKey, setSortKey] = useState<keyof Department>("voted");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [deptFilter, setDeptFilter] = useState("");
  const [tab, setTab] = useState<"overview" | "departments" | "insights" | "winners-losers">("overview");

  function handleSort(key: keyof Department) {
    if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  const sortedDepts = useMemo(() => {
    let filtered = DEPARTMENTS.filter((d) => d.name.toLowerCase().includes(deptFilter.toLowerCase()));
    return filtered.sort((a, b) => {
      if (sortKey === "prevTotal") {
        const av = ((a.total - a.prevTotal) / a.prevTotal) * 100;
        const bv = ((b.total - b.prevTotal) / b.prevTotal) * 100;
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [sortKey, sortDir, deptFilter]);

  const treemapData = useMemo(
    () =>
      DEPARTMENTS.map((d) => ({
        name: d.name,
        value: d.voted,
        color:
          d.voted >= 10
            ? "#932f2f"
            : d.voted >= 4
            ? "#418599"
            : d.voted >= 2
            ? "#AF5D16"
            : "#6d6d6d",
      })).sort((a, b) => b.value - a.value),
    [],
  );

  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "departments" as const, label: "Departments" },
    { id: "insights" as const, label: "Key Insights" },
    { id: "winners-losers" as const, label: "Winners & Losers" },
  ];

  return (
    <div className="min-h-screen bg-[#fbf6f1]">
      {/* Header */}
      <header className="bg-white border-b border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="https://canadaspends.com/en" target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://canadaspends.com/_next/static/media/logo-full.3199769c.svg" alt="Canada Spends" className="h-10" />
              </a>
              <div className="w-px h-8 bg-[#e0e0e0]" />
              <div>
                <h1 className="text-2xl font-bold text-[#272727] font-[Soehne_Kraftig]">2026–27 Main Estimates</h1>
                <p className="text-sm text-[#868686]">Government of Canada · Treasury Board Secretariat</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <nav className="mt-6 flex gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.id ? "bg-[#932f2f] text-white" : "text-[#6d6d6d] hover:bg-[#f6f6f6]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stat Cards — always visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Budgetary" value={fmt(TOTAL.totalBudgetary)} sub={`+$${(TOTAL.totalBudgetary - YEAR_OVER_YEAR[1].total).toFixed(1)}B vs 25–26 ME`} accent="text-[#272727]" />
          <StatCard label="Voted Authorities" value={fmt(TOTAL.budgetaryVoted)} sub="Requires Parliament approval" accent="text-[#418599]" />
          <StatCard label="Statutory Spending" value={fmt(TOTAL.budgetaryStatutory)} sub="Already authorized by law" accent="text-[#932f2f]" />
          <StatCard label="Public Debt Interest" value={fmt(COMPOSITION[2].value)} sub="+$4.6B year-over-year" accent="text-[#AF5D16]" />
        </div>

        {/* ─── OVERVIEW TAB ─────────────────────────── */}
        {tab === "overview" && (
          <>
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Composition Donut */}
              <div className="bg-white shadow-sm border border-[#e0e0e0] p-6">
                <h2 className="text-lg font-normal text-[#272727] font-[Soehne_Kraftig] mb-4">Spending Composition</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={COMPOSITION}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                      label={renderPieLabel}
                    >
                      {COMPOSITION.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: unknown) => fmt(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-2">
                  {COMPOSITION.map((c) => (
                    <div key={c.name} className="flex items-center gap-2 text-xs text-[#6d6d6d]">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                      {c.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Year-over-Year */}
              <div className="bg-white shadow-sm border border-[#e0e0e0] p-6">
                <h2 className="text-lg font-normal text-[#272727] font-[Soehne_Kraftig] mb-4">Year-over-Year Comparison</h2>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={YEAR_OVER_YEAR} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}B`} />
                    <Tooltip content={<BillionTooltip />} />
                    <Legend />
                    <Bar dataKey="voted" name="Voted" fill="#932f2f" />
                    <Bar dataKey="statutory" name="Statutory" fill="#418599" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Treemap */}
            <div className="bg-white shadow-sm border border-[#e0e0e0] p-6">
              <h2 className="text-lg font-normal text-[#272727] font-[Soehne_Kraftig] mb-1">Voted Spending by Department</h2>
              <p className="text-sm text-[#868686] mb-4">Size represents voted estimates. Hover for details.</p>
              <ResponsiveContainer width="100%" height={420}>
                <Treemap
                  data={treemapData}
                  dataKey="value"
                  aspectRatio={4 / 3}
                  stroke="#fff"
                  content={<TreemapContent />}
                >
                  <Tooltip formatter={(v: unknown) => fmt(Number(v))} />
                </Treemap>
              </ResponsiveContainer>
              <div className="flex gap-5 mt-4 text-xs text-[#868686] justify-center">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#932f2f]" /> $10B+</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#418599]" /> $4–10B</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#AF5D16]" /> $2–4B</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#6d6d6d]" /> &lt;$2B</span>
              </div>
            </div>
          </>
        )}

        {/* ─── DEPARTMENTS TAB ──────────────────────── */}
        {tab === "departments" && (
          <>
            <div className="bg-white shadow-sm border border-[#e0e0e0] p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-normal text-[#272727] font-[Soehne_Kraftig]">All Departments & Agencies</h2>
                  <p className="text-sm text-[#868686]">{sortedDepts.length} organizations · Click column headers to sort</p>
                </div>
                <input
                  type="text"
                  placeholder="Filter departments…"
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="border border-[#e0e0e0] px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#932f2f] focus:border-transparent"
                />
              </div>
              <DeptTable data={sortedDepts} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
            </div>

            {/* Top Voted Bar Chart */}
            <div className="bg-white shadow-sm border border-[#e0e0e0] p-6">
              <h2 className="text-lg font-normal text-[#272727] font-[Soehne_Kraftig] mb-4">Top 10 Departments by Voted Estimates</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={DEPARTMENTS.sort((a, b) => b.voted - a.voted).slice(0, 10)}
                  layout="vertical"
                  margin={{ left: 10, right: 20, top: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}B`} />
                  <YAxis dataKey="name" type="category" width={200} tick={{ fontSize: 11 }} />
                  <Tooltip content={<BillionTooltip />} />
                  <Bar dataKey="voted" name="Voted" fill="#932f2f" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Voted vs Statutory Stacked */}
            <div className="bg-white shadow-sm border border-[#e0e0e0] p-6">
              <h2 className="text-lg font-normal text-[#272727] font-[Soehne_Kraftig] mb-4">Top 10 by Total: Voted vs Statutory</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={[...DEPARTMENTS].sort((a, b) => b.total - a.total).slice(0, 10)}
                  layout="vertical"
                  margin={{ left: 10, right: 20, top: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}B`} />
                  <YAxis dataKey="name" type="category" width={200} tick={{ fontSize: 11 }} />
                  <Tooltip content={<BillionTooltip />} />
                  <Legend content={() => (
                    <div className="flex justify-center gap-5 mt-2 text-xs text-[#6d6d6d]">
                      <span className="flex items-center gap-1"><span className="w-3 h-3" style={{ backgroundColor: "#932f2f" }} /> Voted</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3" style={{ backgroundColor: "#418599" }} /> Statutory</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3" style={{ backgroundColor: "#AF5D16" }} /> Debt & Provincial Transfers</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3" style={{ backgroundColor: "#6d6d6d" }} /> Elderly Benefits</span>
                    </div>
                  )} />
                  <Bar dataKey="voted" name="Voted" stackId="a">
                    {[...DEPARTMENTS].sort((a, b) => b.total - a.total).slice(0, 10).map((d) => (
                      <Cell key={d.name} fill={d.name === "Finance" ? "#AF5D16" : d.name === "Employment & Social Development" ? "#6d6d6d" : "#932f2f"} />
                    ))}
                  </Bar>
                  <Bar dataKey="statutory" name="Statutory" stackId="a">
                    {[...DEPARTMENTS].sort((a, b) => b.total - a.total).slice(0, 10).map((d) => (
                      <Cell key={d.name} fill={d.name === "Finance" ? "#AF5D16" : d.name === "Employment & Social Development" ? "#6d6d6d" : "#418599"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ─── WINNERS & LOSERS TAB ────────────────── */}
        {tab === "winners-losers" && (
          <div className="space-y-3">
            {WINNERS_LOSERS.map((item) => {
              const borderColor = item.direction === "up" ? "#2AB34B" : item.direction === "down" ? "#932f2f" : "#9e9e9e";
              const badgeBg = item.direction === "up" ? "bg-[#e8f5e9] text-[#2AB34B]" : item.direction === "down" ? "bg-[#fcf4f4] text-[#932f2f]" : "bg-[#f0f0f0] text-[#6d6d6d]";
              return (
                <div
                  key={item.rank}
                  className="flex items-start gap-5 bg-white border border-[#e0e0e0] p-5 shadow-sm hover:shadow-md transition-shadow"
                  style={{ borderLeft: `3px solid ${borderColor}` }}
                >
                  <span className="text-2xl font-bold text-[#9e9e9e] font-[Founders_Grotesk_Mono] w-8 flex-shrink-0 text-right tabular-nums">
                    {item.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-normal text-[#272727] font-[Soehne_Kraftig]">{item.headline}</p>
                    <p className="mt-1 text-sm text-[#868686] leading-relaxed">{item.detail}</p>
                  </div>
                  <span className={`flex-shrink-0 px-3 py-1 text-sm font-semibold font-[Founders_Grotesk_Mono] ${badgeBg}`}>
                    {item.delta}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── INSIGHTS TAB ─────────────────────────── */}
        {tab === "insights" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {KEY_HIGHLIGHTS.map((h) => (
                <InsightCard key={h.title} {...h} />
              ))}
            </div>

            {/* Summary Cards for Quick Stats */}
            <div className="bg-white shadow-sm border border-[#e0e0e0] p-6">
              <h2 className="text-lg font-normal text-[#272727] font-[Soehne_Kraftig] mb-4">Quick Numbers</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-[#868686]">YoY Change (from 2025-26)</p>
                  <p className="text-2xl font-bold text-[#2AB34B]">+$15.9B</p>
                  <p className="text-xs text-[#9e9e9e]">+3.3%</p>
                </div>
                <div>
                  <p className="text-sm text-[#868686]">YoY Change (from 2024-25)</p>
                  <p className="text-2xl font-bold text-[#2AB34B]">+$29.0B</p>
                  <p className="text-xs text-[#9e9e9e]">+6.1%</p>
                </div>
                <div>
                  <p className="text-sm text-[#868686]">Debt Servicing Ratio</p>
                  <p className="text-2xl font-bold text-[#AF5D16]">10.7%</p>
                  <p className="text-xs text-[#9e9e9e]">of total budgetary</p>
                </div>
                <div>
                  <p className="text-sm text-[#868686]">Defence Share of Voted</p>
                  <p className="text-2xl font-bold text-[#418599]">21.0%</p>
                  <p className="text-xs text-[#9e9e9e]">${DEPARTMENTS.find(d => d.name === "National Defence")?.voted}B / ${TOTAL.budgetaryVoted}B</p>
                </div>
              </div>
            </div>

            {/* Composition detail */}
            <div className="bg-white shadow-sm border border-[#e0e0e0] p-6">
              <h2 className="text-lg font-normal text-[#272727] font-[Soehne_Kraftig] mb-4">Where Does Each Dollar Go?</h2>
              <div className="space-y-4">
                {COMPOSITION.map((c) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-[#272727]">{c.name}</span>
                      <span className="text-[#868686] font-[Founders_Grotesk_Mono]">{fmt(c.value)} ({c.pct}%)</span>
                    </div>
                    <div className="w-full h-4 bg-[#e0e0e0] overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e0e0e0] bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-[#9e9e9e] flex justify-between">
          <span>Data: Treasury Board of Canada Secretariat · 2026–27 Main Estimates</span>
          <a
            href="https://www.canada.ca/en/treasury-board-secretariat/services/planned-government-spending/government-expenditure-plan-main-estimates/2026-27-estimates.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#6d6d6d]"
          >
            Source →
          </a>
        </div>
      </footer>
    </div>
  );
}
