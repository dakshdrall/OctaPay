import { useEffect, useState } from 'react';

const WALLETS = [
  { name: 'Rahul', address: 'GBFNQL377LPLSEDR3BMHVS4ZQ3IWPTBZESI2LRXI3H6T7INGSDJCVBIF' },
  { name: 'Priya', address: 'GDRQG5IVUHOS46RM4PAPCFF7TMYLQ3AHWC63UABMW4VJOMBXDF36XFCM' },
  { name: 'Arjun', address: 'GDAZVM5TXYSKWOPRDQ77Z7XDKWHODTFAFTT2ECK63KLUXPTLTVHOKCI6' },
  { name: 'Sneha', address: 'GCSRPWQUFP7EZKSMRYQTCOMZBLEAVTYRWQJDESBDYQFHG5GUEZPTZFFF' },
  { name: 'Karan', address: 'GCTWLP274QCAJRYTPKMAWAHS6HE2PDKAWNHXW2HBYIRTINGJ6ZGGQFFP' },
];

const HORIZON = 'https://horizon-testnet.stellar.org';

export default function Explorer() {
  const [selected, setSelected] = useState(WALLETS[0]);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${HORIZON}/accounts/${selected.address}/transactions?limit=10&order=desc`)
      .then(r => r.json())
      .then(data => { setTxns(data._embedded?.records || []); setLoading(false); })
      .catch(() => { setError('Could not fetch from Horizon'); setLoading(false); });
  }, [selected]);

  const s = {
    page: { padding: '2rem', fontFamily: 'var(--font-display)' },
    h1: { fontSize: '2rem', fontWeight: 800, color: 'var(--color-cyan)', marginBottom: '1.5rem' },
    tabs: { display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' },
    addr: { fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', wordBreak: 'break-all' },
    card: { background: 'var(--color-surface)', border: '1px solid var(--color-surface-2)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '0.75rem' },
    txid: { fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)' },
    meta: { marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' },
    link: { fontSize: '0.75rem', color: 'var(--color-cyan)', textDecoration: 'none', marginTop: '0.25rem', display: 'inline-block' },
    muted: { color: 'var(--color-text-muted)' },
    err: { color: '#f87171' },
  };

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Explorer</h1>
      <div style={s.tabs}>
        {WALLETS.map(w => (
          <button key={w.address} onClick={() => setSelected(w)} style={{
            padding: '0.5rem 1.25rem', borderRadius: '999px', cursor: 'pointer', fontWeight: 600,
            fontFamily: 'var(--font-display)', transition: 'all 0.2s',
            border: `1px solid ${selected.address === w.address ? 'var(--color-cyan)' : 'var(--color-surface-2)'}`,
            background: selected.address === w.address ? 'var(--color-cyan)' : 'var(--color-surface)',
            color: selected.address === w.address ? 'var(--color-bg)' : 'var(--color-text)',
          }}>{w.name}</button>
        ))}
      </div>
      <p style={s.addr}>{selected.address}</p>
      {loading && <p style={s.muted}>Loading transactions…</p>}
      {error && <p style={s.err}>{error}</p>}
      {!loading && !error && txns.length === 0 && <p style={s.muted}>No transactions found.</p>}
      {txns.map(tx => (
        <div key={tx.id} style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={s.txid}>{tx.id.slice(0, 16)}…</span>
            <span style={s.meta}>{new Date(tx.created_at).toLocaleString()}</span>
          </div>
          <div style={s.meta}>Fee: {tx.fee_charged} stroops · Ledger: {tx.ledger}</div>
          <a href={`https://stellar.expert/explorer/testnet/tx/${tx.id}`} target="_blank" rel="noopener noreferrer" style={s.link}>View on Stellar Expert →</a>
        </div>
      ))}
    </div>
  );
}
