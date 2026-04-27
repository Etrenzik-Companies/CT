import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { PROJECT_CONTROL_PAGES } from "./project-control-pages";

const PAGE_META: Record<string, { label: string; icon: string; desc: string }> = {
  "/project-control":                 { label: "Project Control",     icon: "🏗️",  desc: "Central command for all project control operations." },
  "/project-control/contractors":     { label: "Contractors",         icon: "👷",  desc: "Manage and vet general contractors and subcontractors." },
  "/project-control/trades":          { label: "Trades",              icon: "🔧",  desc: "44-category trade management and status tracking." },
  "/project-control/estimating":      { label: "Estimating",          icon: "📊",  desc: "Cost estimation, variance tracking, and reconciliation." },
  "/project-control/bid-packages":    { label: "Bid Packages",        icon: "📦",  desc: "Issue, track, and evaluate competitive bid packages." },
  "/project-control/code-compliance": { label: "Code Compliance",     icon: "✅",  desc: "Code review gates, AHJ requirements, and variance logs." },
  "/project-control/permitting":      { label: "Permitting",          icon: "📋",  desc: "Permit applications, approvals, and inspection scheduling." },
  "/project-control/incentives":      { label: "Incentives",          icon: "💰",  desc: "Tax credits, grants, and green-finance incentive tracking." },
  "/project-control/rag-knowledge":   { label: "RAG Knowledge",       icon: "🧠",  desc: "Indexed document retrieval for deal memos and specs." },
  "/project-control/mcp-tools":       { label: "MCP Tools",           icon: "🛠️",  desc: "Model Context Protocol registry and tool invocations." },
  "/project-control/agents":          { label: "Agents",              icon: "🤖",  desc: "Agentic orchestration, approval gates, and task routing." },
  "/project-control/templates":       { label: "Templates",           icon: "📝",  desc: "Document templates: PoF, term sheets, LOI, exhibits." },
  "/project-control/risks":           { label: "Risks",               icon: "⚠️",  desc: "Risk register, mitigation tasks, and red-flag alerts." },
  "/project-control/decisions":       { label: "Decisions",           icon: "🎯",  desc: "Decision log and escalation audit trail." },
};

function Sidebar() {
  return (
    <nav style={S.sidebar}>
      <div style={S.brand}>
        <span style={S.brandIcon}>🏗️</span>
        <div>
          <div style={S.brandTitle}>CT Control Tower</div>
          <div style={S.brandSub}>Clay Terrace · Hilton</div>
        </div>
      </div>
      <div style={S.navList}>
        {PROJECT_CONTROL_PAGES.map((path) => {
          const meta = PAGE_META[path];
          return (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({ ...S.navItem, ...(isActive ? S.navItemActive : {}) })}
            >
              <span style={S.navIcon}>{meta?.icon ?? "•"}</span>
              <span>{meta?.label ?? path}</span>
            </NavLink>
          );
        })}
      </div>
      <div style={S.sidebarFooter}>
        <span style={S.footerDot} />
        <span style={{ color: "var(--muted)", fontSize: 12 }}>ct.unykorn.org</span>
      </div>
    </nav>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  return (
    <div style={S.page}>
      <h1 style={S.h1}>Control Tower</h1>
      <p style={S.subtitle}>Clay Terrace · 180-Unit Hilton Garden Inn · Project Control Hub</p>
      <div style={S.grid}>
        {PROJECT_CONTROL_PAGES.filter((p) => p !== "/project-control").map((path) => {
          const meta = PAGE_META[path];
          return (
            <button key={path} style={S.card} onClick={() => navigate(path)}>
              <div style={S.cardIcon}>{meta?.icon ?? "•"}</div>
              <div style={S.cardLabel}>{meta?.label ?? path}</div>
              <div style={S.cardDesc}>{meta?.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SectionPage({ path }: { path: string }) {
  const meta = PAGE_META[path];
  return (
    <div style={S.page}>
      <div style={S.breadcrumb}>
        <NavLink to="/project-control">Control Tower</NavLink>
        <span style={{ color: "var(--muted)" }}> / </span>
        <span>{meta?.label}</span>
      </div>
      <h1 style={S.h1}>{meta?.icon} {meta?.label}</h1>
      <p style={S.subtitle}>{meta?.desc}</p>
      <div style={S.placeholder}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{meta?.icon}</div>
        <div style={{ color: "var(--muted)" }}>
          This module is under active development.
        </div>
        <div style={{ color: "var(--accent)", marginTop: 8, fontSize: 14 }}>
          Phase 5 → live data connections
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div style={S.layout}>
      <Sidebar />
      <main style={S.main}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/project-control" element={<DashboardPage />} />
          {PROJECT_CONTROL_PAGES.filter((p) => p !== "/project-control").map((path) => (
            <Route key={path} path={path} element={<SectionPage path={path} />} />
          ))}
        </Routes>
      </main>
    </div>
  );
}

/* ─── Inline styles (no extra CSS dep) ─────────────────────────────────────── */
const S: Record<string, React.CSSProperties> = {
  layout:      { display: "flex", minHeight: "100dvh" },
  sidebar:     { width: 240, minWidth: 240, background: "var(--surface)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "24px 0 16px" },
  brand:       { display: "flex", alignItems: "center", gap: 12, padding: "0 20px 24px", borderBottom: "1px solid var(--border)" },
  brandIcon:   { fontSize: 28 },
  brandTitle:  { fontWeight: 700, fontSize: 14, color: "var(--text)", letterSpacing: 0.3 },
  brandSub:    { fontSize: 11, color: "var(--muted)" },
  navList:     { flex: 1, overflowY: "auto", padding: "12px 8px" },
  navItem:     { display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 6, fontSize: 13, color: "var(--muted)", cursor: "pointer", width: "100%", marginBottom: 2 },
  navItemActive:{ color: "var(--text)", background: "var(--accent-dim)" },
  navIcon:     { fontSize: 15, width: 20, textAlign: "center" },
  sidebarFooter:{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px 0", borderTop: "1px solid var(--border)" },
  footerDot:   { width: 7, height: 7, borderRadius: "50%", background: "var(--success)" },
  main:        { flex: 1, overflowY: "auto", background: "var(--bg)" },
  page:        { maxWidth: 1000, margin: "0 auto", padding: "48px 32px" },
  h1:          { fontSize: 28, fontWeight: 700, marginBottom: 8 },
  subtitle:    { color: "var(--muted)", marginBottom: 40, fontSize: 15 },
  breadcrumb:  { fontSize: 13, color: "var(--muted)", marginBottom: 20 },
  grid:        { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 },
  card:        { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "24px 20px", textAlign: "left", cursor: "pointer", transition: "border-color 0.15s", color: "var(--text)" },
  cardIcon:    { fontSize: 28, marginBottom: 12 },
  cardLabel:   { fontWeight: 600, marginBottom: 8, fontSize: 14 },
  cardDesc:    { fontSize: 12, color: "var(--muted)", lineHeight: 1.5 },
  placeholder: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 48, textAlign: "center", marginTop: 24 },
};
