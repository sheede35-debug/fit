export default function Slide02Problem() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: '#0C0F1A', fontFamily: "'Inter', sans-serif", color: '#FFFFFF' }}
    >
      {/* Grid overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '4vw 4vw', pointerEvents: 'none' }} />

      {/* Accent blobs */}
      <div style={{ position: 'absolute', top: '5vh', right: '-5vw', width: '40vw', height: '40vw', borderRadius: '50%', backgroundColor: '#FF4444', opacity: 0.04, filter: 'blur(10vw)' }} />
      <div style={{ position: 'absolute', bottom: '-10vh', left: '30vw', width: '35vw', height: '35vw', borderRadius: '50%', backgroundColor: '#7C6BF0', opacity: 0.05, filter: 'blur(8vw)' }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', display: 'flex', alignItems: 'center', gap: '0.7vw', zIndex: 10 }}>
        <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#7C6BF0', borderRadius: '0.35vw' }} />
        <span style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '-0.02em' }}>FlowIQ</span>
      </div>
      <div style={{ position: 'absolute', top: '5.5vh', right: '5vw', fontSize: '1vw', color: 'rgba(255,255,255,0.4)', zIndex: 10 }}>2026</div>

      {/* Main content */}
      <div style={{ position: 'absolute', top: '14vh', left: '5vw', right: '5vw', bottom: '10vh', display: 'flex', gap: '5vw', alignItems: 'flex-start' }}>

        {/* Left: headline */}
        <div style={{ flex: '0 0 38%', paddingTop: '2vh' }}>
          <div style={{ display: 'inline-block', padding: '0.5vh 1vw', backgroundColor: 'rgba(255,68,68,0.12)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: '2vw', color: '#FF6B6B', fontSize: '0.85vw', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3vh' }}>
            The Challenge
          </div>

          <h2 style={{ fontSize: '4vw', fontWeight: 800, margin: '0 0 3vh 0', lineHeight: 1.1, letterSpacing: '-0.03em', textWrap: 'balance' }}>
            Enterprise workflows<br />
            <span style={{ color: '#FF6B6B' }}>are broken.</span>
          </h2>

          <p style={{ fontSize: '1.3vw', fontWeight: 300, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: '30vw', textWrap: 'pretty' }}>
            Approval processes built on email and spreadsheets collapse under the weight of modern enterprise demands.
          </p>

          {/* Decorative stat */}
          <div style={{ marginTop: '5vh', padding: '2.5vh 2vw', backgroundColor: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.15)', borderRadius: '0.8vw' }}>
            <div style={{ fontSize: '4vw', fontWeight: 800, color: '#FF6B6B', lineHeight: 1 }}>73%</div>
            <div style={{ fontSize: '1.1vw', color: 'rgba(255,255,255,0.55)', marginTop: '0.8vh', lineHeight: 1.4 }}>of enterprise teams report approval delays as their top operational bottleneck</div>
          </div>
        </div>

        {/* Right: problem list */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.8vh', paddingTop: '2vh' }}>

          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start', padding: '2vh 2vw', backgroundColor: '#131726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.7vw' }}>
            <div style={{ width: '2vw', height: '2vw', backgroundColor: 'rgba(255,68,68,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2vh', fontSize: '0.85vw', color: '#FF6B6B', fontWeight: 700 }}>01</div>
            <div>
              <div style={{ fontSize: '1.15vw', fontWeight: 600, marginBottom: '0.4vh' }}>Lost in email chains</div>
              <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>Approval requests buried in inboxes and spreadsheets, impossible to track</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start', padding: '2vh 2vw', backgroundColor: '#131726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.7vw' }}>
            <div style={{ width: '2vw', height: '2vw', backgroundColor: 'rgba(255,68,68,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2vh', fontSize: '0.85vw', color: '#FF6B6B', fontWeight: 700 }}>02</div>
            <div>
              <div style={{ fontSize: '1.15vw', fontWeight: 600, marginBottom: '0.4vh' }}>Zero visibility</div>
              <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>No way to see where a request stands, who is blocking it, or why it is late</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start', padding: '2vh 2vw', backgroundColor: '#131726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.7vw' }}>
            <div style={{ width: '2vw', height: '2vw', backgroundColor: 'rgba(255,68,68,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2vh', fontSize: '0.85vw', color: '#FF6B6B', fontWeight: 700 }}>03</div>
            <div>
              <div style={{ fontSize: '1.15vw', fontWeight: 600, marginBottom: '0.4vh' }}>Manual routing — every time</div>
              <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>Departments pass requests from Finance to HR to Legal, starting from scratch each handoff</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start', padding: '2vh 2vw', backgroundColor: '#131726', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.7vw' }}>
            <div style={{ width: '2vw', height: '2vw', backgroundColor: 'rgba(255,68,68,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2vh', fontSize: '0.85vw', color: '#FF6B6B', fontWeight: 700 }}>04</div>
            <div>
              <div style={{ fontSize: '1.15vw', fontWeight: 600, marginBottom: '0.4vh' }}>Context arrives too late</div>
              <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>Decision-makers wait days for context they should have in seconds</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.2vw', alignItems: 'flex-start', padding: '2vh 2vw', backgroundColor: 'rgba(255,68,68,0.06)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: '0.7vw' }}>
            <div style={{ width: '2vw', height: '2vw', backgroundColor: 'rgba(255,68,68,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.2vh', fontSize: '0.85vw', color: '#FF6B6B', fontWeight: 700 }}>05</div>
            <div>
              <div style={{ fontSize: '1.15vw', fontWeight: 600, marginBottom: '0.4vh', color: '#FF6B6B' }}>Result: slow decisions, missed SLAs</div>
              <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 }}>Frustrated employees, compliance risk, and operational drag across every department</div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '3.5vh', left: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', zIndex: 10 }}>FLOWIQ</div>
      <div style={{ position: 'absolute', bottom: '3.5vh', right: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', zIndex: 10 }}>02 / 10</div>
    </div>
  );
}
