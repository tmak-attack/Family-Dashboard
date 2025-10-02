// ... continued helpers
    const line = rows[i]||[];
    const text = (line[0]!==undefined?cellText(line[0]):'') + ' ' + (line[1]!==undefined?cellText(line[1]):'');
    if(regex.test(text)) return i;
  }
  return -1;
}
function findNextSectionIndex(rows, from){
  for(let i=from;i<rows.length;i++){
    const line = rows[i]||[];
    const first = cellText(line[0]);
    if(first && first === first.toUpperCase() && first.length>2) return i; // next ALL CAPS title
    const allEmpty = !line || line.every(c=>cellText(c)==='');
    if(allEmpty) return i;
  }
  return -1;
}
function findHeaderRow(rows, start, end, mustInclude){
  const stop = end>=0?end:rows.length;
  for(let i=start;i<stop;i++){
    const headers = (rows[i]||[]).map(cellText);
    if(!headers.length) continue;
    if(mustInclude.every(h => headers.join('|').toLowerCase().includes(h.toLowerCase()))) return i;
  }
  return -1;
}
function keyHeaders(headerRow){
  const headers = (headerRow||[]).map(cellText);
  const map = {};
  headers.forEach((h,idx)=>{ map[h] = idx; });
  return map;
}
function rowToObj(row, headerMap){
  if(!row) return null;
  const obj = {};
  for(const [k,idx] of Object.entries(headerMap)){
    obj[k] = row[idx];
  }
  return obj;
}
function cellText(v){ return (v===null||v===undefined)?'':String(v).trim(); }
function num(v){ const n = parseFloat(String(v).replace(/[^0-9.+-]/g,'')); return isNaN(n)?0:n; }
function looksCompleted(flag){ const s = String(flag).toLowerCase(); return ['y','yes','done','✓','✅','complete','completed','x'].some(m=>s.includes(m)); }
function guessAvatar(name){
  const n = (name||'').toLowerCase();
  if(n.includes('bobby')) return '👦';
  if(n.includes('caine')) return '🧒';
  if(n.includes('rayne')) return '👧';
  if(n.includes('brad')) return '🧑';
  if(n.includes('estelle')) return '👩';
  return '👤';
}
function escapeHTML(s){ return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }

// Initialize + polling using Google Sheets
async function initDashboard(){
  try{
    const data = await fetchFromGSheets();
    // merge into liveChoreData
    liveChoreData = data; renderAll();
  } catch(e){ console.error('Live sync failed, rendering with whatever data available', e); renderAll(); }
  setInterval(async()=>{ try{ const data=await fetchFromGSheets(); liveChoreData=data; renderAll(); } catch(e){ console.warn('Refresh failed', e); } }, 5*60*1000);
  if (typeof GOOGLE_KEEP_JSON_URL !== 'undefined' && GOOGLE_KEEP_JSON_URL) { try{ await importKeepFromUrl(GOOGLE_KEEP_JSON_URL); renderShoppingLists(); } catch(e){ console.warn('Keep import failed', e); } }
}

function renderAll(){
  populateHealthCriticalTasks();
  populateFamilyOverview();
  populateFamilyMembers();
  populateTodaysChores();
  populateAllowanceTracker();
  updateHeaderStats();
  triggerHealthAlerts();
  renderShoppingLists();
  shoppingAlerts();
}

if (document.readyState==='loading') { document.addEventListener('DOMContentLoaded', initDashboard); } else { initDashboard(); }
