// 2026-27 Main Estimates Data
// Source: Treasury Board of Canada Secretariat

export const TOTAL = {
  budgetaryVoted: 230.4,
  budgetaryStatutory: 272.4,
  totalBudgetary: 502.8,
  nonBudgetary: 2.9,
};

export const COMPOSITION = [
  { name: "Transfer Payments", value: 300.5, pct: 59.8, color: "#932f2f" },
  { name: "Operating & Capital", value: 148.6, pct: 29.5, color: "#418599" },
  { name: "Public Debt Charges", value: 53.7, pct: 10.7, color: "#AF5D16" },
];

export const YEAR_OVER_YEAR = [
  {
    year: "2024–25 Actual",
    voted: 204.6,
    statutory: 269.2,
    total: 473.8,
  },
  {
    year: "2025–26 Main",
    voted: 222.9,
    statutory: 264.0,
    total: 486.9,
  },
  {
    year: "2026–27 Main",
    voted: 230.4,
    statutory: 272.4,
    total: 502.8,
  },
];

export interface Department {
  name: string;
  voted: number;
  statutory: number;
  total: number;
  prevTotal: number;
  category: "large" | "medium" | "small";
}

export const DEPARTMENTS: Department[] = [
  { name: "National Defence", voted: 48.4, statutory: 2.29, total: 50.69, prevTotal: 35.7, category: "large" },
  { name: "Indigenous Services", voted: 23.9, statutory: 1.1, total: 25.0, prevTotal: 24.0, category: "large" },
  { name: "Employment & Social Development", voted: 13.6, statutory: 88.2, total: 101.8, prevTotal: 98.5, category: "large" },
  { name: "Crown-Indigenous Relations", voted: 11.8, statutory: 0.72, total: 12.52, prevTotal: 12.0, category: "large" },
  { name: "Treasury Board Secretariat", voted: 11.8, statutory: 0.14, total: 11.94, prevTotal: 11.5, category: "large" },
  { name: "Health", voted: 10.4, statutory: 0.09, total: 10.49, prevTotal: 10.1, category: "large" },
  { name: "Finance", voted: 0.16, statutory: 158.11, total: 158.27, prevTotal: 153.0, category: "large" },
  { name: "Canada Revenue Agency", voted: 4.85, statutory: 1.43, total: 6.27, prevTotal: 6.1, category: "medium" },
  { name: "CMHC", voted: 5.34, statutory: 0.79, total: 6.13, prevTotal: 5.5, category: "medium" },
  { name: "Immigration, Refugees & Citizenship", voted: 5.11, statutory: 0.07, total: 5.18, prevTotal: 6.09, category: "medium" },
  { name: "Public Safety", voted: 3.34, statutory: 0.86, total: 4.20, prevTotal: 4.0, category: "medium" },
  { name: "Transport", voted: 3.04, statutory: 0.36, total: 3.40, prevTotal: 3.3, category: "medium" },
  { name: "Global Affairs", voted: 7.98, statutory: 0.32, total: 8.30, prevTotal: 9.76, category: "medium" },
  { name: "Public Services & Procurement", voted: 4.83, statutory: 2.49, total: 7.32, prevTotal: 7.1, category: "medium" },
  { name: "Innovation, Science & Economic Dev.", voted: 4.42, statutory: 0.19, total: 4.61, prevTotal: 4.5, category: "medium" },
  { name: "Natural Resources", voted: 3.05, statutory: 0.12, total: 3.17, prevTotal: 3.1, category: "medium" },
  { name: "Environment & Climate Change", voted: 2.62, statutory: 0.05, total: 2.67, prevTotal: 4.85, category: "medium" },
  { name: "Agriculture & Agri-Food", voted: 2.23, statutory: 0.36, total: 2.59, prevTotal: 2.5, category: "medium" },
  { name: "Fisheries & Oceans", voted: 1.83, statutory: 0.06, total: 1.89, prevTotal: 6.1, category: "small" },
  { name: "CSE (Communications Security)", voted: 1.98, statutory: 0.03, total: 2.01, prevTotal: 1.23, category: "small" },
  { name: "Veterans Affairs", voted: 2.08, statutory: 4.93, total: 7.01, prevTotal: 6.8, category: "medium" },
  { name: "Canadian Heritage", voted: 2.01, statutory: 0.24, total: 2.25, prevTotal: 2.2, category: "small" },
  { name: "Justice", voted: 1.25, statutory: 0.59, total: 1.84, prevTotal: 1.8, category: "small" },
  { name: "Correctional Service", voted: 3.15, statutory: 0.02, total: 3.17, prevTotal: 3.1, category: "medium" },
  { name: "RCMP", voted: 4.39, statutory: 0.49, total: 4.88, prevTotal: 4.7, category: "medium" },
  { name: "CBSA (Border Services)", voted: 3.20, statutory: 0.08, total: 3.28, prevTotal: 3.15, category: "medium" },
  { name: "Shared Services Canada", voted: 2.62, statutory: 0.01, total: 2.63, prevTotal: 2.5, category: "small" },
  { name: "Infrastructure", voted: 2.85, statutory: 0.02, total: 2.87, prevTotal: 2.6, category: "small" },
  { name: "Canadian Space Agency", voted: 0.45, statutory: 0.01, total: 0.46, prevTotal: 0.44, category: "small" },
  { name: "Statistics Canada", voted: 0.74, statutory: 0.01, total: 0.75, prevTotal: 0.73, category: "small" },
];

export const WINNERS_LOSERS: { rank: number; headline: string; detail: string; delta: string; direction: "up" | "down" | "neutral" }[] = [
  { rank: 1, headline: "Defence is the story", detail: "National Defence surges +$15B (+42%) to $50.7B, with capital spending nearly doubling to $18B. This is the government delivering on its $30B/5-year commitment amid U.S. pressure and NATO obligations.", delta: "+42%", direction: "up" },
  { rank: 2, headline: "Fisheries & Oceans collapses 69%", detail: "From $6.1B to $1.9B, the steepest cut of any major department. Capital spending dropped 88%, likely reflecting the Coast Guard's security functions migrating under defence.", delta: "-69%", direction: "down" },
  { rank: 3, headline: "Carbon pricing is fully dead", detail: "$4.6B in carbon rebate distributions (individuals, small businesses, provinces) falls to $0. Environment Canada is cut 45% overall.", delta: "-100%", direction: "down" },
  { rank: 4, headline: "Debt interest hits $53.7B", detail: "Nearly matching defence spending. Interest on unmatured debt alone is up $4.7B to $48.6B.", delta: "$53.7B", direction: "neutral" },
  { rank: 5, headline: "Elderly benefits reach ~$89B", detail: "OAS ($67.8B) + GIS ($20.4B) continues to be 1 in 6 federal dollars, growing relentlessly with demographics.", delta: "~$89B", direction: "neutral" },
  { rank: 6, headline: "CSE (signals intelligence) surges 64%", detail: "The fastest-growing significant agency at $2B, reflecting the cyber and intelligence buildup.", delta: "+64%", direction: "up" },
  { rank: 7, headline: "Pharmacare & Disability Benefit scale up", detail: "Pharmacare triples to $320M and the Canada Disability Benefit scales to $1.1B — two meaningful new social programs taking shape.", delta: "+3x", direction: "up" },
  { rank: 8, headline: "Housing & Infrastructure +15%", detail: "Up to $10.5B, reflecting the new Build Communities Strong Fund.", delta: "+15%", direction: "up" },
  { rank: 9, headline: "Immigration pulls back 15%", detail: "The government pulls back temporary resident admissions.", delta: "-15%", direction: "down" },
  { rank: 10, headline: "Foreign Affairs -15% to $7.2B", detail: "International development grants cut from $5.3B to $4.2B.", delta: "-15%", direction: "down" },
];

export const KEY_HIGHLIGHTS = [
  {
    title: "Defence Surge",
    detail: "National Defence voted estimates at $48.4B — the single largest voted allocation, reflecting new defence commitments.",
    icon: "shield",
  },
  {
    title: "Debt Servicing",
    detail: "Public debt charges total $53.7B (10.7% of all spending), driven by rising interest on unmatured debt.",
    icon: "trending-up",
  },
  {
    title: "Transfer Dominance",
    detail: "Transfer payments make up 59.8% ($300.5B) of total budgetary spending — elderly benefits, health transfers, and equalization.",
    icon: "send",
  },
  {
    title: "Indigenous Investment",
    detail: "Indigenous Services and Crown-Indigenous Relations together account for $37.5B in voted estimates.",
    icon: "users",
  },
  {
    title: "Year-Over-Year Growth",
    detail: "Total budgetary estimates grew 3.3% ($15.9B) from 2025-26, and 6.1% ($29.0B) from 2024-25 actuals.",
    icon: "bar-chart",
  },
  {
    title: "Finance Statutory Weight",
    detail: "The Dept. of Finance carries $158.1B in statutory spending — mostly debt charges and transfer programs.",
    icon: "landmark",
  },
];
