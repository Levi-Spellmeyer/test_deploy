import { Link } from 'react-router-dom'
import { useItems } from '../lib/store.js'

function Stat({ label, value, subtle }){
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {subtle && <div className="stat-subtle">{subtle}</div>}
    </div>
  )
}

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function IconBox({ children }) {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 12, display:'grid', placeItems:'center',
      background:'#ecfdf5', color:'var(--brand)', border:'1px solid var(--border)'
    }}>
      {children}
    </div>
  )
}

export default function Home(){
  const items = useItems()
  const total = items.length
  const inStock = items.filter(i => i.stock > 0).length
  const low = items.filter(i => i.stock > 0 && i.stock <= 10).length
  const out = items.filter(i => i.stock === 0).length

  const lowExamples = items.filter(i => i.stock > 0 && i.stock <= 3).slice(0,3)

  return (
    <section className="home-wrap">
      {/* Notifications Hub */}
      <div className="panel">
        <h2 style={{marginTop:0}}>Notifications</h2>
        <div className="stat-grid">
          <Stat label="Total Items" value={total} />
          <Stat label="In Stock" value={inStock} />
          <Stat label="Low Stock" value={low} subtle="≤ 10 units"/>
          <Stat label="Out of Stock" value={out} />
        </div>
        <div className="alerts">
          <div className="alerts-title">Alerts & Updates</div>
          {lowExamples.length === 0 ? (
            <div className="alert-line ok">No critical alerts right now.</div>
          ) : (
            lowExamples.map(x => (
              <div key={x.id} className="alert-line warn">
                <span className="dot warn"></span>
                <span><b>{x.name}</b> is very low (stock: {x.stock}).</span>
                <Link to={`/inventory/${x.id}`} className="alert-cta">Review</Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Landing Buttons */}
      <div className="panel">
        <h3 style={{marginTop:0}}>Quick Actions</h3>
        <div className="big-col">
          <Link to="/inventory" className="big-btn" aria-label="Go to Inventory">
            <IconBox>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 7l9-4 9 4-9 4-9-4zM3 7v6l9 4m9-10v6l-9 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </IconBox>
            <div>
              <div className="title">Inventory</div>
              <div className="subtitle">Browse, filter, update stock (with realtime demo).</div>
            </div>
            <Arrow />
          </Link>

          <Link to="/storage" className="big-btn" aria-label="Go to Storage">
            <IconBox>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 20V9l9-5 9 5v11M7 20v-6h10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </IconBox>
            <div>
              <div className="title">Storage</div>
              <div className="subtitle">Bins, shelves, and locations.</div>
            </div>
            <Arrow />
          </Link>

          <Link to="/barcodes" className="big-btn" aria-label="Go to Barcodes">
            <IconBox>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 6v12M7 6v12M10 6v12M12 6v12M14 6v12M17 6v12M20 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </IconBox>
            <div>
              <div className="title">Barcodes</div>
              <div className="subtitle">Scan or generate labels.</div>
            </div>
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  )
}