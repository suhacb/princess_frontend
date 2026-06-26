// Mock data for the Princess UI kit — PRINCE2 project management.
window.PRINCESS_DATA = {
  user: { name: 'Ana', familyName: 'Novak', email: 'ana.novak@sinecon.eu', initials: 'AN' },

  nav: [
    { label: 'Overview', items: [
      { label: 'Dashboard', icon: 'dashboard', key: 'dashboard' },
      { label: 'PRINCE2 Guide', icon: 'menu_book', key: 'guide' },
    ]},
    { label: 'Project', items: [
      { label: 'Projects', icon: 'folder_open', key: 'projects' },
    ]},
    { label: 'Planning', items: [
      { label: 'Work Breakdown', icon: 'account_tree', key: 'wbs' },
      { label: 'Timeline', icon: 'calendar_view_week', key: 'timeline' },
      { label: 'Tasks', icon: 'check_circle_outline', key: 'tasks' },
    ]},
    { label: 'Logs', items: [
      { label: 'Daily Log', icon: 'edit_note', key: 'daily-log' },
      { label: 'Issue Log', icon: 'bug_report', key: 'issues' },
      { label: 'Risk Log', icon: 'warning_amber', key: 'risks' },
      { label: 'Change Log', icon: 'sync_alt', key: 'changes' },
      { label: 'Quality Register', icon: 'fact_check', key: 'quality' },
      { label: 'Lessons Log', icon: 'school', key: 'lessons' },
    ]},
    { label: 'Reports', items: [
      { label: 'Highlight Reports', icon: 'summarize', key: 'highlight' },
      { label: 'Exception Reports', icon: 'report_problem', key: 'exceptions' },
    ]},
    { label: 'AI', items: [
      { label: 'Suggestions', icon: 'auto_awesome', key: 'ai' },
    ]},
  ],

  projects: [
    { id: 1, name: 'Office Relocation', reference: 'PROJ-001', status: 'delivery', stage: 'Stage 2 — Fit-out', created: '12 Mar 2025', tolerances: 'full' },
    { id: 2, name: 'ERP Migration', reference: 'PROJ-002', status: 'initiation', stage: 'Initiation', created: '03 Apr 2025', tolerances: 'partial' },
    { id: 3, name: 'Customer Portal Rebuild', reference: 'PROJ-003', status: 'delivery', stage: 'Stage 3 — Build', created: '21 Jan 2025', tolerances: 'full' },
    { id: 4, name: 'ISO 27001 Certification', reference: 'PROJ-004', status: 'closing', stage: 'Closing', created: '08 Nov 2024', tolerances: 'partial' },
    { id: 5, name: 'Warehouse Automation', reference: 'PROJ-005', status: 'pre_project', stage: '—', created: '02 Jun 2025', tolerances: 'none' },
    { id: 6, name: 'Brand Refresh 2024', reference: 'PROJ-006', status: 'closed', stage: 'Closed', created: '14 Feb 2024', tolerances: 'full' },
  ],

  risks: [
    { id: 1, score: 20, title: 'Key supplier may miss fit-out deadline', category: 'Schedule', proximity: 'Imminent', response: 'Reduce', status: 'open', owner: 'A. Novak' },
    { id: 2, score: 12, title: 'Asbestos discovered in ceiling void', category: 'Health & Safety', proximity: 'Near', response: 'Transfer', status: 'open', owner: 'M. Horvat' },
    { id: 3, score: 9, title: 'Network cabling spec not finalised', category: 'Technical', proximity: 'Near', response: 'Reduce', status: 'mitigated', owner: 'J. Kovač' },
    { id: 4, score: 6, title: 'Furniture lead time exceeds plan', category: 'Procurement', proximity: 'Distant', response: 'Accept', status: 'open', owner: 'A. Novak' },
    { id: 5, score: 16, title: 'Budget overrun on M&E works', category: 'Cost', proximity: 'Imminent', response: 'Avoid', status: 'materialised', owner: 'T. Zajc' },
    { id: 6, score: 4, title: 'Staff resistance to open-plan layout', category: 'People', proximity: 'Distant', response: 'Reduce', status: 'mitigated', owner: 'S. Petek' },
    { id: 7, score: 3, title: 'Parking permits delayed by council', category: 'External', proximity: 'Distant', response: 'Accept', status: 'closed', owner: 'M. Horvat' },
  ],

  suggestions: [
    { id: 1, icon: 'group_off', title: '2 open risks have no mitigation owner', body: 'Risks R-004 and R-006 are unassigned. Assign the project manager as interim owner so they stay tracked at the next checkpoint.', accept: 'Assign owner', context: 'Risk Log' },
    { id: 2, icon: 'summarize', title: 'Draft this week\u2019s Highlight Report', body: 'Princess can compile progress, the 7 active risks and 3 open issues into a Highlight Report for the Project Board, ready for your review.', accept: 'Generate draft', context: 'Reports' },
    { id: 3, icon: 'trending_up', title: 'Budget tolerance is 82% consumed', body: 'At the current burn rate, the M&E work package will breach its cost tolerance in ~9 days. Consider raising an Exception Report.', accept: 'Raise exception', context: 'Stage 2' },
  ],
};
