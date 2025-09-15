import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function TopBar({ title }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <header className="topbar">
        <button className="topbar-btn" aria-label="Open menu" onClick={() => setOpen(true)}>
          {/* Hamburger icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="topbar-title">{title}</div>
        <div aria-hidden="true" />
      </header>

      {/* Drawer */}
      <div className={`drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="drawer-backdrop" onClick={() => setOpen(false)} />
        <div className="drawer-panel" onClick={(e)=>e.stopPropagation()}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div className="drawer-title">Menu</div>
            <button className="topbar-btn" aria-label="Close menu" onClick={() => setOpen(false)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>

          <div className="drawer-section">Navigate</div>
          <Link className="drawer-link" to="/" onClick={()=>setOpen(false)}>Home</Link>
          <Link className="drawer-link" to="/inventory" onClick={()=>setOpen(false)}>Inventory</Link>
          <Link className="drawer-link" to="/storage" onClick={()=>setOpen(false)}>Storage</Link>
          <Link className="drawer-link" to="/barcodes" onClick={()=>setOpen(false)}>Barcodes</Link>
          <Link className="drawer-link" to="/search" onClick={()=>setOpen(false)}>Search</Link>

          <div className="drawer-section" style={{marginTop:18}}>Actions</div>
          <a className="drawer-link" href="https://react.dev" target="_blank" rel="noreferrer">Learn React</a>
        </div>
      </div>
    </>
  )
}