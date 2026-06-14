export default function AboutSlide() {
  return (
    <div className="slide">
      <h2>Hva er Sentry?</h2>
      <div className="card-grid">
        <div className="card">
          <div className="card-icon">🔍</div>
          <h3>Feilsporing</h3>
          <p>Fang opp krasj og unntak i sanntid med full stack trace, kontekst og brukerdata.</p>
        </div>
        <div className="card">
          <div className="card-icon">📊</div>
          <h3>Ytelsesovervåking</h3>
          <p>Se flaskehalser med distributed tracing, spans og transaksjoner.</p>
        </div>
        <div className="card">
          <div className="card-icon">📦</div>
          <h3>Releases &amp; Source Maps</h3>
          <p>Kobler feil til spesifikke releases, med de-minifiserte stack traces.</p>
        </div>
        <div className="card">
          <div className="card-icon">🎥</div>
          <h3>Session Replay</h3>
          <p>Se nøyaktig hva brukeren gjorde før feilen oppstod.</p>
        </div>
      </div>
    </div>
  )
}
