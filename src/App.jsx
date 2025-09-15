import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import TopBar from './components/TopBar.jsx'
import BottomBar from './components/BottomBar.jsx'
import Home from './components/Home.jsx'
import Inventory from './components/Inventory.jsx'
import Storage from './components/Storage.jsx'
import Barcodes from './components/Barcodes.jsx'
import Search from './components/Search.jsx'
import ItemDetail from './components/ItemDetail.jsx'

function getTitle(pathname) {
  if (pathname.startsWith('/inventory/')) return 'Item'
  if (pathname.startsWith('/inventory')) return 'Inventory'
  if (pathname.startsWith('/storage')) return 'Storage'
  if (pathname.startsWith('/barcodes')) return 'Barcodes'
  if (pathname.startsWith('/search')) return 'Search'
  return 'Home'
}

export default function App(){
  const location = useLocation()
  const title = getTitle(location.pathname)

  return (
    <div className="app-shell light-theme">
      <TopBar title={title} />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/:id" element={<ItemDetail />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/barcodes" element={<Barcodes />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomBar activePath={location.pathname} />
    </div>
  )
}