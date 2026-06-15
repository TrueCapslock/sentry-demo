import { useNavigate } from "../hooks/useNavigate";

export default function WelcomeSlide() {
  const next = useNavigate();
  return (
    <div className="slide welcome">
      <div className="slide-bg-icon">🦋</div>
      <h1 className="title">App-overvåking</h1>
      <p className="subtitle">Feilovervåking og ytelsesmonitorering i produksjon</p>
      <div className="meta">
        <span>Demo · Juni 2026</span>
      </div>
      <button className="slide-cta" onClick={next}>
        Start →
      </button>
    </div>
  );
}
