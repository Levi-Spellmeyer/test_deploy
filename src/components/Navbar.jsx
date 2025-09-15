import { Link } from 'react-router-dom'

export default function Navbar({ activePath }) {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="brand">
          <div className="logo" />
          <span className="name">Inventory<span style={{color:'var(--brand)'}}>React</span></span>
        </div>
        <div className="nav-links">
          <Link className={`nav-link ${activePath === '/' ? 'active' : ''}`} to="/">Home</Link>
          <Link className={`nav-link ${activePath.startsWith('/inventory') ? 'active' : ''}`} to="/inventory">Inventory</Link>
        </div>
      </div>
    </nav>
  )
}