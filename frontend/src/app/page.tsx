'use client';
import { useState } from 'react';

const initialTasks: Record<string, any[]> = {
  'To Do': [
    { id: 1, title: 'Design Homepage', priority: 'High', due: '12 Sep 2026' },
    { id: 2, title: 'Develop Login Feature', priority: 'Low', due: '15 Sep 2026' },
    { id: 3, title: 'Test Payment Gateway', priority: 'Medium', due: '18 Sep 2026' },
  ],
  'Doing': [
    { id: 4, title: 'Code Review Completed', priority: 'High', due: '12 Sep 2026' },
    { id: 5, title: 'Design Mockups Finalized', priority: 'Medium', due: '15 Sep 2026' },
  ],
  'Completed': [
    { id: 6, title: 'Feature Testing Passed', priority: 'Low', due: '10 Sep 2026' },
    { id: 7, title: 'UI Design Updated', priority: 'High', due: '11 Sep 2026' },
  ],
};

const priorityColor: Record<string, string> = {
  High: '#f87171', Medium: '#fb923c', Low: '#9ca3af', Urgent: '#ef4444',
};

export default function TasksPage() {
  const [view, setView] = useState<'list' | 'board'>('list');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'#0a0a0f', color:'white', fontFamily:'inherit'}}>
      
      {/* Sidebar */}
      <aside style={{width:'220px', borderRight:'1px solid rgba(255,255,255,0.06)', padding:'20px 12px', display:'flex', flexDirection:'column', gap:'8px', flexShrink:0}}>
        <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px'}}>
          <div style={{width:'28px', height:'28px', borderRadius:'8px', background:'linear-gradient(135deg,#7c3aed,#2563eb)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 19h20L12 2z"/></svg>
          </div>
          <span style={{fontWeight:700, fontSize:'14px'}}>Dexter</span>
        </div>
        <p style={{color:'#6b7280', fontSize:'11px', fontWeight:600, marginBottom:'4px', paddingLeft:'8px'}}>WORKSPACE</p>
        <button style={{display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', borderRadius:'8px', background:'rgba(255,255,255,0.06)', border:'none', color:'white', fontSize:'13px', fontWeight:500, cursor:'pointer', textAlign:'left'}}>
          📋 Tasks
        </button>
        <button style={{display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', borderRadius:'8px', background:'none', border:'none', color:'#9ca3af', fontSize:'13px', cursor:'pointer', textAlign:'left'}}>
          📁 Projects
        </button>
      </aside>

      {/* Main */}
      <main style={{flex:1, display:'flex', flexDirection:'column', overflow:'hidden'}}>
        
        {/* Header */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
          <h1 style={{fontSize:'18px', fontWeight:600, margin:0}}>Tasks</h1>
          <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
            <div style={{display:'flex', background:'rgba(255,255,255,0.05)', borderRadius:'8px', padding:'4px'}}>
              <button onClick={() => setView('list')} style={{padding:'4px 10px', borderRadius:'6px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:500, background: view==='list' ? 'rgba(255,255,255,0.1)' : 'none', color: view==='list' ? 'white' : '#9ca3af'}}>≡ List</button>
              <button onClick={() => setView('board')} style={{padding:'4px 10px', borderRadius:'6px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:500, background: view==='board' ? 'rgba(255,255,255,0.1)' : 'none', color: view==='board' ? 'white' : '#9ca3af'}}>⊞ Board</button>
            </div>
            <button style={{display:'flex', alignItems:'center', gap:'4px', padding:'8px 14px', background:'white', color:'black', border:'none', borderRadius:'8px', fontSize:'12px', fontWeight:600, cursor:'pointer'}}>
              + Add Task
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1, overflow:'auto', padding:'24px'}}>
          {view === 'list' ? (
            <div style={{display:'flex', flexDirection:'column', gap:'24px'}}>
              {Object.entries(initialTasks).map(([section, tasks]) => (
                <div key={section}>
                  <button onClick={() => setCollapsed(p => ({...p, [section]: !p[section]}))}
                    style={{display:'flex', alignItems:'center', gap:'8px', background:'none', border:'none', color:'#d1d5db', fontSize:'13px', fontWeight:600, cursor:'pointer', marginBottom:'8px'}}>
                    <span>{collapsed[section] ? '▶' : '▼'}</span>
                    {section}
                    <span style={{color:'#6b7280', fontSize:'11px'}}>({tasks.length})</span>
                  </button>
                  {!collapsed[section] && (
                    <div style={{borderRadius:'12px', border:'1px solid rgba(255,255,255,0.06)', overflow:'hidden'}}>
                      <div style={{display:'grid', gridTemplateColumns:'1fr 100px 80px 120px', padding:'8px 16px', background:'rgba(255,255,255,0.02)', borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                        {['Task','Priority','Members','Due Date'].map(h => (
                          <span key={h} style={{fontSize:'11px', color:'#6b7280', fontWeight:600}}>{h}</span>
                        ))}
                      </div>
                      {tasks.map((task, i) => (
                        <div key={task.id} style={{display:'grid', gridTemplateColumns:'1fr 100px 80px 120px', padding:'12px 16px', borderBottom: i < tasks.length-1 ? '1px solid rgba(255,255,255,0.04)' : 'none', cursor:'pointer'}}>
                          <span style={{fontSize:'13px', color:'#e5e7eb'}}>{task.title}</span>
                          <span style={{fontSize:'11px', fontWeight:600, color: priorityColor[task.priority]}}>↑ {task.priority}</span>
                          <div style={{width:'24px', height:'24px', borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#2563eb)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:700}}>D</div>
                          <span style={{fontSize:'11px', color:'#9ca3af'}}>{task.due}</span>
                        </div>
                      ))}
                      <div style={{padding:'8px 16px', fontSize:'12px', color:'#6b7280', cursor:'pointer'}}>+ Add Task</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{display:'flex', gap:'16px', overflowX:'auto', paddingBottom:'16px'}}>
              {Object.entries(initialTasks).map(([section, tasks]) => (
                <div key={section} style={{minWidth:'260px', display:'flex', flexDirection:'column', gap:'12px'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <span style={{fontSize:'13px', fontWeight:600, color:'#d1d5db'}}>{section}</span>
                    <span style={{fontSize:'11px', color:'#6b7280'}}>{tasks.length}</span>
                  </div>
                  {tasks.map(task => (
                    <div key={task.id} style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'12px', padding:'14px', cursor:'pointer'}}>
                      <p style={{margin:'0 0 12px', fontSize:'13px', fontWeight:500, color:'#e5e7eb'}}>{task.title}</p>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <span style={{fontSize:'11px', fontWeight:600, color: priorityColor[task.priority]}}>↑ {task.priority}</span>
                        <span style={{fontSize:'11px', color:'#f87171'}}>📅 {task.due}</span>
                      </div>
                    </div>
                  ))}
                  <button style={{fontSize:'12px', color:'#6b7280', background:'none', border:'none', cursor:'pointer', textAlign:'left'}}>+ Add Task</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}