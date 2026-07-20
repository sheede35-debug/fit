export default function Slide10Roadmap() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative"
      style={{ backgroundColor: '#0C0F1A', fontFamily: "'Inter', sans-serif", color: '#FFFFFF' }}
    >
      {/* Grid overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '4vw 4vw', pointerEvents: 'none' }} />

      {/* Accent blobs */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '55vw', height: '55vw', borderRadius: '50%', backgroundColor: '#4F7FFF', opacity: 0.04, filter: 'blur(14vw)' }} />

      {/* Logo */}
      <div style={{ position: 'absolute', top: '5vh', left: '5vw', display: 'flex', alignItems: 'center', gap: '0.7vw', zIndex: 10 }}>
        <div style={{ width: '1.8vw', height: '1.8vw', backgroundColor: '#7C6BF0', borderRadius: '0.35vw' }} />
        <span style={{ fontSize: '1.1vw', fontWeight: 700, letterSpacing: '-0.02em' }}>FlowIQ</span>
      </div>
      <div style={{ position: 'absolute', top: '5.5vh', right: '5vw', fontSize: '1vw', color: 'rgba(255,255,255,0.4)', zIndex: 10 }}>2026</div>

      {/* Header */}
      <div style={{ position: 'absolute', top: '13vh', left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
        <div style={{ display: 'inline-block', padding: '0.5vh 1.2vw', backgroundColor: 'rgba(124,107,240,0.12)', border: '1px solid rgba(124,107,240,0.28)', borderRadius: '2vw', color: '#7C6BF0', fontSize: '0.85vw', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2vh' }}>
          Roadmap
        </div>
        <h2 style={{ fontSize: '3.8vw', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          What&apos;s <span style={{ color: '#7C6BF0' }}>Next</span>
        </h2>
      </div>

      {/* 3×2 Roadmap grid */}
      <div style={{ position: 'absolute', top: '34vh', left: '5vw', right: '5vw', bottom: '10vh', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '2vh 2vw' }}>

        {/* Item 1 */}
        <div style={{ backgroundColor: '#131726', border: '1px solid rgba(124,107,240,0.2)', borderRadius: '0.8vw', padding: '2.5vh 2vw', display: 'flex', flexDirection: 'column', gap: '1.2vh', borderTop: '2px solid #7C6BF0' }}>
          <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#7C6BF0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI — V2</div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, lineHeight: 1.2 }}>AI Smart Routing v2</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>Self-improving classification model trained on company-specific request history</div>
        </div>

        {/* Item 2 */}
        <div style={{ backgroundColor: '#131726', border: '1px solid rgba(79,127,255,0.2)', borderRadius: '0.8vw', padding: '2.5vh 2vw', display: 'flex', flexDirection: 'column', gap: '1.2vh', borderTop: '2px solid #4F7FFF' }}>
          <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#4F7FFF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Mobile</div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, lineHeight: 1.2 }}>Native Mobile App</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>iOS and Android apps for on-the-go approvals, with push notifications and biometric auth</div>
        </div>

        {/* Item 3 */}
        <div style={{ backgroundColor: '#131726', border: '1px solid rgba(124,107,240,0.2)', borderRadius: '0.8vw', padding: '2.5vh 2vw', display: 'flex', flexDirection: 'column', gap: '1.2vh', borderTop: '2px solid #7C6BF0' }}>
          <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#7C6BF0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Connect</div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, lineHeight: 1.2 }}>Integrations</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>Slack, Microsoft Teams, Jira, and SAP connectors for zero-friction enterprise adoption</div>
        </div>

        {/* Item 4 */}
        <div style={{ backgroundColor: '#131726', border: '1px solid rgba(79,127,255,0.2)', borderRadius: '0.8vw', padding: '2.5vh 2vw', display: 'flex', flexDirection: 'column', gap: '1.2vh', borderTop: '2px solid #4F7FFF' }}>
          <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#4F7FFF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Workflow</div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, lineHeight: 1.2 }}>Email-based Actions</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>Advance or reject requests directly from the notification email — without opening the app</div>
        </div>

        {/* Item 5 */}
        <div style={{ backgroundColor: '#131726', border: '1px solid rgba(124,107,240,0.2)', borderRadius: '0.8vw', padding: '2.5vh 2vw', display: 'flex', flexDirection: 'column', gap: '1.2vh', borderTop: '2px solid #7C6BF0' }}>
          <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#7C6BF0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Scale</div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, lineHeight: 1.2 }}>Multi-tenancy</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>Isolated environments for enterprise group deployments — one platform, many companies</div>
        </div>

        {/* Item 6 */}
        <div style={{ background: 'linear-gradient(135deg, rgba(79,127,255,0.1) 0%, rgba(124,107,240,0.08) 100%)', border: '1px solid rgba(79,127,255,0.25)', borderRadius: '0.8vw', padding: '2.5vh 2vw', display: 'flex', flexDirection: 'column', gap: '1.2vh', borderTop: '2px solid #4F7FFF' }}>
          <div style={{ fontSize: '0.8vw', fontWeight: 600, color: '#4F7FFF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Global</div>
          <div style={{ fontSize: '1.2vw', fontWeight: 700, lineHeight: 1.2 }}>Internationalization</div>
          <div style={{ fontSize: '1vw', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>Full i18n support — Arabic RTL already partially scaffolded, expanding to 12 languages</div>
        </div>

      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: '3.5vh', left: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.07em', zIndex: 10 }}>FLOWIQ</div>
      <div style={{ position: 'absolute', bottom: '3.5vh', right: '5vw', fontSize: '0.9vw', color: 'rgba(255,255,255,0.3)', zIndex: 10 }}>10 / 10</div>
    </div>
  );
}
