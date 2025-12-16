import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CheckCircle, Smartphone, Shield } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="brand-logo">
          <ShoppingCart /> Carrt_X
        </div>
        <div>
          <button onClick={() => navigate('/login')} className="btn" style={{ background: 'transparent', color: 'var(--text-primary)', marginRight: '1rem' }}>Sign In</button>
          <button onClick={() => navigate('/login')} className="btn btn-primary">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div style={{ maxWidth: '800px' }}>
          <h1 className="hero-title">
            The Smartest Way to Shop with Carrt_X
          </h1>
          <p className="hero-subtitle">
            Organize your grocery lists, manage categories, and sync across devices in real-time. Experience a new standard of productivity.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Start Shopping Now</button>
            <button className="btn" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>Learn More</button>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="features-section">
        <div className="container features-grid">
          <FeatureCard icon={<CheckCircle size={32} color="var(--accent-primary)" />} title="Easy Organization" desc="Categorize items effortlessly and keep your shopping trips efficient." />
          <FeatureCard icon={<Shield size={32} color="var(--success)" />} title="Secure & Private" desc="Your data is encrypted and protected with industry-standard security." />
          <FeatureCard icon={<Smartphone size={32} color="var(--accent-primary)" />} title="Access Anywhere" desc="Acess anywhere, anytime, with our ." />
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2025 Carrt_X. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="glass-panel" style={{ padding: '2rem', transition: 'transform 0.2s' }}>
    <div style={{ marginBottom: '1rem' }}>{icon}</div>
    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
  </div>
);

export default Landing;
