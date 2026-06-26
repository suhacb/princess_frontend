// Cockpit hi-fi prototype — rich PRINCE2 mock data.
// One active project in deep context, plus a portfolio to switch among.
window.COCKPIT = {
  user: { name: 'Ana Novak', initials: 'AN', email: 'ana.novak@sinecon.eu' },

  roles: {
    pm:  { key: 'pm',  label: 'Project Manager', short: 'PM',  focus: 'Day-to-day delivery, logs & reports' },
    pmo: { key: 'pmo', label: 'Project Support / PMO', short: 'PMO', focus: 'Assurance, governance & gate control' },
    tm:  { key: 'tm',  label: 'Team Manager', short: 'TM',  focus: 'My work package only' },
  },

  // ── Portfolio (the only cross-project view) ───────────────────────────────
  portfolio: [
    { id: 'p1', name: 'Harbour Bridge Renewal', reference: 'PRJ-014', exec: 'A. Mensah', status: 'delivery', stage: 'Delivery · Stage 3', risks: 8, openRisks: 8, health: 'ok',   tol: 'Within', updated: '2h ago', active: true },
    { id: 'p2', name: 'Civic Data Platform',    reference: 'PRJ-021', exec: 'R. Okafor', status: 'initiation', stage: 'Initiation',        risks: 14, openRisks: 11, health: 'warn', tol: 'Near limit', updated: '1d ago' },
    { id: 'p3', name: 'Ringroad Phase 2',       reference: 'PRJ-009', exec: 'A. Mensah', status: 'delivery', stage: 'Delivery · Stage 2', risks: 11, openRisks: 9, health: 'danger', tol: 'Exception', updated: '4h ago' },
    { id: 'p4', name: 'Coastal Defence Upgrade',reference: 'PRJ-007', exec: 'L. Bianchi', status: 'closing',  stage: 'Closing',           risks: 3,  openRisks: 1, health: 'ok',   tol: 'Within', updated: '3d ago' },
    { id: 'p5', name: 'Depot Electrification',  reference: 'PRJ-025', exec: 'R. Okafor', status: 'pre_project', stage: 'Pre-project',     risks: 0,  openRisks: 0, health: 'ok',   tol: '—', updated: '6d ago' },
  ],

  // ── Active project deep context ───────────────────────────────────────────
  project: {
    id: 'p1', name: 'Harbour Bridge Renewal', reference: 'PRJ-014',
    exec: 'A. Mensah', pm: 'A. Novak', status: 'delivery',
    stage: 'Delivery · Stage 3', stageIndex: 2,
    stages: ['Pre-Project', 'Initiation', 'Delivery', 'Closing', 'Closed'],
    tolerances: [
      { dim: 'Time',    range: '-5 / +10 days',  used: '+8 days',    pct: 80, state: 'warn' },
      { dim: 'Cost',    range: '± 50 000 €',      used: '+18 000 €',  pct: 36, state: 'ok' },
      { dim: 'Scope',   range: 'No change to core deliverables', used: 'Stable', pct: 12, state: 'ok' },
      { dim: 'Quality', range: 'Meets EN 1090',   used: 'On spec',    pct: 20, state: 'ok' },
    ],
    workPackages: [
      { name: 'Deck resurfacing',     tm: 'J. Park',  status: 'warn', note: '-2 days', pct: 62 },
      { name: 'Cabling pull-through', tm: 'S. Idris', status: 'ok',   note: 'On track', pct: 38 },
      { name: 'Inspection sign-off',  tm: '—',        status: 'todo', note: 'To plan', pct: 0 },
    ],
  },

  // ── Logs (this project) ───────────────────────────────────────────────────
  risks: [
    { id: 'r1', ref: 'R-016', score: 16, title: 'Tender delay on steelwork', category: 'Procurement', proximity: 'This stage', response: 'Reduce', status: 'open', owner: 'A. Novak', docs: 2, links: [{ t: 'issue', ref: 'I-042' }, { t: 'change', ref: 'C-009' }, { t: 'stage', ref: 'Stage 3' }] },
    { id: 'r2', ref: 'R-011', score: 9,  title: 'Permit dependency slip', category: 'External', proximity: 'Next stage', response: 'Reduce', status: 'open', owner: null, docs: 1, links: [{ t: 'stage', ref: 'Stage 3' }] },
    { id: 'r3', ref: 'R-008', score: 12, title: 'Marine weather window narrows', category: 'Schedule', proximity: 'This stage', response: 'Transfer', status: 'open', owner: 'S. Idris', docs: 0, links: [{ t: 'issue', ref: 'I-039' }] },
    { id: 'r4', ref: 'R-004', score: 4,  title: 'Public access detour complaints', category: 'Stakeholder', proximity: 'Distant', response: 'Accept', status: 'mitigated', owner: 'J. Park', docs: 3, links: [] },
    { id: 'r5', ref: 'R-002', score: 6,  title: 'Specialist coating lead time', category: 'Procurement', proximity: 'Next stage', response: 'Reduce', status: 'open', owner: 'A. Novak', docs: 1, links: [{ t: 'change', ref: 'C-006' }] },
    { id: 'r6', ref: 'R-001', score: 20, title: 'Load-bearing survey inconclusive', category: 'Technical', proximity: 'Imminent', response: 'Avoid', status: 'materialised', owner: 'T. Zajc', docs: 4, links: [{ t: 'issue', ref: 'I-031' }, { t: 'change', ref: 'C-003' }] },
  ],

  documents: [
    { name: 'Steel tender — RFQ.pdf', kind: 'pdf', added: '12 Mar 2026', on: 'R-016' },
    { name: 'Supplier risk memo.docx', kind: 'doc', added: '04 Apr 2026', on: 'R-016' },
    { name: 'Stage 3 plan — baseline.xlsx', kind: 'xls', added: '02 Feb 2026', on: 'Stage 3' },
    { name: 'Load survey report.pdf', kind: 'pdf', added: '18 Jan 2026', on: 'R-001' },
  ],

  // ── Role-tuned home content ───────────────────────────────────────────────
  home: {
    pm: {
      kpis: [
        { label: 'Stage tolerance', value: '+8d', sub: '8 of +10 days used', tone: 'warn' },
        { label: 'Open risks', value: '8', sub: '1 critical · 1 unowned', tone: 'danger' },
        { label: 'My actions', value: '5', sub: 'due this week', tone: 'ok' },
        { label: 'Reports due', value: '1', sub: 'highlight · Fri', tone: 'neutral' },
      ],
    },
    pmo: {
      kpis: [
        { label: 'Governance health', value: '92', sub: 'controls in place', tone: 'ok' },
        { label: 'Overdue reports', value: '2', sub: 'highlight reports late', tone: 'warn' },
        { label: 'Stage gates', value: '1', sub: 'approval pending', tone: 'neutral' },
        { label: 'Assurance flags', value: '3', sub: 'this stage', tone: 'warn' },
      ],
      checklist: [
        { ok: true, label: 'PID baselined' },
        { ok: true, label: 'Risk budget set' },
        { ok: false, label: 'Lessons not logged' },
        { ok: true, label: 'Stage 3 plan approved' },
      ],
    },
    tm: {
      wp: { name: 'Deck resurfacing', due: '12 Jul 2026', tol: '-2 days tolerance' },
      checklist: [
        { ok: true,  label: 'Method statement approved' },
        { ok: true,  label: 'Surface prep complete' },
        { ok: false, label: 'First coat inspection' },
        { ok: false, label: 'Final sign-off' },
      ],
    },
  },
};
