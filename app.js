// ============================================
// Family Dashboard - Google Sheets Live Sync + Google Keep Shopping Import
// ============================================

// CONFIG: Publish your Google Sheet to the web (File > Share > Publish to web)
// Then set these to the published CSV/TSV endpoints or use Sheets API via Apps Script Web App.
// Expecting three tabs/ranges:
// - Family (columns: name, avatar, completionRate, points, allowanceDue, status, totalTasks, completedTasks)
// - HealthCritical (columns: category, priority, task, assignedTo, dueDate, status)
// - TodaysChores (columns: title, assignedTo, points, status)

const GSHEETS_BASE = '';
const GSHEETS_FAMILY_RANGE = '';
const GSHEETS_HEALTH_RANGE = '';
const GSHEETS_CHORES_RANGE = '';

// Alternative: Single Apps Script endpoint returning a JSON object with {family, health, chores}
const GSHEETS_JSON_ENDPOINT = '';

let GOOGLE_KEEP_JSON_URL = '';

function csvToRows(csv) {
  return csv.trim().split(/\r?\n/).map(l => l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(v => v.replace(/^"|"$/g, '')));
}

function headerRowsToObjects(rows) {
  if (!rows.length) return [];
  const headers = rows[0].map(h => String(h).trim());
  return rows.slice(1).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
}

async function fetchCsvRange(rangeUrl) {
  const res = await fetch(rangeUrl, { mode: 'cors' });
  if (!res.ok) throw new Error(`Failed to fetch: ${rangeUrl}`);
  const text = await res.text();
  return headerRowsToObjects(csvToRows(text));
}

async function fetchFromGSheets() {
  // Strategy: Prefer JSON endpoint if provided; otherwise fetch individual CSV ranges
  if (GSHEETS_JSON_ENDPOINT) {
    const r = await fetch(GSHEETS_JSON_ENDPOINT, { mode: 'cors' });
    if (!r.ok) throw new Error('Failed to fetch Google Sheets JSON');
    const json = await r.json();
    return normalizeData(json.family || [], json.health || [], json.chores || []);
  }
  if (!(GSHEETS_BASE && GSHEETS_FAMILY_RANGE && GSHEETS_HEALTH_RANGE && GSHEETS_CHORES_RANGE)) {
    throw new Error('Google Sheets config is missing. Set GSHEETS_* values.');
  }
  const qs = (range) => `${GSHEETS_BASE}${range}`;
  const [familyRows, healthRows, choresRows] = await Promise.all([
    fetchCsvRange(qs(GSHEETS_FAMILY_RANGE)),
    fetchCsvRange(qs(GSHEETS_HEALTH_RANGE)),
    fetchCsvRange(qs(GSHEETS_CHORES_RANGE)),
  ]);
  return normalizeData(familyRows, healthRows, choresRows);
}

function normalizeData(familyRows, healthRows, choresRows) {
  const familyMembers = (familyRows || []).map((r, i) => ({
    id: i + 1,
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
  for (const r of (healthRows || [])) {
    const category = String(r.category || r.Category || 'General');
    const priority = String(r.priority || r.Priority || 'high').toLowerCase();
    const item = {
      task: String(r.task || r.Task || ''),
      assignedTo: String(r.assignedTo || r['Assigned To'] || ''),
      dueDate: String(r.dueDate || r.Due || r.DueDate || ''),
      status: String(r.status || r.Status || 'pending').toLowerCase(),
    };
    const key = category + '|' + priority;
    if (!byCategory[key]) byCategory[key] = { category, priority, tasks: [] };
    byCategory[key].tasks.push(item);
  }
  const healthCriticalTasks = Object.values(byCategory);

  const todaysChores = (choresRows || []).map((r, i) => ({
    id: i + 1,
    title: String(r.title || r.Task || r.Title || ''),
    assignedTo: String(r.assignedTo || r.Who || r['Assigned To'] || ''),
    points: Number(r.points || r.Points || 0),
    status: String(r.status || r.Status || 'pending').toLowerCase(),
  }));
  return { familyMembers, healthCriticalTasks, todaysChores };
}

// Google Keep Shopping Import (unchanged)
let shoppingLists = [];
function parseKeepJson(json) {
  const lists = [];
  if (Array.isArray(json)) {
    for (const l of json) {
      const title = String(l.title || l.name || 'Shopping');
      const items = (l.items || l.listItems || []).map(it => ({
        text: String(it.text || it.title || ''),
        checked: !!(it.checked || it.isChecked),
        label: String(it.label || it.category || ''),
        isNew: !!it.isNew,
        urgent: !!it.urgent,
      }));
      lists.push({ title, items });
    }
  }
  return lists;
}
async function importKeepFromUrl(url) {
  const r = await fetch(url, { mode: 'cors' });
  if (!r.ok) throw new Error('Failed to fetch Keep JSON');
  shoppingLists = parseKeepJson(await r.json());
}
function renderShoppingLists() {
  const c = document.getElementById('shoppingContent');
  if (!c) return;
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

// Live data state
let liveChoreData = { familyMembers: [], healthCriticalTasks: [], todaysChores: [] };

// Rendering functions (unchanged from prior version)
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

// Initialize + polling using Google Sheets
async function initDashboard(){
  try{
    const data = await fetchFromGSheets();
    liveChoreData = data; renderAll();
  } catch(e){ console.error('Live sync failed, rendering with whatever data available', e); renderAll(); }
  setInterval(async()=>{ try{ const data=await fetchFromGSheets(); liveChoreData=data; renderAll(); } catch(e){ console.warn('Refresh failed', e); } }, 5*60*1000);
  if (GOOGLE_KEEP_JSON_URL) { try{ await importKeepFromUrl(GOOGLE_KEEP_JSON_URL); renderShoppingLists(); } catch(e){ console.warn('Keep import failed', e); } }
}
if (document.readyState==='loading') { document.addEventListener('DOMContentLoaded', initDashboard); } else { initDashboard(); }
