/* ════════════════════════════════════════════════════════════
   ASAS DEMO — seed data + fake auth (static, no backend)
   Builds window.__MOCK_DB and seeds an Admin session.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Fake Admin session (JWT payload must stay ASCII for btoa) ──
  function b64u(o) {
    return btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  const exp = Math.floor(Date.now() / 1000) + 3650 * 86400; // ~10 years
  const ROLE = window.__DEMO_ROLE || 'Admin';
  const ROLE_INFO = {
    Admin:          { roleId: 1, first: 'مدير',  last: 'النظام',  email: 'admin@asas.com' },
    BookingManager: { roleId: 2, first: 'ماجد',  last: 'الحارثي', email: 'booking@asas.com' },
    SiteEngineer:   { roleId: 3, first: 'طارق',  last: 'البلوي',  email: 'engineer@asas.com', assignedProjectIds: [1, 2, 3, 4] },
    Buyer:          { roleId: 0, first: 'أحمد',  last: 'الحربي',  email: 'buyer@example.com', buyerId: 1 }
  };
  const ri = ROLE_INFO[ROLE] || ROLE_INFO.Admin;
  const fullName = ri.first + ' ' + ri.last;
  const TOKEN = b64u({ alg: 'none', typ: 'JWT' }) + '.' +
                b64u({ sub: String(ri.buyerId || 1), role: ROLE, name: 'Demo User', exp }) + '.demo';
  const authData = {
    token: TOKEN, role: ROLE, roleId: ri.roleId,
    name: fullName, fullName, firstName: ri.first, lastName: ri.last, email: ri.email
  };
  if (ri.buyerId) { authData.buyerId = ri.buyerId; authData.id = ri.buyerId; }
  if (ri.assignedProjectIds) authData.assignedProjectIds = ri.assignedProjectIds;
  localStorage.setItem('authData', JSON.stringify(authData));
  localStorage.setItem('token', TOKEN);
  window.__DEMO_TOKEN = TOKEN;
  window.__DEMO_BUYER_ID = ri.buyerId || null;

  // ── Helpers ──
  const now = Date.now(), DAY = 86400000;
  const ago = d => new Date(now - d * DAY).toISOString();
  const ahead = d => new Date(now + d * DAY).toISOString();
  const pick = (a, i) => a[((i % a.length) + a.length) % a.length];
  const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const projectsMeta = [
    { name: 'برج الياسمين', code: 'YSM', loc: 'حي الزهراء، جدة' },
    { name: 'مجمع الواحة السكني', code: 'WAH', loc: 'حي النعيم، جدة' },
    { name: 'أبراج اللؤلؤة', code: 'LUL', loc: 'الكورنيش، جدة' },
    { name: 'فلل النخيل', code: 'NKL', loc: 'حي الشاطئ، جدة' }
  ];
  const firstNames = ['محمد', 'أحمد', 'خالد', 'سارة', 'فاطمة', 'عبدالله', 'نورة', 'يوسف', 'ريم', 'عمر', 'هند', 'سلطان', 'لمى', 'فيصل'];
  const lastNames = ['الغامدي', 'العتيبي', 'القحطاني', 'الحربي', 'الشهري', 'الزهراني', 'الدوسري', 'المالكي'];
  const jobs = ['مهندس', 'طبيب', 'معلم', 'رجل أعمال', 'محاسب', 'موظف حكومي'];
  const unitTypes = ['شقة', 'دوبلكس', 'بنتهاوس', 'استوديو'];
  const catNames = ['سباكة', 'كهرباء', 'تكييف', 'دهانات', 'أرضيات', 'أبواب ونوافذ'];
  const statusAr = { 1: 'متاحة', 2: 'محجوزة', 3: 'مباعة', 4: 'مغلقة' };

  const DB = {
    projects: [], buildings: [], floors: [], units: [], buyers: [],
    bookings: [], tickets: [], sellRequests: [], users: [],
    categories: [], logs: [], stages: [], notifications: []
  };

  // ── Buyers ──
  for (let i = 1; i <= 14; i++) {
    const fn = pick(firstNames, i), ln = pick(lastNames, i + 2);
    DB.buyers.push({
      id: i, firstName: fn, lastName: ln, fullName: fn + ' ' + ln,
      nationalId: '10' + rnd(10000000, 99999999), phoneNumber: '05' + rnd(10000000, 99999999),
      email: 'buyer' + i + '@example.com', jobTitle: pick(jobs, i),
      maritalStatus: i % 2 ? 'متزوج' : 'أعزب', familyMembersCount: rnd(1, 6),
      isActive: true, createdAt: ago(rnd(20, 300))
    });
  }

  // ── Users (staff) ──
  const roles = { 1: 'مدير النظام', 2: 'مدير الحجوزات', 3: 'مهندس الموقع' };
  [['أدمن', 'النظام', 1], ['ماجد', 'الحارثي', 2], ['ليان', 'السبيعي', 2], ['طارق', 'البلوي', 3], ['ندى', 'الرشيد', 3]]
    .forEach((u, idx) => DB.users.push({
      id: idx + 1, firstName: u[0], lastName: u[1], fullName: u[0] + ' ' + u[1],
      email: 'user' + (idx + 1) + '@asas.com', roleId: u[2], roleName: roles[u[2]],
      isActive: idx !== 4, createdAt: ago(rnd(50, 400))
    }));

  // ── Maintenance categories (page renders nameAr + warrantyScope) ──
  const catScopes = ['Plumbing', 'Electrical', 'None', 'Structural', 'Structural', 'None'];
  const catDescs = ['أعمال السباكة والصرف الصحي', 'الأعمال الكهربائية والإنارة', 'صيانة التكييف والتبريد', 'الدهانات والتشطيبات الداخلية', 'الأرضيات والبلاط', 'الأبواب والنوافذ والزجاج'];
  catNames.forEach((c, idx) => DB.categories.push({
    id: idx + 1, name: c, categoryName: c, nameAr: c,
    warrantyScope: catScopes[idx % catScopes.length], description: catDescs[idx % catDescs.length],
    isActive: idx !== 5, ticketsCount: 0, createdAt: ago(rnd(100, 400))
  }));

  // ── Projects → Buildings → Stages → Floors → Units ──
  let bId = 0, flId = 0, uId = 0, stId = 0;
  projectsMeta.forEach((pm, pi) => {
    const pid = pi + 1;
    DB.projects.push({
      id: pid, name: pm.name, projectName: pm.name, projectCode: pm.code,
      status: 'UnderConstruction', projectStatus: 'قيد الإنشاء', isActive: true, location: pm.loc,
      description: 'مشروع سكني متكامل بموقع مميز ومرافق حديثة.',
      createdAt: ago(rnd(120, 400)), expectedDeliveryDate: ahead(rnd(120, 600)),
      readyDate: ahead(rnd(120, 600)), projectReadyDate: ahead(rnd(120, 600))
    });
    // Construction stages (tracked per project — canonical keys the UI expects)
    const STAGE_KEYS = ['SitePreparation', 'Foundation', 'Structure', 'MasonryAndWalls', 'InitialFinishing', 'FinalFinishing', 'Handover'];
    const doneCount = rnd(2, 6);
    STAGE_KEYS.forEach((key, si) => {
      stId++;
      const done = si < doneCount;
      DB.stages.push({
        id: stId, projectId: pid, stageName: key, order: si + 1,
        isCompleted: done, status: done ? 'Completed' : 'Pending',
        startDate: done ? ago(220 - si * 25) : null, endDate: done ? ago(200 - si * 25) : null,
        images: done ? [
          { id: stId * 10 + 1, imageUrl: `https://picsum.photos/seed/asas${stId}a/640/420` },
          { id: stId * 10 + 2, imageUrl: `https://picsum.photos/seed/asas${stId}b/640/420` }
        ] : []
      });
    });
    const nB = rnd(2, 3);
    for (let b = 1; b <= nB; b++) {
      bId++;
      const bname = pm.name + ' - مبنى ' + b, bcode = pm.code + '-B' + b;
      DB.buildings.push({
        id: bId, projectId: pid, projectName: pm.name, buildingName: bname, buildingCode: bcode,
        createdAt: ago(rnd(100, 300)), expectedDeliveryDate: ahead(rnd(120, 500))
      });
      const nF = rnd(4, 6);
      for (let f = 1; f <= nF; f++) {
        flId++;
        const fid = flId;
        DB.floors.push({ id: fid, buildingId: bId, buildingName: bname, projectId: pid, floorNumber: f });
        for (let u = 1; u <= 4; u++) {
          uId++;
          const r = Math.random();
          const status = r < 0.40 ? 1 : r < 0.65 ? 2 : r < 0.95 ? 3 : 4;
          const area = rnd(90, 260), price = rnd(450, 1600) * 1000;
          const unitNo = `${f}0${u}`;
          DB.units.push({
            id: uId, floorId: fid, floorNumber: f, buildingId: bId, buildingName: bname,
            projectId: pid, projectName: pm.name, unitNumber: unitNo, unitCode: `${bcode}-${unitNo}`,
            status, realStatus: statusAr[status], price, unitArea: area,
            unitType: pick(unitTypes, uId), bedrooms: rnd(1, 5),
            createdAt: ago(rnd(10, 250)), expectedDeliveryDate: ahead(rnd(60, 500)), buyerId: null
          });
        }
      }
    }
  });

  // ── Bookings for reserved/sold units ──
  let bkId = 0;
  DB.units.filter(u => u.status === 2 || u.status === 3).forEach((u, idx) => {
    const by = DB.buyers[idx % DB.buyers.length];
    u.buyerId = by.id;
    bkId++;
    DB.bookings.push({
      id: bkId, unitId: u.id, buyerId: by.id, buyerName: by.fullName, phoneNumber: by.phoneNumber,
      unitNumber: u.unitNumber, unitArea: u.unitArea, floorNumber: u.floorNumber,
      buildingName: u.buildingName, projectName: u.projectName, projectId: u.projectId,
      price: u.price, totalPrice: u.price, bookingDate: ago(rnd(5, 200)),
      createdAt: ago(rnd(5, 200)), updatedAt: ago(rnd(0, 4)),
      status: u.status === 3 ? 'مباع' : 'محجوز', realStatus: u.status === 3 ? 'مباع' : 'محجوز',
      expectedDeliveryDate: u.expectedDeliveryDate
    });
  });

  // ── Maintenance tickets (prioritise the demo buyer #1 so the Buyer panel isn't empty) ──
  const tStatus = ['Open', 'InProgress', 'Resolved', 'Closed'];
  const STATUS_AR = { Open: 'مفتوحة', InProgress: 'قيد المعالجة', Resolved: 'تم الحل', Closed: 'مغلقة', Reopened: 'أُعيد فتحها' };
  const STATUS_CHAIN = {
    Open: ['Open'], InProgress: ['Open', 'InProgress'],
    Resolved: ['Open', 'InProgress', 'Resolved'], Closed: ['Open', 'InProgress', 'Resolved', 'Closed']
  };
  function buildHistory(status, createdDays, buyerName) {
    const chain = STATUS_CHAIN[status] || ['Open'];
    return chain.map((s, i) => ({
      fromStatusAr: i > 0 ? STATUS_AR[chain[i - 1]] : null,
      toStatus: s, statusAr: STATUS_AR[s],
      changedByName: i === 0 ? buyerName : 'مدير النظام',
      changedAt: ago(Math.max(0, createdDays - i * 3)),
      note: i === 0 ? 'تم فتح التذكرة من المشتري' : (s === 'Resolved' ? 'تمت معالجة البلاغ' : null)
    }));
  }
  const ticketUnits = [
    ...DB.units.filter(u => u.buyerId === 1).slice(0, 3),
    ...DB.units.filter(u => u.buyerId && u.buyerId !== 1).slice(0, 5)
  ];
  ticketUnits.forEach((u, idx) => {
    const by = DB.buyers.find(b => b.id === u.buyerId) || DB.buyers[idx];
    const status = pick(tStatus, idx);
    const createdDays = rnd(5, 60);
    DB.tickets.push({
      id: idx + 1, ticketNumber: 'TK-' + (1000 + idx), unitId: u.id, buyerId: u.buyerId,
      unitNumber: u.unitNumber, floorNumber: u.floorNumber, buildingName: u.buildingName,
      projectName: u.projectName, buyerFullName: by.fullName, buyerPhone: by.phoneNumber,
      categoryName: pick(catNames, idx), status, isActive: true,
      description: 'بلاغ صيانة في الوحدة بحاجة للمتابعة.',
      createdAt: ago(createdDays), updatedAt: ago(rnd(0, 3)),
      history: buildHistory(status, createdDays, by.fullName)
    });
  });
  // category ticket counts
  DB.categories.forEach(c => { c.ticketsCount = DB.tickets.filter(t => t.categoryName === c.name).length; });

  // ── Sell requests ──
  DB.units.filter(u => u.status === 3).slice(2, 7).forEach((u, idx) => {
    const by = DB.buyers.find(b => b.id === u.buyerId) || DB.buyers[idx];
    DB.sellRequests.push({
      id: idx + 1, projectName: u.projectName, buildingName: u.buildingName, floorNumber: u.floorNumber,
      unitNumber: u.unitNumber, unitType: u.unitType, unitArea: u.unitArea, unitPrice: u.price,
      expectedPrice: Math.round(u.price * 1.15), buyerName: by.fullName, buyerPhone: by.phoneNumber,
      buyerEmail: by.email, bookingDate: ago(rnd(30, 200)), createdAt: ago(rnd(1, 40)),
      status: 'قيد المراجعة', isRead: idx % 2 === 0
    });
  });

  // ── Activity logs ──
  const acts = ['أضاف مشروعاً جديداً', 'عدّل بيانات وحدة', 'أنشأ حجزاً', 'حدّث حالة تذكرة', 'أضاف مشترياً', 'سجّل الدخول'];
  for (let i = 1; i <= 12; i++) DB.logs.push({
    id: i, action: pick(acts, i), userName: pick(DB.users, i).fullName,
    entityType: 'System', createdAt: ago(rnd(0, 30)), details: 'تمت العملية بنجاح.'
  });

  // ── Buyer portal: enriched units for the demo buyer (#1) with warranties ──
  const WARRANTY_SCOPES = [
    { scope: 'Structural', totalYears: 10 },
    { scope: 'Elevator', totalYears: 3 },
    { scope: 'Plumbing', totalYears: 3 },
    { scope: 'Electrical', totalYears: 3 }
  ];
  function buildWarranties(startISO) {
    const start = new Date(startISO).getTime();
    return WARRANTY_SCOPES.map(s => {
      const end = start + s.totalYears * 365 * DAY;
      const elapsed = Math.min(100, Math.max(0, Math.round((now - start) / (end - start) * 100)));
      const isActive = now < end;
      return {
        scope: s.scope, scopeAr: s.scope, totalYears: s.totalYears,
        startDate: new Date(start).toISOString(), endDate: new Date(end).toISOString(),
        isActive, daysRemaining: Math.max(0, Math.round((end - now) / DAY)),
        daysExpired: isActive ? 0 : Math.round((now - end) / DAY), elapsedPercent: elapsed
      };
    });
  }
  DB.myUnits = DB.units.filter(u => u.buyerId === 1).map((u, i) => {
    const ready = i < 3;              // first 3 → delivered, warranty active
    const reserved = !ready && i < 5; // next 2 → reserved
    const warrantyStartDate = ready ? ago(rnd(150, 900)) : null;
    return {
      unitId: u.id, unitNumber: u.unitNumber, buildingId: u.buildingId, buildingName: u.buildingName,
      projectId: u.projectId, projectName: u.projectName, floorNumber: u.floorNumber,
      unitArea: u.unitArea, unitType: u.unitType, price: u.price,
      isReserved: reserved, warrantyStarted: ready,
      saleDate: ago(rnd(120, 500)), warrantyStartDate,
      warranties: ready ? buildWarranties(warrantyStartDate) : []
    };
  });

  // ── Sample warranty documents (returned for any building) ──
  DB.warrantyDocs = [
    { id: 1, fileName: 'شهادة ضمان الهيكل الإنشائي.pdf', fileUrl: 'https://www.africau.edu/images/default/sample.pdf', fileSizeBytes: 482000 },
    { id: 2, fileName: 'ضمان الأعمال الكهربائية.pdf', fileUrl: 'https://www.africau.edu/images/default/sample.pdf', fileSizeBytes: 311000 },
    { id: 3, fileName: 'ضمان السباكة والصرف.pdf', fileUrl: 'https://www.africau.edu/images/default/sample.pdf', fileSizeBytes: 268000 }
  ];

  window.__MOCK_DB = DB;
})();
