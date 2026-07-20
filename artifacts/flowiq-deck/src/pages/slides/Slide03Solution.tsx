export default function Slide03Solution() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: '#0C0F1A', fontFamily: "'Inter', sans-serif", color: '#FFFFFF' }}
    >
      {/* Grid overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '4vw 4vw', pointerEvents: 'none' }} />

      {/* Accent blobs */}
      <div style={{ position: 'absolute', top: '10vh', left: '-5vw', width: '40vw', height: '40vw', borderRadius: '50%', backgroundColor: '#4F7FFF', opacity: 0.06, filter: 'blur(10vw)' }} />
      <div style={{ position: 'absolute', bottom: '-10vh', right: '-5vw', width: '40vw', height: '40vw', borderRadius: '50%', backgroundColor: '#7C6BF0', opacity: 0.06, filter: 'blur(10vw)' }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', display: 'flex', alignItems: 'center', gap: '0.7vw', zIndex: 10 }}>
        <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#7C6BF0', borderRadius: '0.35vw' }} />
        <span style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '-0.02em' }}>FlowIQ</span>
      </div>
      <div style={{ position: 'absolute', top: '5.5vh', right: '5vw', fontSize: '1vw', color: 'rgba(255,255,255,0.4)', zIndex: 10 }}>2026</div>

      {/* Main content */}
      <div style={{ position: 'absolute', top: '14vh', left: '5vw', right: '5vw', bottom: '10vh', display: 'flex', gap: '6vw', alignItems: 'flex-start' }}>

        {/* Left column */}
        <div style={{ flex: '0 0 40%', paddingTop: '1vh' }}>
          <div style={{ display: 'inline-block', padding: '0.5vh 1vw', backgroundColor: 'rgba(79,127,255,0.12)', border: '1px solid rgba(79,127,255,0.28)', borderRadius: '2vw', color: '#4F7FFF', fontSize: '0.85vw', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3vh' }}>
            The Solution
          </div>

          <h2 style={{ fontSize: '4.2vw', fontWeight: 800, margin: '0 0 3vh 0', lineHeight: 1.1, letterSpacing: '-0.03em', textWrap: 'balance' }}>
            Meet<br />
            <span style={{ color: '#4F7FFF' }}>FlowIQ.</span>
          </h2>

          <p style={{ fontSize: '1.25vw', fontWeight: 300, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, textWrap: 'pretty' }}>
            A single intelligent platform that replaces ad-hoc approval chains with structured, AI-powered workflows — from submission to resolution.
          </p>

          {/* Divider */}
          <div style={{ margin: '4vh 0', height: '1px', background: 'linear-gradient(90deg, rgba(79,127,255,0.5) 0%, rgba(79,127,255,0.05) 100%)' }} />

          <div style={{ fontSize: '1.1vw', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            Used by Meridian Group across Legal, Finance, HR, and IT — replacing email approval chains with structured intelligence.
          </div>
        </div>

        {/* Right column: bullet points */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2vh', paddingTop: '1vh' }}>

          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '1.8vw', height: '1.8vw', borderRadius: '50%', backgroundColor: 'rgba(79,127,255,0.15)', border: '1px solid rgba(79,127,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2vh' }}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#4F7FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ fontSize: '1.2vw', lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600 }}>Submit any request in seconds</span>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}> via a smart, structured form</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '1.8vw', height: '1.8vw', borderRadius: '50%', backgroundColor: 'rgba(79,127,255,0.15)', border: '1px solid rgba(79,127,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2vh' }}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#4F7FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ fontSize: '1.2vw', lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600 }}>AI automatically classifies and routes</span>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}> to the right department — no manual handoff</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '1.8vw', height: '1.8vw', borderRadius: '50%', backgroundColor: 'rgba(79,127,255,0.15)', border: '1px solid rgba(79,127,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2vh' }}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#4F7FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ fontSize: '1.2vw', lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600 }}>Every stakeholder sees real-time status,</span>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}> comments, and full history</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '1.8vw', height: '1.8vw', borderRadius: '50%', backgroundColor: 'rgba(79,127,255,0.15)', border: '1px solid rgba(79,127,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2vh' }}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#4F7FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ fontSize: '1.2vw', lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600 }}>Managers advance or reject with one click,</span>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}> backed by a full audit trail</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start' }}>
            <div style={{ width: '1.8vw', height: '1.8vw', borderRadius: '50%', backgroundColor: 'rgba(79,127,255,0.15)', border: '1px solid rgba(79,127,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2vh' }}>
              <svg width="55%" height="55%" viewBox="0 0 24 24" fill="none" stroke="#4F7FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ fontSize: '1.2vw', lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600 }}>Analytics reveal bottlenecks</span>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}> before they become problems</span>
            </div>
          </div>

          {/* Callout box */}
          <div style={{ marginTop: '2vh', padding: '2.5vh 2.5vw', background: 'linear-gradient(135deg, rgba(79,127,255,0.12) 0%, rgba(124,107,240,0.1) 100%)', border: '1px solid rgba(79,127,255,0.25)', borderRadius: '0.8vw' }}>
            <div style={{ fontSize: '1.1vw', fontWeight: 600, marginBottom: '0.5vh', color: '#4F7FFF' }}>One platform. Every department.</div>
            <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Legal, Finance, HR, and IT — all running structured workflows in a single unified system.</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '3.5vh', left: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', zIndex: 10 }}>FLOWIQ</div>
      <div style={{ position: 'absolute', bottom: '3.5vh', right: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', zIndex: 10 }}>03 / 10</div>
    </div>
  );
}
