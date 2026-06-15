/* ════════════════════════════════════════════════════════════
   ASAS DEMO — fetch interceptor (no backend)
   Routes every /api/* call to the in-memory window.__MOCK_DB.
   Mutations persist in memory until page reload.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const RESOURCE_MAP = {
    projects: 'projects', buildings: 'buildings', floors: 'floors', units: 'units',
    buyers: 'buyers', bookings: 'bookings', maintenancetickets: 'tickets',
    maintenancecategories: 'categories', sellrequests: 'sellRequests', users: 'users',
    activitylogs: 'logs', constructionstages: 'stages', notifications: 'notifications'
  };

  const DB = () => window.__MOCK_DB || {};
  const jsonRes = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
  const okRes = (data) => jsonRes(data || { success: true });
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const safeParse = b => { try { return typeof b === 'string' ? JSON.parse(b) : null; } catch { return null; } };
  const nextId = coll => (DB()[coll] || []).reduce((m, x) => Math.max(m, x.id || 0), 0) + 1;

  function makeToken(role) {
    const b64u = o => btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const exp = Math.floor(Date.now() / 1000) + 3650 * 86400;
    return b64u({ alg: 'none', typ: 'JWT' }) + '.' + b64u({ sub: '1', role, exp }) + '.demo';
  }
  // Demo staff accounts → role
  const STAFF = {
    'admin@asas.com':    { role: 'Admin',          firstName: 'مدير',  lastName: 'النظام',  assignedProjectIds: null },
    'booking@asas.com':  { role: 'BookingManager', firstName: 'ماجد',  lastName: 'الحارثي', assignedProjectIds: null },
    'engineer@asas.com': { role: 'SiteEngineer',   firstName: 'طارق',  lastName: 'البلوي',  assignedProjectIds: [1, 2, 3, 4] }
  };

  function route(method, seg, body) {
    const res = (seg[0] || '').toLowerCase();

    // ── Auth ──
    if (res === 'auth') {
      const sub = (seg[1] || '').toLowerCase();
      if (sub === 'refresh') return jsonRes({ token: window.__DEMO_TOKEN || makeToken('Admin') });
      const kind = (seg[2] || '').toLowerCase(); // login/staff | login/buyer
      if (kind === 'buyer') {
        return jsonRes({ token: makeToken('Buyer'), id: 1, role: 'Buyer', firstName: 'أحمد', lastName: 'الحربي', email: 'buyer@example.com' });
      }
      const email = ((body && body.email) || '').toLowerCase();
      const u = STAFF[email] || STAFF['admin@asas.com'];
      return jsonRes({ token: makeToken(u.role), id: 1, role: u.role, email, firstName: u.firstName, lastName: u.lastName, assignedProjectIds: u.assignedProjectIds });
    }

    // ── Branding: persist the chosen theme/name in localStorage so it survives
    //    the setup → login → dashboard page navigations (mock DB rebuilds per page). ──
    if (res === 'brand') {
      const sub = (seg[1] || '').toLowerCase();
      if (sub === 'logo') return jsonRes(method === 'POST' ? { logoUrl: null } : {}, method === 'POST' ? 200 : 404);
      if (method === 'POST' || method === 'PUT') {
        const saved = Object.assign({ configured: true }, body || {});
        try { localStorage.setItem('__demo_brand', JSON.stringify(saved)); } catch (e) {}
        return jsonRes(saved);
      }
      let saved = null;
      try { saved = JSON.parse(localStorage.getItem('__demo_brand') || 'null'); } catch (e) {}
      if (saved && saved.companyName) {
        return jsonRes(Object.assign({ configured: true, name: saved.companyName }, saved));
      }
      return jsonRes({
        configured: true, companyName: 'أساس', name: 'أساس',
        themeName: 'midnight', logoUrl: null,
        primaryColor: '#0D2142', accent: '#4e8df5'
      });
    }

    // ── Notifications ──
    if (res === 'notifications') {
      const sub = (seg[1] || '').toLowerCase();
      const list = DB().notifications || [];
      if (sub === 'unread-count') return jsonRes({ count: list.filter(n => !n.isRead).length });
      if (sub === 'read-all') { list.forEach(n => n.isRead = true); return okRes(); }
      if (/^\d+$/.test(seg[1] || '') && (seg[2] || '').toLowerCase() === 'read') {
        const n = list.find(x => x.id === +seg[1]); if (n) n.isRead = true;
        return okRes();
      }
      if (method === 'POST' || method === 'PUT') return okRes();
      const sorted = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return jsonRes({ items: sorted, total: sorted.length });
    }

    // ── Endpoints with no demo data → safe empties ──
    if (res === 'webhooks') return jsonRes(seg[1] ? { success: true } : []);
    if (res === 'warrantydocuments') {
      if (method === 'GET' && (seg[1] || '').toLowerCase() === 'building') return jsonRes(DB().warrantyDocs || []);
      return jsonRes(method === 'GET' ? [] : { success: true });
    }
    if (res === 'buyerdocuments' || res === 'stageimages')
      return jsonRes(method === 'GET' ? (DB()[RESOURCE_MAP[res]] || []) : { success: true });
    // NOTE: 'floors' intentionally falls through to the generic CRUD handler below,
    // so POST /api/Floors returns the created floor WITH its id (needed by the
    // project-creation wizard to then create units on that floor).

    const bid = window.__DEMO_BUYER_ID;

    // ── Buyer portal (enriched units with warranties) ──
    if (res === 'buyer-portal') {
      if ((seg[1] || '').toLowerCase() === 'my-units')
        return jsonRes(DB().myUnits || []);
      return jsonRes([]);
    }

    // ── ConstructionStages/project/{id} ──
    if (res === 'constructionstages' && (seg[1] || '').toLowerCase() === 'project') {
      const pid = +seg[2];
      return jsonRes((DB().stages || []).filter(s => Number(s.projectId) === pid));
    }
    // ── Projects/my (buyer → their projects; staff/engineer → all) ──
    if (res === 'projects' && (seg[1] || '').toLowerCase() === 'my') {
      if (bid) {
        const pids = new Set((DB().units || []).filter(u => u.buyerId === bid).map(u => u.projectId));
        return jsonRes((DB().projects || []).filter(p => pids.has(p.id)));
      }
      return jsonRes(DB().projects || []);
    }
    // ── Tickets: buyer sees only their own ──
    if (res === 'maintenancetickets' && method === 'GET' && !seg[1] && bid)
      return jsonRes((DB().tickets || []).filter(t => t.buyerId === bid));

    // ── Ticket status change / reopen → update status + append to history ──
    if (res === 'maintenancetickets' && /^\d+$/.test(seg[1] || '') && seg[2]) {
      const action = seg[2].toLowerCase();
      const t = (DB().tickets || []).find(x => x.id === +seg[1]);
      if (t && (action === 'status' || action === 'reopen')) {
        const AR = { Open: 'مفتوحة', InProgress: 'قيد المعالجة', Resolved: 'تم الحل', Closed: 'مغلقة', Reopened: 'أُعيد فتحها' };
        const newStatus = action === 'reopen' ? 'Reopened' : (body && body.status);
        if (newStatus) {
          t.history = t.history || [];
          t.history.push({
            fromStatusAr: AR[t.status] || t.status, toStatus: newStatus, statusAr: AR[newStatus],
            changedByName: 'مدير النظام', changedAt: new Date().toISOString(), note: (body && body.note) || null
          });
          t.status = newStatus;
          t.updatedAt = new Date().toISOString();
        }
        return jsonRes(t);
      }
    }

    const coll = RESOURCE_MAP[res];
    if (!coll) return jsonRes([]); // unknown resource → empty, never breaks the UI

    const list = DB()[coll] || (DB()[coll] = []);
    const id = seg[1] && /^\d+$/.test(seg[1]) ? +seg[1] : null;
    const hasAction = seg.length > 1 && id == null; // e.g. /Units/{id}/reservation handled below

    if (method === 'GET') {
      if (id != null) {
        const item = list.find(x => x.id === id);
        return item ? jsonRes(item) : jsonRes({ message: 'غير موجود' }, 404);
      }
      return jsonRes(list);
    }

    if (method === 'POST') {
      if (id != null || hasAction) return okRes();         // sub-action (status, reset-password…)
      const item = Object.assign({ id: nextId(coll), createdAt: new Date().toISOString() }, body || {});
      list.push(item);
      return jsonRes(item, 201);
    }

    if (method === 'PUT' || method === 'PATCH') {
      if (id != null) {
        const item = list.find(x => x.id === id);
        if (item) Object.assign(item, body || {}, { updatedAt: new Date().toISOString() });
        return item ? jsonRes(item) : okRes();
      }
      return okRes();
    }

    if (method === 'DELETE') {
      if (id != null) {
        const i = list.findIndex(x => x.id === id);
        if (i > -1) list.splice(i, 1);
      }
      return okRes();
    }

    return jsonRes([]);
  }

  const origFetch = window.fetch ? window.fetch.bind(window) : null;

  window.fetch = async function (input, init = {}) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    let path;
    try { path = new URL(url, location.origin).pathname; } catch { path = String(url); }

    if (!/\/api\//i.test(path)) return origFetch ? origFetch(input, init) : Promise.reject(new Error('no fetch'));

    const method = ((init && init.method) || 'GET').toUpperCase();
    const ep = path.replace(/^.*?\/api\//i, '');
    const seg = ep.split('/').filter(Boolean);
    const body = init && init.body ? safeParse(init.body) : null;

    await delay(140 + Math.random() * 160); // simulate network latency
    try { return route(method, seg, body); }
    catch (e) { return jsonRes({ message: 'mock error', error: String(e) }, 500); }
  };

  console.info('%c[ASAS DEMO]', 'color:#4e8df5;font-weight:bold', 'Static demo mode — all data is mock, no backend.');
})();
