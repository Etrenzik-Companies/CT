import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { PROJECT_CONTROL_PAGES } from "./project-control-pages";

const PAGE_META: Record<string, { label: string; icon: string; desc: string }> = {
  "/project-control/contractor-matrix": { label: "Contractor Matrix", icon: "🧱", desc: "Master contractor evidence matrix with lender, code, and incentive impacts." },
  "/project-control/trade-readiness": { label: "Trade Readiness", icon: "🧰", desc: "Trade-by-trade readiness and blocker map for GC, MEP, life-safety, and specialty scopes." },
  "/project-control/funding-routes": { label: "Funding Routes", icon: "💳", desc: "Route-by-route funding logic: required docs, risks, approvals, and what counts as verified." },
  "/project-control/rwa-funding-routes": { label: "RWA Funding Routes", icon: "📜", desc: "RWA/XRPL route controls showing allowed use, prohibited use, and approval state." },
  "/project-control/lender-evidence-checklist": { label: "Lender Evidence Checklist", icon: "🗃️", desc: "Master lender package checklist across identity, site control, budget, contracts, taxes, and compliance." },
  "/project-control/draw-package-readiness": { label: "Draw Package Readiness", icon: "📤", desc: "Construction draw readiness with lien waiver, inspection, and schedule support checks." },
  "/project-control/funding-gap-map": { label: "Funding Gap Map", icon: "🧭", desc: "Separated funding buckets for verified, awarded, submitted, estimated, and obligations." },
  "/project-control/evidence-inbox": { label: "Evidence Inbox", icon: "📥", desc: "Real evidence intake registry — classify, block secrets, and map documents to requirements." },
  "/project-control/evidence-mapping": { label: "Evidence Mapping", icon: "🗺️", desc: "Maps uploaded evidence to specific funding, contractor, lender, and compliance requirements." },
  "/project-control/packet-status": { label: "Packet Status", icon: "📊", desc: "Real lender-packet completeness by category — blocked until evidence accepted and reviewed." },
  "/project-control/accepted-evidence": { label: "Accepted Evidence", icon: "✅", desc: "Evidence items that have been uploaded, reviewed, and accepted by an authorised reviewer." },
  "/project-control/blocked-evidence": { label: "Blocked Evidence", icon: "🚫", desc: "Evidence items blocked due to secrets, missing review, or active compliance blockers." },
  "/project-control/review-queue": { label: "Review Queue", icon: "⏳", desc: "Outstanding evidence items requiring human review before any lender-ready classification." },
  "/project-control/real-lender-packet": { label: "Real Lender Packet", icon: "📋", desc: "Composite real lender packet status: accepted evidence + reviewed + no blockers required." },
  "/project-control/indiana-program-matrix": { label: "Indiana Program Matrix", icon: "🧮", desc: "Official-source matrix across incentives, grants, taxes, code compliance, and public finance." },
  "/project-control/esg-incentives-indiana": { label: "ESG Incentives", icon: "⚡", desc: "Federal and Indiana ESG/energy incentive screening with evidence gates and value-stage separation." },
  "/project-control/grants-public-funding": { label: "Grants & Public Funding", icon: "🏛️", desc: "State, local, environmental, and workforce grant pathways with monitor-only controls." },
  "/project-control/bonds-tif-redevelopment": { label: "Bonds / TIF / Redevelopment", icon: "🏗", desc: "Carmel/Hamilton public-finance pathways with public-body approval evidence requirements." },
  "/project-control/hotel-local-taxes": { label: "Hotel & Local Taxes", icon: "🧾", desc: "Operating tax obligations (not funding) for lodging, innkeeper tax, sales/use, and property-tax review." },
  "/project-control/code-compliance-indiana": { label: "Code Compliance", icon: "📐", desc: "Carmel permit workflow and Indiana building/fire/energy code compliance gates." },
  "/project-control/evidence-gaps-indiana": { label: "Evidence Gaps", icon: "🔍", desc: "Evidence checklist to move items from possible to verified in lender-safe sequence." },
  "/project-control/evidence-intake":      { label: "Evidence Intake",       icon: "🗂️", desc: "Document intake registry for lender, ESG, incentive, and asset evidence." },
  "/project-control/rag-index":            { label: "RAG Index",             icon: "📚", desc: "Indexed evidence citations with deterministic placeholder search." },
  "/project-control/lender-packet":        { label: "Lender Packet",         icon: "📁", desc: "Lender packet readiness, missing evidence, and review blockers." },
  "/project-control/incentive-evidence":   { label: "Incentive Evidence",    icon: "🧾", desc: "Maps incentive claims to required evidence and review status." },
  "/project-control/submission-readiness": { label: "Submission Readiness",  icon: "🧭", desc: "Cross-functional readiness for lender submission and human approvals." },
  "/project-control/rwa":                    { label: "RWA Registry",           icon: "🏛️",  desc: "Real-world asset documentation readiness and lender evidence checklist." },
  "/project-control/xrpl-readiness":         { label: "XRPL Readiness",         icon: "⛓️",  desc: "XRPL settlement simulation and compliance warning review. Simulation only." },
  "/project-control/pof":                    { label: "Proof of Funds",          icon: "🏦",  desc: "Capital stack verification, gap analysis, and lender-ready PoF packet status." },
  "/project-control/incentive-intelligence": { label: "Incentive Intelligence",  icon: "💡",  desc: "Tax credit, grant, and green-finance incentive matching engine. For review only." },
  "/project-control/esg-scorecard":          { label: "ESG Scorecard",           icon: "🌿",  desc: "Environmental, social, and governance metric tracking and certification readiness." },
  "/project-control/funding-match":          { label: "Funding Match",           icon: "💼",  desc: "Lender and program intelligence. Potential matches only — not commitments." },
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
  const phase6Paths = [
    "/project-control/rwa",
    "/project-control/xrpl-readiness",
    "/project-control/pof",
    "/project-control/incentive-intelligence",
    "/project-control/esg-scorecard",
    "/project-control/funding-match",
  ];
  const phase7Paths = [
    "/project-control/evidence-intake",
    "/project-control/rag-index",
    "/project-control/lender-packet",
    "/project-control/incentive-evidence",
    "/project-control/submission-readiness",
  ];
  const indianaMatrixPaths = [
    "/project-control/indiana-program-matrix",
    "/project-control/esg-incentives-indiana",
    "/project-control/grants-public-funding",
    "/project-control/bonds-tif-redevelopment",
    "/project-control/hotel-local-taxes",
    "/project-control/code-compliance-indiana",
    "/project-control/evidence-gaps-indiana",
  ];
  const fundingControlPaths = [
    "/project-control/contractor-matrix",
    "/project-control/trade-readiness",
    "/project-control/funding-routes",
    "/project-control/rwa-funding-routes",
    "/project-control/lender-evidence-checklist",
    "/project-control/draw-package-readiness",
    "/project-control/funding-gap-map",
  ];
  const evidencePacketPaths = [
    "/project-control/evidence-inbox",
    "/project-control/evidence-mapping",
    "/project-control/packet-status",
    "/project-control/accepted-evidence",
    "/project-control/blocked-evidence",
    "/project-control/review-queue",
    "/project-control/real-lender-packet",
  ];
  const isPhase6 = phase6Paths.includes(path);
  const isPhase7 = phase7Paths.includes(path);
  const isIndianaMatrix = indianaMatrixPaths.includes(path);
  const isFundingControl = fundingControlPaths.includes(path);
  const isEvidencePacket = evidencePacketPaths.includes(path);
  return (
    <div style={S.page}>
      <div style={S.breadcrumb}>
        <NavLink to="/project-control">Control Tower</NavLink>
        <span style={{ color: "var(--muted)" }}> / </span>
        <span>{meta?.label}</span>
      </div>
      <h1 style={S.h1}>{meta?.icon} {meta?.label}</h1>
      <p style={S.subtitle}>{meta?.desc}</p>
      {isPhase6 && <Phase6Panel path={path} />}
      {isPhase7 && <Phase7Panel path={path} />}
      {isIndianaMatrix && <IndianaMatrixPanel path={path} />}
      {isFundingControl && <FundingControlPanel path={path} />}
      {isEvidencePacket && <EvidencePacketPanel path={path} />}
      {!isPhase6 && !isPhase7 && !isIndianaMatrix && !isFundingControl && !isEvidencePacket && (
        <div style={S.placeholder}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{meta?.icon}</div>
          <div style={{ color: "var(--muted)" }}>This module is under active development.</div>
          <div style={{ color: "var(--accent)", marginTop: 8, fontSize: 14 }}>Phase 5 → live data connections</div>
        </div>
      )}
    </div>
  );
}

const PHASE6_PANELS: Record<string, { status: string; statusColor: string; badges: string[]; reviewWarning: string; items: Array<{ label: string; value: string; note?: string }> }> = {
  "/project-control/rwa": {
    status: "NEEDS REVIEW",
    statusColor: "var(--warning, #d97706)",
    badges: ["Title Report", "Deed", "Appraisal", "Insurance", "Survey", "Phase I ESA"],
    reviewWarning: "RWA readiness requires legal and title counsel review before lender submission.",
    items: [
      { label: "Required Evidence Types", value: "6 of 6 defined" },
      { label: "Ownership Verification", value: "100% accounted for", note: "Must equal 100% — no gaps" },
      { label: "Lien Resolution", value: "Pending evidence", note: "Each lien must have an evidenceId" },
      { label: "Appraisal Age", value: "< 12 months required" },
      { label: "Insurance Expiry", value: "Active coverage required" },
    ],
  },
  "/project-control/xrpl-readiness": {
    status: "SIMULATION ONLY",
    statusColor: "var(--accent, #3b82f6)",
    badges: ["Approval Required", "No Live Execution", "Compliance Checked"],
    reviewWarning: "All XRPL actions are simulated and require approval. No live token creation or settlement is executed.",
    items: [
      { label: "Asset Classification", value: "documentation_only → tokenization_candidate" },
      { label: "Action Types", value: "11 — all approval_required" },
      { label: "Compliance Warnings", value: "6 standard codes always included" },
      { label: "Currency / Issuer", value: "Required for settlement_reference classification" },
      { label: "Live Execution", value: "DISABLED — approval_required on all paths" },
    ],
  },
  "/project-control/pof": {
    status: "LENDER REVIEW REQUIRED",
    statusColor: "var(--warning, #d97706)",
    badges: ["Bank Evidence", "Capital Stack", "Gap Analysis", "Lender Authorization"],
    reviewWarning: "Estimated sources (grants, tax credits, rebates, C-PACE) are never counted as verified funds.",
    items: [
      { label: "Verified Funds", value: "Bank statements + blockchain evidence" },
      { label: "Estimated Sources", value: "EXCLUDED — never count toward verified gap close" },
      { label: "Capital Gap", value: "Must be $0 for lender_ready status" },
      { label: "Lender Authorization", value: "Required for lender_ready" },
      { label: "Status Levels", value: "lender_ready | internally_ready | evidence_missing | gap_unresolved | blocked" },
    ],
  },
  "/project-control/incentive-intelligence": {
    status: "FOR REVIEW ONLY",
    statusColor: "var(--muted, #6b7280)",
    badges: ["179D", "45L", "C-PACE", "Utility Rebates", "GA Property Tax", "DOE Better Buildings"],
    reviewWarning: "All incentive estimates are for planning purposes only. Consult a qualified tax professional.",
    items: [
      { label: "Built-in Programs", value: "6 (expandable)" },
      { label: "Jurisdictions", value: "Federal + Georgia" },
      { label: "Estimated Benefit", value: "ESTIMATE ONLY — not a guarantee" },
      { label: "Stacking", value: "Programs may stack — verify with tax counsel" },
      { label: "Match Statuses", value: "likely_match | possible_match | needs_review | not_eligible" },
    ],
  },
  "/project-control/esg-scorecard": {
    status: "EVIDENCE REQUIRED",
    statusColor: "var(--success, #16a34a)",
    badges: ["Energy", "Emissions", "Water", "Resilience", "IAQ", "Community", "Workforce", "Compliance", "Documentation"],
    reviewWarning: "Carbon and water reduction figures are estimates only. Third-party certification verification required.",
    items: [
      { label: "Weighted Categories", value: "9 — energy:25%, emissions:20%, water:10%, resilience:10%, IAQ:10%, community:10%, workforce:5%, compliance:5%, docs:5%" },
      { label: "Certification Threshold", value: "≥ 80 score, no missing evidence" },
      { label: "Evidence Complete Threshold", value: "≥ 50 score, no missing evidence" },
      { label: "Estimated Metrics", value: "Score reduced to 40% weight — must have verified evidence" },
      { label: "Status", value: "certification_ready | evidence_complete | evidence_partial | evidence_missing | not_assessed" },
    ],
  },
  "/project-control/funding-match": {
    status: "POTENTIAL ONLY",
    statusColor: "var(--warning, #d97706)",
    badges: ["Senior Debt", "C-PACE", "Green Bank", "HUD 221d4", "NMTC", "Bridge"],
    reviewWarning: "All program matches are potential only — not commitments, pre-approvals, or term sheets. Engage qualified real estate finance counsel.",
    items: [
      { label: "Built-in Programs", value: "6 (construction loans, bridge, C-PACE, green bank, HUD, NMTC)" },
      { label: "Committed vs Potential", value: "Strictly separated — committed = executed docs only" },
      { label: "Estimated Incentives", value: "NEVER counted as committed capital" },
      { label: "Capital Gap", value: "Computed from committed capital stack vs project cost" },
      { label: "Readiness Score", value: "RWA 30% + PoF 35% + ESG 20% + Incentive Alignment 15%" },
    ],
  },
};

const PHASE7_PANELS: Record<string, { status: string; statusColor: string; badges: string[]; reviewWarning: string; items: Array<{ label: string; value: string; note?: string }> }> = {
  "/project-control/evidence-intake": {
    status: "NEEDS REVIEW",
    statusColor: "var(--warning, #d97706)",
    badges: ["Missing", "Uploaded", "Needs Review", "Accepted", "Blocked"],
    reviewWarning: "Uploaded evidence is never accepted automatically. Human, legal, accounting, lender, and off-chain review remain required.",
    items: [
      { label: "Total Evidence Docs", value: "24 tracked", note: "Registry supports lender, ESG, incentive, RWA, and funding evidence" },
      { label: "Accepted Docs", value: "9 accepted" },
      { label: "Missing Docs", value: "7 missing", note: "Missing evidence blocks lender-ready packet status" },
      { label: "Review-Required Docs", value: "10 queued", note: "Uploaded and classified docs stay here until approved" },
      { label: "Expired Docs", value: "2 flagged", note: "Expired evidence is treated as unusable until refreshed" },
      { label: "Next Best Action", value: "Resolve missing appraisal/title/permit package" },
    ],
  },
  "/project-control/rag-index": {
    status: "CITED ONLY",
    statusColor: "var(--accent, #3b82f6)",
    badges: ["Indexed", "Unindexed", "Citation Required"],
    reviewWarning: "RAG answers must cite indexed source documents. Unindexed or missing evidence cannot be inferred or hallucinated.",
    items: [
      { label: "RAG Indexed Docs", value: "17 indexed" },
      { label: "Unindexed Docs", value: "3 unindexed", note: "Blocked or rejected documents are not searchable" },
      { label: "Citation Payload", value: "document ID + title + chunk ID + relevance" },
      { label: "Chunk Strategy", value: "Safe deterministic placeholder chunks" },
      { label: "Search Mode", value: "Mock deterministic search", note: "Vector adapter reserved for later phase" },
      { label: "Next Best Action", value: "Index accepted lender and ESG evidence first" },
    ],
  },
  "/project-control/lender-packet": {
    status: "NOT LENDER READY",
    statusColor: "var(--warning, #d97706)",
    badges: ["Missing", "Lender Ready", "Not Lender Ready", "Human Approval Required"],
    reviewWarning: "Lender-ready status is blocked by unresolved PoF gaps, missing evidence, missing lender authorizations, estimated incentives, or incomplete legal/accounting review.",
    items: [
      { label: "Lender Packet Readiness Score", value: "68 / 100" },
      { label: "Blocked Reasons", value: "PoF gap, incentive estimate, pending legal review" },
      { label: "Missing Required Docs", value: "Permit set, human approval log" },
      { label: "Review-Required Docs", value: "Blockchain proof references + legal opinion" },
      { label: "Lender Use Authorization", value: "Required before lender-ready" },
      { label: "Next Best Action", value: "Close PoF gap and complete lender authorization package" },
    ],
  },
  "/project-control/incentive-evidence": {
    status: "UPLOADED",
    statusColor: "var(--accent, #3b82f6)",
    badges: ["Estimated", "Application Ready", "Submitted", "Awarded", "Verified"],
    reviewWarning: "Estimated incentive values never count as verified funds. Incentive evidence must move through reviewed stages.",
    items: [
      { label: "Incentive Evidence Status", value: "application_ready" },
      { label: "Required Docs", value: "Tax estimate, utility docs, energy audit, contractor scope, equipment spec, owner eligibility" },
      { label: "Submitted / Awarded", value: "Awaiting application package and award evidence" },
      { label: "Verified Funds", value: "0", note: "Becomes non-zero only after award + accounting review + proof of installation" },
      { label: "Review-Required Docs", value: "Accounting review pending" },
      { label: "Next Best Action", value: "Move eligible incentive packets from application_ready to submitted" },
    ],
  },
  "/project-control/submission-readiness": {
    status: "HUMAN APPROVAL REQUIRED",
    statusColor: "var(--warning, #d97706)",
    badges: ["Accepted", "Blocked", "Human Approval Required"],
    reviewWarning: "Real-world submission still requires lender, legal, accounting, and human approval. XRPL and blockchain references remain proof references only unless separately approved.",
    items: [
      { label: "Cross-Module Readiness", value: "Evidence + PoF + ESG + Funding + Incentives" },
      { label: "Accepted Evidence", value: "9 documents" },
      { label: "Blocked Reasons", value: "Missing permits, unresolved PoF gap, blockchain off-chain review" },
      { label: "Incentive Status", value: "Estimated / submitted / awarded / verified separated" },
      { label: "RAG Support", value: "Citations available only for indexed docs" },
      { label: "Next Best Action", value: "Complete human approval log before external submission" },
    ],
  },
};

const INDIANA_MATRIX_PANELS: Record<string, { status: string; statusColor: string; badges: string[]; reviewWarning: string; items: Array<{ label: string; value: string; note?: string }> }> = {
  "/project-control/indiana-program-matrix": {
    status: "OFFICIAL-SOURCE SCREENING",
    statusColor: "var(--accent, #3b82f6)",
    badges: ["State", "Federal", "Local", "Tax", "Code", "Evidence"],
    reviewWarning: "Taxes and code requirements are obligations, not funding sources. Estimated incentives are never treated as verified funds.",
    items: [
      { label: "Total Programs Screened", value: "38" },
      { label: "Likely Matches", value: "0", note: "Conservative by design until evidence matures" },
      { label: "Possible + Needs Review", value: "19" },
      { label: "Monitor-Only Items", value: "11" },
      { label: "Blocked/Not Applicable", value: "8" },
      { label: "Missing Evidence Count", value: "120+", note: "Address + parcel + zoning + utility + approvals are primary gaps" },
      { label: "Verified Funding Amount", value: "$0" },
      { label: "Estimated Funding Amount", value: "$0 (placeholder until evidence-linked amounts entered)" },
      { label: "Awarded Funding Amount", value: "$0" },
      { label: "Not-Counted Amount", value: "$0" },
      { label: "Next Best Action", value: "Complete parcel, zoning, utility, and IEDC pre-screen evidence" },
    ],
  },
  "/project-control/esg-incentives-indiana": {
    status: "EVIDENCE GATED",
    statusColor: "var(--success, #16a34a)",
    badges: ["179D", "48E", "30C", "DSIRE", "DOE", "C-PACE Monitor"],
    reviewWarning: "179D, 48E, and 30C remain needs_review until model/spec/placed-in-service/tax-ownership evidence and tax review are complete.",
    items: [
      { label: "Federal ESG Paths", value: "179D, 48E, 48E(h), 30C, transferability review" },
      { label: "Registry Sources", value: "DOE Financing Navigator + DSIRE" },
      { label: "C-PACE Status", value: "monitor_only", note: "Requires local authorization + lender consent" },
      { label: "Estimated vs Verified", value: "Separated by stage", note: "estimated/application_ready/submitted/awarded/verified/not_counted" },
      { label: "Counts As Verified Funds", value: "Only verified" },
      { label: "Next Best Action", value: "Upload energy model, specs, placed-in-service plan, and tax memo" },
    ],
  },
  "/project-control/grants-public-funding": {
    status: "NEEDS REVIEW",
    statusColor: "var(--warning, #d97706)",
    badges: ["SEF", "IDGF", "Brownfield", "SRF", "EPA", "OCRA Monitor"],
    reviewWarning: "Grant programs are not verified funding until awarded, documented, and reviewed.",
    items: [
      { label: "Indiana Grant Tracks", value: "SEF, IDGF, Engineering, Community Collaboration" },
      { label: "Environmental Tracks", value: "IFA Brownfields RLF, SRF, EPA Brownfields (monitor until site qualifies)" },
      { label: "OCRA CDBG", value: "monitor_only", note: "Carmel path may be limited without specific qualification" },
      { label: "SEF Gate", value: "jobs + payroll + training plan + IEDC contract evidence" },
      { label: "Brownfield Gate", value: "Phase I/Phase II + environmental determination evidence" },
      { label: "Next Best Action", value: "Build training packet and environmental diligence packet" },
    ],
  },
  "/project-control/bonds-tif-redevelopment": {
    status: "PUBLIC APPROVAL REQUIRED",
    statusColor: "var(--warning, #d97706)",
    badges: ["Carmel", "Hamilton County", "Bond", "TIF", "Redevelopment"],
    reviewWarning: "Bonds/TIF/redevelopment pathways remain needs_review until public-body approvals and formal finance documents are in evidence.",
    items: [
      { label: "Local Finance Paths", value: "Carmel support, CRC/TIF monitor, bond-bank monitor, Hamilton EDC financing" },
      { label: "Required Public Records", value: "city/county support letter + resolution + hearing/approval records" },
      { label: "Finance Docs", value: "term sheet + underwriting assumptions + counsel review" },
      { label: "Status", value: "needs_review" },
      { label: "Tourism/Hospitality Support", value: "possible path with county/public finance evidence" },
      { label: "Next Best Action", value: "Obtain local support letter and formal approval timeline" },
    ],
  },
  "/project-control/hotel-local-taxes": {
    status: "OBLIGATION TRACK",
    statusColor: "var(--muted, #6b7280)",
    badges: ["Sales Tax", "Innkeeper Tax", "F&B", "Property", "Use Tax"],
    reviewWarning: "Hotel and local taxes are operating obligations and never increase funding readiness.",
    items: [
      { label: "Obligations", value: "Indiana sales tax on lodging, Hamilton County innkeeper tax, F&B tax if applicable" },
      { label: "Additional Reviews", value: "Property tax/abatement, sales-use on materials and FF&E, payroll withholding, TPP tax" },
      { label: "Funding Treatment", value: "not_counted", note: "These are not incentives" },
      { label: "Evidence Needed", value: "Tax/accounting memo + legal memo" },
      { label: "Effect on Lender Ready", value: "Can block readiness if unresolved" },
      { label: "Next Best Action", value: "Finalize tax memo package by operating and construction category" },
    ],
  },
  "/project-control/code-compliance-indiana": {
    status: "BLOCKING GATES",
    statusColor: "var(--warning, #d97706)",
    badges: ["Permits", "Zoning", "Fire", "Energy", "ADA", "Health"],
    reviewWarning: "Code and permit gaps block lender-ready status until required applications and reviews are complete.",
    items: [
      { label: "Carmel Workflow", value: "Building Safety permits, inspections, ILP/building permit sequencing" },
      { label: "State Code Coverage", value: "Indiana building, fire, mechanical, fuel gas, electrical, energy conservation" },
      { label: "Other Required Reviews", value: "ADA/accessibility, elevator/lift, stormwater/engineering, sign permits, health/pool/food service" },
      { label: "Blocking Rule", value: "Any required unresolved code item blocks lender-ready" },
      { label: "Current Status", value: "blocked until permit/compliance evidence is present" },
      { label: "Next Best Action", value: "Submit permits and capture plan-review status in evidence registry" },
    ],
  },
  "/project-control/evidence-gaps-indiana": {
    status: "ACTION QUEUE",
    statusColor: "var(--accent, #3b82f6)",
    badges: ["Address/Parcel", "Zoning", "Utility", "IEDC", "Public Approval", "Human Approval"],
    reviewWarning: "No item can move to verified without required evidence and human/legal/accounting review sign-off.",
    items: [
      { label: "Core Missing Evidence", value: "project address/parcel, zoning district, utility territory" },
      { label: "Incentive Gaps", value: "energy model, equipment specs, placed-in-service facts, tax ownership" },
      { label: "State Program Gaps", value: "job schedule, payroll estimates, IEDC application evidence" },
      { label: "Public Finance Gaps", value: "city/county support letter, public-body approvals, bond/TIF resolution" },
      { label: "Compliance Gaps", value: "permit applications, code review status, ADA and health review evidence" },
      { label: "Next Best Action", value: "Work evidence checklist in priority order until lender-ready blockers are cleared" },
    ],
  },
};

function Phase6Panel({ path }: { path: string }) {
  const panel = PHASE6_PANELS[path];
  if (!panel) return null;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <span style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 14px", fontSize: 12, fontWeight: 700, color: panel.statusColor, letterSpacing: 0.5 }}>
          {panel.status}
        </span>
        {panel.badges.map((b) => (
          <span key={b} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "var(--muted)" }}>
            {b}
          </span>
        ))}
      </div>
      <div style={{ background: "var(--surface)", border: `1px solid ${panel.statusColor}`, borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: panel.statusColor }}>
        ⚠️ {panel.reviewWarning}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {panel.items.map((item) => (
          <div key={item.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{item.value}</div>
            {item.note && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{item.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Phase7Panel({ path }: { path: string }) {
  const panel = PHASE7_PANELS[path];
  if (!panel) return null;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <span style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 14px", fontSize: 12, fontWeight: 700, color: panel.statusColor, letterSpacing: 0.5 }}>
          {panel.status}
        </span>
        {panel.badges.map((badge) => (
          <span key={badge} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "var(--muted)" }}>
            {badge}
          </span>
        ))}
      </div>
      <div style={{ background: "var(--surface)", border: `1px solid ${panel.statusColor}`, borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: panel.statusColor }}>
        ⚠️ {panel.reviewWarning}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {panel.items.map((item) => (
          <div key={item.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{item.value}</div>
            {item.note && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{item.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

const FUNDING_CONTROL_PANELS: Record<string, { status: string; statusColor: string; badges: string[]; reviewWarning: string; items: Array<{ label: string; value: string; note?: string }> }> = {
  "/project-control/contractor-matrix": {
    status: "EVIDENCE GATED",
    statusColor: "var(--warning, #d97706)",
    badges: ["W-9", "License", "Insurance", "Bids", "Schedule", "Lien Waivers"],
    reviewWarning: "Missing GC/major trade evidence blocks lender readiness even when capital sources look sufficient.",
    items: [
      { label: "Total Contractors Screened", value: "38 trade packets" },
      { label: "Lender-Blocking Trades", value: "7" },
      { label: "Code-Blocking Trades", value: "5" },
      { label: "Incentive-Blocking Trades", value: "4", note: "Mostly energy trades missing equipment specs" },
      { label: "Missing Evidence", value: "W-9, insurance, approved bids, schedule, permit assignment" },
      { label: "Next Best Action", value: "Close GC + architect + MEP blocker packets first" },
    ],
  },
  "/project-control/trade-readiness": {
    status: "NEEDS REVIEW",
    statusColor: "var(--warning, #d97706)",
    badges: ["GC", "Architect", "Civil", "Structural", "MEP", "Life Safety"],
    reviewWarning: "Trade readiness is separate from funding route status and can independently block loan closing/draws.",
    items: [
      { label: "Major Trade Readiness", value: "Not lender-ready" },
      { label: "Blocked Trades", value: "General contractor, architect, mechanical, electrical, fire protection" },
      { label: "Schedule Risk", value: "Medium to High", note: "Lead-time evidence incomplete" },
      { label: "Lien Waiver Control", value: "Incomplete" },
      { label: "Draw Support", value: "Insufficient until bid + schedule + waiver chain is complete" },
      { label: "Next Best Action", value: "Lock bid approvals and draw-control evidence by trade" },
    ],
  },
  "/project-control/funding-routes": {
    status: "SEPARATED BUCKETS",
    statusColor: "var(--accent, #3b82f6)",
    badges: ["Verified", "Awarded", "Submitted", "Estimated", "Obligations", "Not Counted"],
    reviewWarning: "Estimated incentives, applied grants, potential TIF/bonds, and XRPL proof routes do not count as verified funds.",
    items: [
      { label: "Route Count", value: "28 routes tracked" },
      { label: "Verified Funding", value: "$0 (placeholder until evidence-backed commitments are loaded)" },
      { label: "Estimated Funding", value: "Tracked separately" },
      { label: "Awarded Funding", value: "Tracked separately" },
      { label: "Obligations", value: "Taxes, code, permit cost buckets" },
      { label: "Next Best Action", value: "Move routes from estimated/submitted to awarded/verified with evidence" },
    ],
  },
  "/project-control/rwa-funding-routes": {
    status: "APPROVAL REQUIRED",
    statusColor: "var(--warning, #d97706)",
    badges: ["Proof Only", "No Live Issuance", "No DEX", "No Escrow", "Legal Review"],
    reviewWarning: "RWA/XRPL routes are evidence/compliance routes and not spendable funding sources in this control room.",
    items: [
      { label: "RWA Route Count", value: "12" },
      { label: "Spendable Funding", value: "$0", note: "All RWA/XRPL routes are non-spendable here" },
      { label: "Blocked Live Routes", value: "Live transaction route blocked by policy" },
      { label: "Legal/Compliance Gates", value: "Required for tokenized security and issued-asset review routes" },
      { label: "Approval Status", value: "Human + legal + compliance required for high-risk routes" },
      { label: "Next Best Action", value: "Use RWA routes for evidence and diligence only" },
    ],
  },
  "/project-control/lender-evidence-checklist": {
    status: "MASTER CHECKLIST",
    statusColor: "var(--accent, #3b82f6)",
    badges: ["Identity", "Site Control", "Budget", "Capital Stack", "Permits", "Legal"],
    reviewWarning: "Lender package remains blocked until all required master-checklist sections are evidenced and reviewed.",
    items: [
      { label: "Core Sections", value: "Project identity, site control, budget, capital stack, PoF, appraisal, entitlements" },
      { label: "Contractor Package", value: "GC contract, trade bids, licenses, insurance, bonding, schedule" },
      { label: "Tax + ESG Package", value: "Tax memo, 179D/48E/30C review, utility/grant evidence" },
      { label: "RWA/XRPL Package", value: "Proof-reference only, with legal/compliance approval log" },
      { label: "Missing Evidence", value: "Parcel/zoning/utility, award letters, approvals, permit chain" },
      { label: "Next Best Action", value: "Complete blocker evidence for lender use authorization" },
    ],
  },
  "/project-control/draw-package-readiness": {
    status: "DRAW CONTROLS",
    statusColor: "var(--warning, #d97706)",
    badges: ["Budget", "Schedule", "Inspections", "Lien Waivers", "CO", "Contingency"],
    reviewWarning: "Loan draw readiness requires lien-waiver and inspection evidence controls, not only budget lines.",
    items: [
      { label: "Draw Package Status", value: "Not ready" },
      { label: "Required Draw Evidence", value: "Approved schedule of values, inspections, lien waivers, change-order log" },
      { label: "Primary Gaps", value: "Trade-level waivers and schedule updates missing" },
      { label: "Contingency Controls", value: "Needs documented change-order governance" },
      { label: "Risk", value: "Funding delay risk until draw controls are complete" },
      { label: "Next Best Action", value: "Finalize draw package template with trade packet bindings" },
    ],
  },
  "/project-control/funding-gap-map": {
    status: "GAP VISIBILITY",
    statusColor: "var(--accent, #3b82f6)",
    badges: ["Capital Gap", "Verified", "Estimated", "Obligations", "Not Counted"],
    reviewWarning: "Gap map separates spendable capital from non-spendable estimates and obligations.",
    items: [
      { label: "Capital Gap", value: "Visible separately from estimated incentives" },
      { label: "Verified Dollar Bucket", value: "Only evidence-backed and authorized funds" },
      { label: "Estimated Bucket", value: "Does not close lender gap" },
      { label: "Obligations Bucket", value: "Hotel/local taxes + code/permit obligations" },
      { label: "Not-Counted Bucket", value: "RWA proof references, applied grants, potential public-finance items" },
      { label: "Next Best Action", value: "Convert approved routes and award letters into verified bucket" },
    ],
  },
};

function IndianaMatrixPanel({ path }: { path: string }) {
  const panel = INDIANA_MATRIX_PANELS[path];
  if (!panel) return null;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <span style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 14px", fontSize: 12, fontWeight: 700, color: panel.statusColor, letterSpacing: 0.5 }}>
          {panel.status}
        </span>
        {panel.badges.map((badge) => (
          <span key={badge} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "var(--muted)" }}>
            {badge}
          </span>
        ))}
      </div>
      <div style={{ background: "var(--surface)", border: `1px solid ${panel.statusColor}`, borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: panel.statusColor }}>
        ⚠️ {panel.reviewWarning}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {panel.items.map((item) => (
          <div key={item.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{item.value}</div>
            {item.note && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{item.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function FundingControlPanel({ path }: { path: string }) {
  const panel = FUNDING_CONTROL_PANELS[path];
  if (!panel) return null;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <span style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 14px", fontSize: 12, fontWeight: 700, color: panel.statusColor, letterSpacing: 0.5 }}>
          {panel.status}
        </span>
        {panel.badges.map((badge) => (
          <span key={badge} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "var(--muted)" }}>
            {badge}
          </span>
        ))}
      </div>
      <div style={{ background: "var(--surface)", border: `1px solid ${panel.statusColor}`, borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: panel.statusColor }}>
        ⚠️ {panel.reviewWarning}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {panel.items.map((item) => (
          <div key={item.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{item.value}</div>
            {item.note && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{item.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

const EVIDENCE_PACKET_PANELS: Record<string, { status: string; statusColor: string; badges: string[]; reviewWarning: string; items: Array<{ label: string; value: string; note?: string }> }> = {
  "/project-control/evidence-inbox": {
    status: "INTAKE ONLY",
    statusColor: "var(--warning, #d97706)",
    badges: ["PDF", "Spreadsheet", "Email", "Image", "Legal", "Tax", "Secret Blocked"],
    reviewWarning: "Uploaded does NOT mean accepted. All evidence requires human review. Secret-containing files are blocked on intake.",
    items: [
      { label: "Files Received", value: "0 (no real uploads yet)" },
      { label: "Files Classified", value: "0" },
      { label: "Files Mapped", value: "0" },
      { label: "Files Needing Review", value: "0" },
      { label: "Files Blocked (Secrets)", value: "0" },
      { label: "Next Best Action", value: "Submit first evidence files: appraisal, title, GC insurance, bank statement" },
    ],
  },
  "/project-control/evidence-mapping": {
    status: "MAPPING ENGINE READY",
    statusColor: "var(--accent, #3b82f6)",
    badges: ["Contractor", "Funding", "RWA", "Lender", "Incentives", "Permits"],
    reviewWarning: "Mapping is a classification step only. Mapped evidence requires review and acceptance before contributing to lender-ready status.",
    items: [
      { label: "Total Mapping Rules", value: "36 requirement rules active" },
      { label: "Contractor Requirements", value: "gc_insurance, gc_bid, gc_license, gc_scope, gc_w9" },
      { label: "Funding Requirements", value: "appraisal, title, survey, bank statement, term sheet" },
      { label: "RWA Requirements", value: "rwa_legal_review, xrpl_proof_reference, human_approval_log" },
      { label: "Incentive Requirements", value: "grant_award_letter, energy_model, 179D, 48E" },
      { label: "Next Best Action", value: "Upload first documents to activate auto-mapping" },
    ],
  },
  "/project-control/packet-status": {
    status: "NOT STARTED",
    statusColor: "var(--warning, #d97706)",
    badges: ["Contractor", "Trade", "Funding", "RWA", "PoF", "ESG", "Code/Permit", "Lender"],
    reviewWarning: "Lender-ready requires: evidence present + accepted by reviewer + professional review complete + no blockers + lender-use authorization on file.",
    items: [
      { label: "Contractor Packet", value: "not_started", note: "Missing: GC insurance, bid, license, scope, W-9" },
      { label: "Trade Packet", value: "not_started", note: "Missing: trade license, scope, bid, W-9" },
      { label: "Funding Packet", value: "not_started", note: "Missing: appraisal, title, survey, bank statement, term sheet" },
      { label: "RWA Packet", value: "not_started", note: "Missing: RWA legal review, XRPL proof, approval log" },
      { label: "PoF Packet", value: "not_started", note: "Missing: PoF letter, bank statement, escrow letter" },
      { label: "Lender Packet", value: "not_started", note: "12 required items — all missing" },
    ],
  },
  "/project-control/accepted-evidence": {
    status: "NO ACCEPTED FILES YET",
    statusColor: "var(--muted, #6b7280)",
    badges: ["Reviewed", "Human Accepted", "Professional Review", "Confidential"],
    reviewWarning: "Only evidence accepted by an authorised human reviewer is shown here. Upload-only status does not appear.",
    items: [
      { label: "Accepted Files", value: "0" },
      { label: "Accepted by Category", value: "contractor: 0 / funding: 0 / RWA: 0 / lender: 0" },
      { label: "Files Improving Packet Completeness", value: "0" },
      { label: "Financial Documents Accepted", value: "0 (confidential — lender only)" },
      { label: "Legal Documents Accepted", value: "0 (attorney reviewed required)" },
      { label: "Next Best Action", value: "Complete first document review cycle" },
    ],
  },
  "/project-control/blocked-evidence": {
    status: "MONITOR",
    statusColor: "var(--error, #ef4444)",
    badges: ["Secrets Detected", "Missing Review", "Active Blockers", "Prohibited"],
    reviewWarning: "Blocked files must be removed or remediated before they can be re-submitted. Secret-containing files are permanently blocked.",
    items: [
      { label: "Blocked Files", value: "0" },
      { label: "Blocked: Secret Detected", value: "0", note: "Private keys, seed phrases, API tokens, passwords" },
      { label: "Blocked: Missing Professional Review", value: "0" },
      { label: "Blocked: Active Compliance Blockers", value: "0" },
      { label: "Blocked: RWA/XRPL Live Transaction", value: "Live transaction route remains blocked by policy" },
      { label: "Next Best Action", value: "Review and resolve any blocked submissions" },
    ],
  },
  "/project-control/review-queue": {
    status: "REVIEW REQUIRED",
    statusColor: "var(--warning, #d97706)",
    badges: ["Pending", "Attorney Review", "CPA Review", "Lender Review", "Authorised Sign-off"],
    reviewWarning: "Items in the review queue are not counted toward lender-ready status until accepted by the designated reviewer.",
    items: [
      { label: "Items Awaiting Review", value: "0" },
      { label: "Attorney Review Pending", value: "0 (legal memos, RWA review, securities opinions)" },
      { label: "CPA Review Pending", value: "0 (tax memos, 179D/48E, grant award letters)" },
      { label: "Lender Review Pending", value: "0 (appraisal, title, equity proof, bank statement)" },
      { label: "Human Approval Log Needed", value: "0" },
      { label: "Next Best Action", value: "Route first documents to reviewers upon intake" },
    ],
  },
  "/project-control/real-lender-packet": {
    status: "NOT LENDER READY",
    statusColor: "var(--error, #ef4444)",
    badges: ["8 Packet Categories", "Accepted Evidence Required", "Professional Review Required", "Authorization Required"],
    reviewWarning: "Real lender packet requires 8 fully accepted, reviewed, and authorized evidence packets. Nothing is auto-approved. Estimated incentives, RWA proof references, and obligations do not count as verified funds.",
    items: [
      { label: "Overall Status", value: "NOT LENDER READY" },
      { label: "Packets Lender-Ready", value: "0 of 8" },
      { label: "Contractor Packet", value: "not_started" },
      { label: "Funding Packet", value: "not_started" },
      { label: "Lender Packet", value: "not_started" },
      { label: "Next Best Action", value: "Start evidence intake: appraisal, GC insurance, title, bank statement, term sheet" },
    ],
  },
};

function EvidencePacketPanel({ path }: { path: string }) {
  const panel = EVIDENCE_PACKET_PANELS[path];
  if (!panel) return null;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <span style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "4px 14px", fontSize: 12, fontWeight: 700, color: panel.statusColor, letterSpacing: 0.5 }}>
          {panel.status}
        </span>
        {panel.badges.map((badge) => (
          <span key={badge} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 10px", fontSize: 11, color: "var(--muted)" }}>
            {badge}
          </span>
        ))}
      </div>
      <div style={{ background: "var(--surface)", border: `1px solid ${panel.statusColor}`, borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: panel.statusColor }}>
        ⚠️ {panel.reviewWarning}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {panel.items.map((item) => (
          <div key={item.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{item.label}</div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{item.value}</div>
            {item.note && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{item.note}</div>}
          </div>
        ))}
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
