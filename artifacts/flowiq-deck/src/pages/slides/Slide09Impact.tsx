export default function Slide09Impact() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: '#0C0F1A', fontFamily: "'Inter', sans-serif", color: '#FFFFFF' }}
    >
      {/* Grid overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '4vw 4vw', pointerEvents: 'none' }} />

      {/* Accent blob */}
      <div style={{ position: 'absolute', top: '-10vh', right: '-5vw', width: '45vw', height: '45vw', borderRadius: '50%', backgroundColor: '#4F7FFF', opacity: 0.05, filter: 'blur(11vw)' }} />
      <div style={{ position: 'absolute', bottom: '-15vh', left: '0vw', width: '40vw', height: '40vw', borderRadius: '50%', backgroundColor: '#27C93F', opacity: 0.04, filter: 'blur(10vw)' }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', display: 'flex', alignItems: 'center', gap: '0.7vw', zIndex: 10 }}>
        <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#7C6BF0', borderRadius: '0.35vw' }} />
        <span style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '-0.02em' }}>FlowIQ</span>
      </div>
      <div style={{ position: 'absolute', top: '5.5vh', right: '5vw', fontSize: '1vw', color: 'rgba(255,255,255,0.4)', zIndex: 10 }}>2026</div>

      {/* Header */}
      <div style={{ position: 'absolute', top: '13vh', left: '5vw', zIndex: 10 }}>
        <div style={{ display: 'inline-block', padding: '0.5vh 1vw', backgroundColor: 'rgba(39,201,63,0.1)', border: '1px solid rgba(39,201,63,0.25)', borderRadius: '2vw', color: '#27C93F', fontSize: '0.85vw', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2vh' }}>
          Results
        </div>
        <h2 style={{ fontSize: '3.8vw', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Business <span style={{ color: '#27C93F' }}>Impact</span>
        </h2>
      </div>

      {/* Two-column impact layout: 3 left + 2 right */}
      <div style={{ position: 'absolute', top: '32vh', left: '5vw', right: '5vw', bottom: '10vh', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5vh 4vw' }}>

        {/* Item 1 */}
        <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start', padding: '2.5vh 2vw', backgroundColor: '#131726', border: '1px solid rgba(79,127,255,0.15)', borderRadius: '0.8vw' }}>
          <div style={{ fontSize: '2.5vw', fontWeight: 800, color: '#4F7FFF', lineHeight: 1, flexShrink: 0, minWidth: '3vw' }}>01</div>
          <div>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, marginBottom: '0.6vh', color: '#FFFFFF' }}>Faster Approvals</div>
            <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Eliminate email chains — requests resolved in hours, not days, from any device</div>
          </div>
        </div>

        {/* Item 2 */}
        <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start', padding: '2.5vh 2vw', backgroundColor: '#131726', border: '1px solid rgba(79,127,255,0.15)', borderRadius: '0.8vw' }}>
          <div style={{ fontSize: '2.5vw', fontWeight: 800, color: '#7C6BF0', lineHeight: 1, flexShrink: 0, minWidth: '3vw' }}>02</div>
          <div>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, marginBottom: '0.6vh', color: '#FFFFFF' }}>Full Visibility</div>
            <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Every stakeholder knows exactly where every request stands — no follow-up emails needed</div>
          </div>
        </div>

        {/* Item 3 */}
        <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start', padding: '2.5vh 2vw', backgroundColor: '#131726', border: '1px solid rgba(79,127,255,0.15)', borderRadius: '0.8vw' }}>
          <div style={{ fontSize: '2.5vw', fontWeight: 800, color: '#4F7FFF', lineHeight: 1, flexShrink: 0, minWidth: '3vw' }}>03</div>
          <div>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, marginBottom: '0.6vh', color: '#FFFFFF' }}>Better Decisions</div>
            <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>AI briefings give managers instant context — no more digging through email threads for history</div>
          </div>
        </div>

        {/* Item 4 */}
        <div style={{ display: 'flex', gap: '1.5vw', alignItems: 'flex-start', padding: '2.5vh 2vw', backgroundColor: '#131726', border: '1px solid rgba(255,189,46,0.15)', borderRadius: '0.8vw' }}>
          <div style={{ fontSize: '2.5vw', fontWeight: 800, color: '#FFBD2E', lineHeight: 1, flexShrink: 0, minWidth: '3vw' }}>04</div>
          <div>
            <div style={{ fontSize: '1.2vw', fontWeight: 700, marginBottom: '0.6vh', color: '#FFFFFF' }}>Fewer SLA Breaches</div>
            <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Delay prediction catches at-risk requests before deadlines pass — proactive, not reactive</div>
          </div>
        </div>

        {/* Item 5: spans full width at bottom */}
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1.5vw', alignItems: 'center', padding: '2.5vh 2.5vw', background: 'linear-gradient(135deg, rgba(39,201,63,0.1) 0%, rgba(19,23,38,0.8) 100%)', border: '1px solid rgba(39,201,63,0.25)', borderRadius: '0.8vw' }}>
          <div style={{ fontSize: '2.5vw', fontWeight: 800, color: '#27C93F', lineHeight: 1, flexShrink: 0, minWidth: '3vw' }}>05</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.25vw', fontWeight: 700, marginBottom: '0.4vh', color: '#FFFFFF' }}>Compliance-Ready</div>
            <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>Immutable audit trail for every action, every approval, every rejection — perfect for regulated industries</div>
          </div>
          <div style={{ padding: '1vh 2vw', backgroundColor: 'rgba(39,201,63,0.15)', border: '1px solid rgba(39,201,63,0.3)', borderRadius: '0.5vw', fontSize: '0.95vw', fontWeight: 600, color: '#27C93F', flexShrink: 0 }}>SOC2 Ready</div>
        </div>

      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '3.5vh', left: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', zIndex: 10 }}>FLOWIQ</div>
      <div style={{ position: 'absolute', bottom: '3.5vh', right: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', zIndex: 10 }}>09 / 10</div>
    </div>
  );
}
