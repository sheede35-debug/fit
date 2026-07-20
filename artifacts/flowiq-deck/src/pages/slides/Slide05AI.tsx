export default function Slide05AI() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: '#0C0F1A', fontFamily: "'Inter', sans-serif", color: '#FFFFFF' }}
    >
      {/* Grid overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '4vw 4vw', pointerEvents: 'none' }} />

      {/* Accent blobs */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '50vw', height: '50vw', borderRadius: '50%', backgroundColor: '#7C6BF0', opacity: 0.06, filter: 'blur(14vw)' }} />
      <div style={{ position: 'absolute', top: '-10vh', right: '-5vw', width: '35vw', height: '35vw', borderRadius: '50%', backgroundColor: '#4F7FFF', opacity: 0.05, filter: 'blur(9vw)' }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', display: 'flex', alignItems: 'center', gap: '0.7vw', zIndex: 10 }}>
        <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#7C6BF0', borderRadius: '0.35vw' }} />
        <span style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '-0.02em' }}>FlowIQ</span>
      </div>
      <div style={{ position: 'absolute', top: '5.5vh', right: '5vw', fontSize: '1vw', color: 'rgba(255,255,255,0.4)', zIndex: 10 }}>2026</div>

      {/* Header */}
      <div style={{ position: 'absolute', top: '13vh', left: 0, right: 0, zIndex: 10, textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '0.5vh 1.2vw', backgroundColor: 'rgba(124,107,240,0.12)', border: '1px solid rgba(124,107,240,0.28)', borderRadius: '2vw', color: '#7C6BF0', fontSize: '0.85vw', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2vh' }}>
          Intelligence
        </div>
        <h2 style={{ fontSize: '3.8vw', fontWeight: 800, margin: '0 0 1vh 0', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          AI at the <span style={{ color: '#7C6BF0' }}>Core</span>
        </h2>
        <p style={{ fontSize: '1.2vw', color: 'rgba(255,255,255,0.6)', margin: 0, fontWeight: 300 }}>Four AI systems that work together to eliminate manual effort and surface the right insights</p>
      </div>

      {/* 2×2 AI feature grid */}
      <div style={{ position: 'absolute', top: '34vh', left: '5vw', right: '5vw', bottom: '10vh', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '2.5vh 3vw' }}>

        {/* AI 1: Smart Routing */}
        <div style={{ background: 'linear-gradient(135deg, rgba(79,127,255,0.1) 0%, rgba(19,23,38,0.9) 100%)', border: '1px solid rgba(79,127,255,0.2)', borderRadius: '1vw', padding: '3vh 2.5vw', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
            <div style={{ width: '3vw', height: '3vw', backgroundColor: 'rgba(79,127,255,0.2)', borderRadius: '0.6vw', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#4F7FFF" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>
            </div>
            <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#4F7FFF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Smart Routing</div>
          </div>
          <div style={{ fontSize: '1.35vw', fontWeight: 700, lineHeight: 1.2 }}>Department Auto-Classification</div>
          <div style={{ fontSize: '1.05vw', color: 'rgba(255,255,255,0.6)', lineHeight: 1.55 }}>AI reads the request and assigns it to the correct department automatically — zero manual routing required</div>
        </div>

        {/* AI 2: Briefing Engine */}
        <div style={{ background: 'linear-gradient(135deg, rgba(124,107,240,0.1) 0%, rgba(19,23,38,0.9) 100%)', border: '1px solid rgba(124,107,240,0.2)', borderRadius: '1vw', padding: '3vh 2.5vw', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
            <div style={{ width: '3vw', height: '3vw', backgroundColor: 'rgba(124,107,240,0.2)', borderRadius: '0.6vw', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#7C6BF0" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
            </div>
            <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#7C6BF0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Briefing Engine</div>
          </div>
          <div style={{ fontSize: '1.35vw', fontWeight: 700, lineHeight: 1.2 }}>13-Field Structured Briefing</div>
          <div style={{ fontSize: '1.05vw', color: 'rgba(255,255,255,0.6)', lineHeight: 1.55 }}>Generates risk level, priority score, similar past cases, and recommended action — per request, instantly</div>
        </div>

        {/* AI 3: Delay Prediction */}
        <div style={{ background: 'linear-gradient(135deg, rgba(255,189,46,0.08) 0%, rgba(19,23,38,0.9) 100%)', border: '1px solid rgba(255,189,46,0.18)', borderRadius: '1vw', padding: '3vh 2.5vw', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
            <div style={{ width: '3vw', height: '3vw', backgroundColor: 'rgba(255,189,46,0.15)', borderRadius: '0.6vw', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#FFBD2E" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </div>
            <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#FFBD2E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Delay Prediction</div>
          </div>
          <div style={{ fontSize: '1.35vw', fontWeight: 700, lineHeight: 1.2 }}>SLA Breach Forecasting</div>
          <div style={{ fontSize: '1.05vw', color: 'rgba(255,255,255,0.6)', lineHeight: 1.55 }}>ML model predicts whether a request will breach its SLA — surfacing risk before the deadline is missed</div>
        </div>

        {/* AI 4: Chat Assistant */}
        <div style={{ background: 'linear-gradient(135deg, rgba(39,201,63,0.08) 0%, rgba(19,23,38,0.9) 100%)', border: '1px solid rgba(39,201,63,0.18)', borderRadius: '1vw', padding: '3vh 2.5vw', display: 'flex', flexDirection: 'column', gap: '1.5vh' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1vw' }}>
            <div style={{ width: '3vw', height: '3vw', backgroundColor: 'rgba(39,201,63,0.15)', borderRadius: '0.6vw', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#27C93F" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </div>
            <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#27C93F', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Chat</div>
          </div>
          <div style={{ fontSize: '1.35vw', fontWeight: 700, lineHeight: 1.2 }}>Natural Language Assistant</div>
          <div style={{ fontSize: '1.05vw', color: 'rgba(255,255,255,0.6)', lineHeight: 1.55 }}>Ask any question about a request or your portfolio in plain language — answers draw from live database context</div>
        </div>

      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '3.5vh', left: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', zIndex: 10 }}>FLOWIQ</div>
      <div style={{ position: 'absolute', bottom: '3.5vh', right: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', zIndex: 10 }}>05 / 10</div>
    </div>
  );
}
