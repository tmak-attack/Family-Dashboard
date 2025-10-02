if(w) w.textContent=`${pct}%`; }
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
