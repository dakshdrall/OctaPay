import { useEffect, useState } from "react";

const WALLETS = [
  { name: "Rahul", address: "GBFNQL377LPLSEDR3BMHVS4ZQ3IWPTBZESI2LRXI3H6T7INGSDJCVBIF" },
  { name: "Priya", address: "GDRQG5IVUHOS46RM4PAPCFF7TMYLQ3AHWC63UABMW4VJOMBXDF36XFCM" },
  { name: "Arjun", address: "GDAZVM5TXYSKWOPRDQ77Z7XDKWHODTFAFTT2ECK63KLUXPTLTVHOKCI6" },
  { name: "Sneha", address: "GCSRPWQUFP7EZKSMRYQTCOMZBLEAVTYRWQJDESBDYQFHG5GUEZPTZFFF" },
  { name: "Karan", address: "GCTWLP274QCAJRYTPKMAWAHS6HE2PDKAWNHXW2HBYIRTINGJ6ZGGQFFP" },
];
const HORIZON = "https://horizon-testnet.stellar.org";
const short = h => h ? h.slice(0,12)+'...'+h.slice(-6) : '—';

export default function Explorer() {
  const [selected, setSelected] = useState(WALLETS[0]);
  const [txns, setTxns] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true); setError(null); setTxns([]); setAccount(null);
    Promise.all([
      fetch(`${HORIZON}/accounts/${selected.address}`).then(r => r.json()),
      fetch(`${HORIZON}/accounts/${selected.address}/transactions?limit=10&order=desc`).then(r => r.json()),
    ]).then(([acc, txData]) => { setAccount(acc); setTxns(txData._embedded?.records || []); })
      .catch(() => setError("Could not fetch from Horizon testnet"))
      .finally(() => setLoading(false));
  }, [selected]);

  const xlmBal = account?.balances?.find(b => b.asset_type === 'native')?.balance;
  const usdcBal = account?.balances?.find(b => b.asset_code === 'USDC')?.balance;
  const cyan = 'var(--color-cyan)', surface = 'var(--color-surface)', surface2 = 'var(--color-surface-2)', muted = 'var(--text-muted)', mono = 'var(--font-mono)';

  return (
    <div style={{ padding: '2rem', fontFamily: 'var(--font-display)', maxWidth: '900px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: cyan, marginBottom: '0.4rem' }}>Explorer</h1>
      <p style={{ fontSize: '0.875rem', color: muted, marginBottom: '2rem', fontFamily: mono }}>Live Stellar testnet data via Horizon API</p>

      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {WALLETS.map(w => (
          <button key={w.address} onClick={() => setSelected(w)} style={{ padding: '0.5rem 1.25rem', borderRadius: '999px', cursor: 'pointer', fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: '0.875rem', transition: 'all 0.2s', border: `1px solid ${selected.address===w.address ? cyan : surface2}`, background: selected.address===w.address ? cyan : surface, color: selected.address===w.address ? 'var(--color-bg)' : 'var(--color-text)' }}>{w.name}</button>
        ))}
      </div>

      <div style={{ fontFamily: mono, fontSize: '0.75rem', color: muted, marginBottom: '1.5rem', padding: '0.75rem 1rem', background: surface, border: `1px solid ${surface2}`, borderRadius: '10px', wordBreak: 'break-all' }}>{selected.address}</div>

      {account && !loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[['XLM Balance', xlmBal ? parseFloat(xlmBal).toFixed(2)+' XLM' : '—'], ['USDC Balance', usdcBal ? parseFloat(usdcBal).toFixed(2)+' USDC' : '0.00 USDC'], ['Sequence', account.sequence ? '#'+account.sequence.slice(-6) : '—']].map(([label, value]) => (
            <div key={label} style={{ background: surface, border: `1px solid ${surface2}`, borderRadius: '12px', padding: '1rem 1.25rem' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{label}</div>
              <div style={{ fontSize: '1.1rem', fontFamily: mono, color: cyan, fontWeight: 500 }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {loading && <p style={{ color: muted, fontFamily: mono, fontSize: '0.875rem' }}>Fetching from Horizon...</p>}
      {error && <p style={{ color: '#f87171' }}>{error}</p>}
      {!loading && !error && txns.length === 0 && <p style={{ color: muted }}>No transactions found.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {txns.map((tx, i) => (
          <div key={tx.id} style={{ background: surface, border: `1px solid ${surface2}`, borderRadius: '12px', padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(0,255,255,0.08)', color: cyan, fontFamily: mono, border: '1px solid rgba(0,255,255,0.15)' }}>TX {i+1}</span>
                <span style={{ fontFamily: mono, fontSize: '0.8rem', color: cyan }}>{short(tx.id)}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: muted, fontFamily: mono }}>{new Date(tx.created_at).toLocaleString()}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {[['Fee', tx.fee_charged+' stroops'], ['Ledger', '#'+tx.ledger], ['Operations', tx.operation_count+' op'+(tx.operation_count!==1?'s':'')]].map(([label,value]) => (
                <div key={label}>
                  <div style={{ fontSize: '0.6rem', color: muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{label}</div>
                  <div style={{ fontSize: '0.8rem', fontFamily: mono, color: 'var(--color-text)' }}>{value}</div>
                </div>
              ))}
            </div>
            <a href={`https://stellar.expert/explorer/testnet/tx/${tx.id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: cyan, textDecoration: 'none', opacity: 0.85 }}>View on Stellar Expert →</a>
          </div>
        ))}
      </div>
    </div>
  );
}
