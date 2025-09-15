import { Link } from 'react-router-dom'

function Tab({ to, label, active, children }) {
  return (
    <Link className={`tablink ${active ? 'active' : ''}`} to={to}>
      <span aria-hidden="true">{children}</span>
      <span>{label}</span>
    </Link>
  )
}

export default function BottomBar({ activePath }) {
  return (
    <nav className="bottombar" aria-label="Primary">
      <Tab to="/" label="Home" active={activePath === '/'}>
        {/* Home icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Tab>

      <Tab to="/barcodes" label="Barcodes" active={activePath.startsWith('/barcodes')}>
        {/* Barcode icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 6v12M7 6v12M10 6v12M12 6v12M14 6v12M17 6v12M20 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </Tab>

      <Tab to="/search" label="Search" active={activePath.startsWith('/search')}>
        {/* Search icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </Tab>
    </nav>
  )
}