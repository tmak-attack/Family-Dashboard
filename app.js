// ============================================
// Family Dashboard - OneDrive Live Sync + Google Keep Shopping Import
// ============================================

const ONE_DRIVE_XLSX_URL = 'https://1drv.ms/x/c/7f530bd3956ba74f/EeP8ny6VbKZHgXHTt84aO80BLfdu9KSsN0rVysALhad-Vg?e=fw7MKR';
let GOOGLE_KEEP_JSON_URL = '';

function toDirectDownload(url) {
  try {
    const u = new URL(url);
    if (u.hostname.endsWith('1drv.ms')) {
      if (!u.searchParams.has('download')) u.searchParams.set('download', '1');
      return u.toString();
    }
    return url;
  } catch { return url; }
}

async function ensureXlsxLoaded() {
  if (window.XLSX) return;
  await new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
  });
}

async function fetchLiveDataFromExcel() {
  await ensureXlsxLoaded();
  const res = await fetch(toDirectDownload(ONE_DRIVE_XLSX_URL), { mode: 'cors' });
  if (!res.ok) throw new Error('Failed to fetch Excel');
  const wb = XLSX.read(await res.arrayBuffer(), { type: 'array' });
  const sheets = wb.SheetNames; const getSheet = (n) => wb.Sheets[n] || wb.Sheets[sheets[0]];
  const familyRows = XLSX.utils.sheet_to_json(wb.Sheets['Family'] || getSheet('Family'), { defval: '' });
  const healthRows = XLSX.utils.sheet_to_json(wb.Sheets['HealthCritical'] || wb.Sheets['Health'] || getSheet('HealthCritical'), { defval: '' });
  const choresRows = XLSX.utils.sheet_to_json(wb.Sheets['TodaysChores'] || wb.Sheets['Chores'] || getSheet('TodaysChores'), { defval: '' });

  const familyMembers = familyRows.map((r, i) => ({
    id: i+1,
    name: String(r.name || r.Name || '').trim(),
    avatar: String(r.avatar || r.Avatar || '👤'),
    completionRate: Number(r.completionRate || r.CompletionRate || r['Completion %'] || 0),
    points: Number(r.points || r.Points || 0),
    allowanceDue: Number(r.allowanceDue || r.Allowance || 0),
    status: String(r.status || r.Status || 'On Track'),
    totalTasks: Number(r.totalTasks || r['Total Tasks'] || 0),
    completedTasks: Number(r.completedTasks || r['Completed Tasks'] || 0),
  }));

  const byCategory = {};
  for (const r of healthRows) {
    const category = String(r.category || r.Category || 'General');
    const priority = String(r.priority || r.Priority || 'high').toLowerCase();
    const item = { task: String(r.task || r.Task || ''), assignedTo: String(r.assignedTo || r['Assigned To'] || ''), dueDate: String(r.dueDate || r.Due || r.DueDate || ''), status: String(r.status || r.Status || 'pending').toLowerCase() };
    const key = category + '|' + priority; if (!byCategory[key]) byCategory[key] = { category, priority, tasks: [] }; byCategory[key].tasks.push(item);
  }
  const healthCriticalTasks = Object.values(byCategory);

  const todaysChores = choresRows.map((r, i) => ({ id: i+1, title: String(r.title || r.Task || r.Title || ''), assignedTo: String(r.assignedTo || r.Who || r['Assigned To'] || ''), points: Number(r.points || r.Points || 0), status: String(r.status || r.Status || 'pending').toLowerCase() }));

  return { familyMembers, healthCriticalTasks, todaysChores };
}

let shoppingLists = [];
function parseKeepJson(json) {
  const lists = [];
  if (Array.isArray(json)) {
    for (const l of json) {
      const title = String(l.title || l.name || 'Shopping');
      const items = (l.items || l.listItems || []).map(it => ({ text: String(it.text || it.title || ''), checked: !!(it.checked || it.isChecked), label: String(it.label || it.category || ''), isNew: !!it.isNew, urgent: !!it.urgent }));
      lists.push({ title, items });
    }
  }
  return lists;
}
async function importKeepFromUrl(url) { const r = await fetch(url, { mode: 'cors' }); if (!r.ok) throw new Error('Failed to fetch Keep JSON'); shoppingLists = parseKeepJson(await r.json()); }

function renderShoppingLists() {
  const c = document.getElementById('shoppingContent'); if (!c) return;
  if (!shoppingLists.length) { c.innerHTML = '<div class="shopping-empty">No shopping lists imported yet.</div>'; return; }
  c.innerHTML = shoppingLists.map(list => {
    const items = (list.items||[]).map(it => `
      <div class="shopping-item ${it.checked?'done':''} ${it.urgent?'urgent':''}">
        <span class="chk">${it.checked?'☑':'☐'}</span>
        <span class="txt">${it.text}</span>
        ${it.label?`<span class="label">${it.label}</span>`:''}
      </div>`).join('');
    return `
      <div class="shopping-list">
        <div class="shopping-title">🛒 ${list.title}</div>
        <div class="shopping-items">${items}</div>
      </div>`;
  }).join('');
}

function shoppingAlerts() {
  try {
    const urgentCount = shoppingLists.flatMap(l=>l.items||[]).filter(i=>i.urgent && !i.checked).length;
    const newCount = shoppingLists.flatMap(l=>l.items||[]).filter(i=>i.isNew && !i.checked).length;
    if (urgentCount>0) alert(`Shopping: ${urgentCount} urgent item(s) need attention.`);
    if (newCount>0) alert(`Shopping: ${newCount} new item(s) added.`);
  } catch(e){ console.warn('Shopping alerts failed', e); }
}

let liveChoreData = { familyMembers: [], healthCriticalTasks: [], todaysChores: [] };

function populateHealthCriticalTasks(){ const el=document.getElementById('healthCriticalContent'); if(!el) return; let h='';
  liveChoreData.healthCriticalTasks.forEach(s=>{ const pc=s.priority==='critical'?'priority-critical':'priority-high'; const pi=s.priority==='critical'?'🚨':'⚠️'; h+=`
    <div class="health-section ${pc}">
      <h3 class="section-title">${pi} ${s.category}</h3>
      <div class="task-list">`;
    s.tasks.forEach(t=>{ const si=t.status==='completed'?'✅':'⏳'; const sc=t.status==='completed'?'task-completed':'task-pending'; h+=`
        <div class="task-item ${sc}">
          <span class="task-status">${si}</span>
          <div class="task-details">
            <span class="task-name">${t.task}</span>
            <span class="task-meta">${t.assignedTo} • ${t.dueDate}</span>
          </div>
        </div>`; });
    h+=`</div></div>`; }); el.innerHTML=h; }

function populateFamilyOverview(){ const el=document.getElementById('familyOverviewContent'); if(!el) return; let h='<div class="family-overview-grid">';
  liveChoreData.familyMembers.forEach(m=>{ const sc=(m.status||'').toLowerCase().replace(' ','-'); const si={'Excellent':'🌟','Good':'👍','On Track':'✓','Needs Improvement':'⚡'}[m.status]||'•'; h+=`
    <div class="family-member-card">
      <div class="member-header"><span class="member-avatar">${m.avatar||'👤'}</span><span class="member-name">${m.name||''}</span></div>
      <div class="member-stats">
        <div class="stat-row"><span class="stat-label">Completion:</span><span class="stat-value">${Number(m.completionRate||0)}%</span></div>
        <div class="stat-row"><span class="stat-label">Points:</span><span class="stat-value">${Number(m.points||0)}</span></div>
        <div class="stat-row"><span class="stat-label">Allowance:</span><span class="stat-value">$${Number(m.allowanceDue||0).toFixed(2)}</span></div>
        <div class="stat-row"><span class="stat-label">Tasks:</span><span class="stat-value">${Number(m.completedTasks||0)}/${Number(m.totalTasks||0)}</span></div>
      </div>
      <div class="member-status ${sc}">${si} ${m.status||''}</div>
    </div>`; }); h+='</div>'; el.innerHTML=h; }

function populateFamilyMembers(){ const el=document.getElementById('familyGrid'); if(!el) return; let h='';
  liveChoreData.familyMembers.forEach(m=>{ h+=`
    <div class="family-card">
      <div class="family-card-header"><span class="family-avatar">${m.avatar||'👤'}</span><h3 class="family-name">${m.name||''}</h3></div>
      <div class="family-stats">
        <div class="stat"><span class="stat-label">Points</span><span class="stat-value">${Number(m.points||0)}</span></div>
        <div class="stat"><span class="stat-label">Completed</span><span class="stat-value">${Number(m.completedTasks||0)}/${Number(m.totalTasks||0)}</span></div>
      </div>
    </div>`; }); el.innerHTML=h; }

function populateTodaysChores(){ const el=document.getElementById('choresList'); if(!el) return; let h='';
  liveChoreData.todaysChores.forEach(c=>{ const st=(c.status||'').toLowerCase(); const sc=st==='completed'?'chore-completed':'chore-pending'; const si=st==='completed'?'✅':'⏳'; h+=`
    <div class="chore-card ${sc}">
      <div class="chore-header"><span class="chore-status">${si}</span><h4 class="chore-title">${c.title||''}</h4></div>
      <div class="chore-details"><span class="chore-assignee">👤 ${c.assignedTo||''}</span><span class="chore-points">+${Number(c.points||0)} pts</span></div>
    </div>`; }); el.innerHTML=h; }

function populateAllowanceTracker(){ const el=document.getElementById('allowanceContent'); if(!el) return; const total=liveChoreData.familyMembers.reduce((s,m)=>s+Number(m.allowanceDue||0),0); let h=`
  <div class="allowance-summary"><div class="allowance-total"><span class="allowance-label">Total This Week</span><span class="allowance-amount">$${total.toFixed(2)}</span></div></div>
  <div class="allowance-breakdown">`;
  liveChoreData.familyMembers.forEach(m=>{ h+=`
    <div class="allowance-item"><span class="allowance-name">${m.avatar||'👤'} ${m.name||''}</span><span class="allowance-value">$${Number(m.allowanceDue||0).toFixed(2)}</span></div>`; }); h+='</div>'; el.innerHTML=h; }

function updateHeaderStats(){ const active=(liveChoreData.todaysChores||[]).filter(c=>(c.status||'').toLowerCase()==='pending').length; const total=(liveChoreData.familyMembers||[]).reduce((s,m)=>s+Number(m.totalTasks||0),0); const done=(liveChoreData.familyMembers||[]).reduce((s,m)=>s+Number(m.completedTasks||0),0); const pct=total>0?Math.round((done/total)*100):0; const a=document.getElementById('activeTasks'); const w=document.getElementById('weekProgress'); if(a) a.textContent=active; if(w) w.textContent=`${pct}%`; }

function triggerHealthAlerts(){ try{ const today=new Date(); const day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][today.getDay()]; const critSecs=(liveChoreData.healthCriticalTasks||[]).filter(s=>(s.priority||'')==='critical'); const critTasks=critSecs.flatMap(s=>s.tasks||[]); const overdue=(liveChoreData.healthCriticalTasks||[]).flatMap(s=>s.tasks||[]).filter(t=>(t.status||'')!=='completed' && ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].includes(t.dueDate)); const thurs=(day==='Thu')?critTasks.filter(t=>(t.dueDate||'').includes('Thu')):[]; if(overdue.length>0) alert(`Health/Critical: ${overdue.length} tasks need attention.`); if(critSecs.length>0) alert(`Critical sections: ${critSecs.length}. Stay on top of priorities!`); if(thurs.length>0) alert(`Thursday priorities: ${thurs.length} tasks due today.`); }catch(e){ console.warn('Alert generation failed', e); }}

function renderAll(){ populateHealthCriticalTasks(); populateFamilyOverview(); populateFamilyMembers(); populateTodaysChores(); populateAllowanceTracker(); updateHeaderStats(); triggerHealthAlerts(); renderShoppingLists(); shoppingAlerts(); }

async function initDashboard(){ try{ const data=await fetchLiveDataFromExcel(); liveChoreData=data; renderAll(); } catch(e){ console.error('Live sync failed, rendering with whatever data available', e); renderAll(); }
  setInterval(async()=>{ try{ const data=await fetchLiveDataFromExcel(); liveChoreData=data; renderAll(); } catch(e){ console.warn('Refresh failed', e); } }, 5*60*1000);
  if (GOOGLE_KEEP_JSON_URL) { try{ await importKeepFromUrl(GOOGLE_KEEP_JSON_URL); renderShoppingLists(); } catch(e){ console.warn('Keep import failed', e); } }
}

if (document.readyState==='loading') { document.addEventListener('DOMContentLoaded', initDashboard); } else { initDashboard(); }
