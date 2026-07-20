export default function Slide04Features() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: '#0C0F1A', fontFamily: "'Inter', sans-serif", color: '#FFFFFF' }}
    >
      {/* Grid overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '4vw 4vw', pointerEvents: 'none' }} />

      {/* Accent blobs */}
      <div style={{ position: 'absolute', top: '20vh', left: '20vw', width: '40vw', height: '40vw', borderRadius: '50%', backgroundColor: '#7C6BF0', opacity: 0.05, filter: 'blur(12vw)' }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', display: 'flex', alignItems: 'center', gap: '0.7vw', zIndex: 10 }}>
        <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#7C6BF0', borderRadius: '0.35vw' }} />
        <span style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '-0.02em' }}>FlowIQ</span>
      </div>
      <div style={{ position: 'absolute', top: '5.5vh', right: '5vw', fontSize: '1vw', color: 'rgba(255,255,255,0.4)', zIndex: 10 }}>2026</div>

      {/* Header */}
      <div style={{ position: 'absolute', top: '14vh', left: '5vw', right: '5vw', zIndex: 10 }}>
        <div style={{ display: 'inline-block', padding: '0.5vh 1vw', backgroundColor: 'rgba(79,127,255,0.12)', border: '1px solid rgba(79,127,255,0.28)', borderRadius: '2vw', color: '#4F7FFF', fontSize: '0.85vw', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2vh' }}>
          Platform
        </div>
        <h2 style={{ fontSize: '3.8vw', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Core Features</h2>
      </div>

      {/* 3×2 Feature grid */}
      <div style={{ position: 'absolute', top: '33vh', left: '5vw', right: '5vw', bottom: '10vh', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '2vh 2vw' }}>

        {/* Feature 1 */}
        <div style={{ backgroundColor: '#131726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.8vw', padding: '2.5vh 2vw', display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
            <div style={{ width: '2.2vw', height: '2.2vw', backgroundColor: 'rgba(79,127,255,0.15)', borderRadius: '0.4vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#4F7FFF" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            </div>
            <span style={{ fontSize: '0.8vw', fontWeight: 600, color: '#4F7FFF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>01</span>
          </div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, lineHeight: 1.2 }}>Request Management</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>Submit, track, and action all requests in one place — from first submission to final resolution</div>
        </div>

        {/* Feature 2 */}
        <div style={{ backgroundColor: '#131726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.8vw', padding: '2.5vh 2vw', display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
            <div style={{ width: '2.2vw', height: '2.2vw', backgroundColor: 'rgba(124,107,240,0.15)', borderRadius: '0.4vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#7C6BF0" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </div>
            <span style={{ fontSize: '0.8vw', fontWeight: 600, color: '#7C6BF0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>02</span>
          </div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, lineHeight: 1.2 }}>Custom Workflows</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>Multi-step approval chains with conditional routing between departments and stakeholders</div>
        </div>

        {/* Feature 3 */}
        <div style={{ backgroundColor: '#131726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.8vw', padding: '2.5vh 2vw', display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
            <div style={{ width: '2.2vw', height: '2.2vw', backgroundColor: 'rgba(79,127,255,0.15)', borderRadius: '0.4vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#4F7FFF" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </div>
            <span style={{ fontSize: '0.8vw', fontWeight: 600, color: '#4F7FFF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>03</span>
          </div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, lineHeight: 1.2 }}>Inline Comments</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>Contextual discussion threads on every request keep all stakeholder communication in one place</div>
        </div>

        {/* Feature 4 */}
        <div style={{ backgroundColor: '#131726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.8vw', padding: '2.5vh 2vw', display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
            <div style={{ width: '2.2vw', height: '2.2vw', backgroundColor: 'rgba(39,201,63,0.12)', borderRadius: '0.4vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#27C93F" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" /></svg>
            </div>
            <span style={{ fontSize: '0.8vw', fontWeight: 600, color: '#27C93F', textTransform: 'uppercase', letterSpacing: '0.08em' }}>04</span>
          </div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, lineHeight: 1.2 }}>Smart Notifications</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>Real-time alerts for pending actions, status changes, and comments — delivered to the right person</div>
        </div>

        {/* Feature 5 */}
        <div style={{ backgroundColor: '#131726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.8vw', padding: '2.5vh 2vw', display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
            <div style={{ width: '2.2vw', height: '2.2vw', backgroundColor: 'rgba(124,107,240,0.15)', borderRadius: '0.4vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#7C6BF0" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <span style={{ fontSize: '0.8vw', fontWeight: 600, color: '#7C6BF0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>05</span>
          </div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, lineHeight: 1.2 }}>Role-based Access</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>Company admins, department managers, and employees each see exactly what they need — nothing more</div>
        </div>

        {/* Feature 6 */}
        <div style={{ backgroundColor: 'rgba(79,127,255,0.06)', border: '1px solid rgba(79,127,255,0.2)', borderRadius: '0.8vw', padding: '2.5vh 2vw', display: 'flex', flexDirection: 'column', gap: '1.2vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8vw' }}>
            <div style={{ width: '2.2vw', height: '2.2vw', backgroundColor: 'rgba(79,127,255,0.2)', borderRadius: '0.4vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#4F7FFF" strokeWidth="2" strokeLinecap="round"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
            </div>
            <span style={{ fontSize: '0.8vw', fontWeight: 600, color: '#4F7FFF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>06</span>
          </div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, lineHeight: 1.2 }}>Full Audit Trail</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>Every action timestamped and attributed — immutable record for compliance and accountability</div>
        </div>

      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '3.5vh', left: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', zIndex: 10 }}>FLOWIQ</div>
      <div style={{ position: 'absolute', bottom: '3.5vh', right: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', zIndex: 10 }}>04 / 10</div>
    </div>
  );
}
