export default function Slide06HowItWorks() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: '#0C0F1A', fontFamily: "'Inter', sans-serif", color: '#FFFFFF' }}
    >
      {/* Grid overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '4vw 4vw', pointerEvents: 'none' }} />

      {/* Accent blob */}
      <div style={{ position: 'absolute', bottom: '-15vh', left: '20vw', width: '50vw', height: '50vw', borderRadius: '50%', backgroundColor: '#4F7FFF', opacity: 0.04, filter: 'blur(12vw)' }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', display: 'flex', alignItems: 'center', gap: '0.7vw', zIndex: 10 }}>
        <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#7C6BF0', borderRadius: '0.35vw' }} />
        <span style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '-0.02em' }}>FlowIQ</span>
      </div>
      <div style={{ position: 'absolute', top: '5.5vh', right: '5vw', fontSize: '1vw', color: 'rgba(255,255,255,0.4)', zIndex: 10 }}>2026</div>

      {/* Header */}
      <div style={{ position: 'absolute', top: '13vh', left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
        <div style={{ display: 'inline-block', padding: '0.5vh 1.2vw', backgroundColor: 'rgba(79,127,255,0.12)', border: '1px solid rgba(79,127,255,0.28)', borderRadius: '2vw', color: '#4F7FFF', fontSize: '0.85vw', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2vh' }}>
          Process
        </div>
        <h2 style={{ fontSize: '3.8vw', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>How It Works</h2>
      </div>

      {/* 5-step horizontal flow */}
      <div style={{ position: 'absolute', top: '33vh', left: '4vw', right: '4vw', display: 'flex', gap: 0, alignItems: 'flex-start', zIndex: 10 }}>

        {/* Step 1 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 0 }}>
          <div style={{ width: '4vw', height: '4vw', backgroundColor: '#4F7FFF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2vh', boxShadow: '0 0 2vw rgba(79,127,255,0.3)' }}>
            <span style={{ fontSize: '1.4vw', fontWeight: 800, color: '#FFFFFF' }}>01</span>
          </div>
          <div style={{ height: '0.2vh', backgroundColor: 'rgba(79,127,255,0.3)', position: 'absolute', top: '2vh', left: '50%', width: '100%' }} />
          <div style={{ fontSize: '1.25vw', fontWeight: 700, marginBottom: '1.5vh', lineHeight: 1.2 }}>Submit</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, maxWidth: '14vw' }}>Employee submits a request with title, description, and priority — AI routes it to the right department</div>
          <div style={{ marginTop: '2.5vh', padding: '1.5vh 1.5vw', backgroundColor: 'rgba(79,127,255,0.1)', border: '1px solid rgba(79,127,255,0.2)', borderRadius: '0.5vw', fontSize: '0.9vw', color: '#4F7FFF', textAlign: 'center' }}>Smart Form</div>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: '1.8vh', flexShrink: 0 }}>
          <svg width="2.5vw" height="2.5vw" viewBox="0 0 24 24" fill="none" stroke="rgba(79,127,255,0.4)" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </div>

        {/* Step 2 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '4vw', height: '4vw', backgroundColor: '#131726', border: '2px solid rgba(124,107,240,0.5)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2vh' }}>
            <span style={{ fontSize: '1.4vw', fontWeight: 800, color: '#7C6BF0' }}>02</span>
          </div>
          <div style={{ fontSize: '1.25vw', fontWeight: 700, marginBottom: '1.5vh', lineHeight: 1.2 }}>Review</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, maxWidth: '14vw' }}>Department manager reviews the AI-generated briefing and the full request timeline at a glance</div>
          <div style={{ marginTop: '2.5vh', padding: '1.5vh 1.5vw', backgroundColor: 'rgba(124,107,240,0.1)', border: '1px solid rgba(124,107,240,0.2)', borderRadius: '0.5vw', fontSize: '0.9vw', color: '#7C6BF0', textAlign: 'center' }}>AI Briefing</div>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: '1.8vh', flexShrink: 0 }}>
          <svg width="2.5vw" height="2.5vw" viewBox="0 0 24 24" fill="none" stroke="rgba(79,127,255,0.4)" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </div>

        {/* Step 3 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '4vw', height: '4vw', backgroundColor: '#131726', border: '2px solid rgba(79,127,255,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2vh' }}>
            <span style={{ fontSize: '1.4vw', fontWeight: 800, color: '#4F7FFF' }}>03</span>
          </div>
          <div style={{ fontSize: '1.25vw', fontWeight: 700, marginBottom: '1.5vh', lineHeight: 1.2 }}>Action</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, maxWidth: '14vw' }}>Manager advances through workflow steps or rejects with a reason — one click, full audit trail</div>
          <div style={{ marginTop: '2.5vh', padding: '1.5vh 1.5vw', backgroundColor: 'rgba(79,127,255,0.1)', border: '1px solid rgba(79,127,255,0.2)', borderRadius: '0.5vw', fontSize: '0.9vw', color: '#4F7FFF', textAlign: 'center' }}>One Click</div>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: '1.8vh', flexShrink: 0 }}>
          <svg width="2.5vw" height="2.5vw" viewBox="0 0 24 24" fill="none" stroke="rgba(79,127,255,0.4)" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </div>

        {/* Step 4 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '4vw', height: '4vw', backgroundColor: '#131726', border: '2px solid rgba(124,107,240,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2vh' }}>
            <span style={{ fontSize: '1.4vw', fontWeight: 800, color: '#7C6BF0' }}>04</span>
          </div>
          <div style={{ fontSize: '1.25vw', fontWeight: 700, marginBottom: '1.5vh', lineHeight: 1.2 }}>Track</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, maxWidth: '14vw' }}>All parties see real-time status updates and a live comment thread that keeps context in one place</div>
          <div style={{ marginTop: '2.5vh', padding: '1.5vh 1.5vw', backgroundColor: 'rgba(124,107,240,0.1)', border: '1px solid rgba(124,107,240,0.2)', borderRadius: '0.5vw', fontSize: '0.9vw', color: '#7C6BF0', textAlign: 'center' }}>Real-time</div>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', alignItems: 'flex-start', paddingTop: '1.8vh', flexShrink: 0 }}>
          <svg width="2.5vw" height="2.5vw" viewBox="0 0 24 24" fill="none" stroke="rgba(79,127,255,0.4)" strokeWidth="1.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </div>

        {/* Step 5 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '4vw', height: '4vw', backgroundColor: 'rgba(39,201,63,0.15)', border: '2px solid rgba(39,201,63,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2vh' }}>
            <span style={{ fontSize: '1.4vw', fontWeight: 800, color: '#27C93F' }}>05</span>
          </div>
          <div style={{ fontSize: '1.25vw', fontWeight: 700, marginBottom: '1.5vh', lineHeight: 1.2 }}>Close</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, maxWidth: '14vw' }}>Request closes; analytics capture cycle time, SLA compliance rate, and department workload</div>
          <div style={{ marginTop: '2.5vh', padding: '1.5vh 1.5vw', backgroundColor: 'rgba(39,201,63,0.1)', border: '1px solid rgba(39,201,63,0.2)', borderRadius: '0.5vw', fontSize: '0.9vw', color: '#27C93F', textAlign: 'center' }}>Analytics</div>
        </div>

      </div>

      {/* Bottom decorative bar */}
      <div style={{ position: 'absolute', bottom: '10vh', left: '5vw', right: '5vw', height: '0.3vh', background: 'linear-gradient(90deg, rgba(79,127,255,0.6) 0%, rgba(124,107,240,0.6) 50%, rgba(79,127,255,0.1) 100%)', borderRadius: '1vw' }} />

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '3.5vh', left: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', zIndex: 10 }}>FLOWIQ</div>
      <div style={{ position: 'absolute', bottom: '3.5vh', right: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', zIndex: 10 }}>06 / 10</div>
    </div>
  );
}
