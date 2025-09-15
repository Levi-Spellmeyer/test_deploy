import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useItems, adjustStock, addItem } from '../lib/store.js'
import InventoryTable from './InventoryTable.jsx'

const ALL = 'All'

export default function Inventory(){
  const items = useItems()
  const navigate = useNavigate()
  const [demoRunning, setDemoRunning] = useState(false)

  // Add Item form state
  const [newItem, setNewItem] = useState({
    name: '',
    brand: '',
    category: '',
    price: '',
    stock: ''
  })

  const categories = useMemo(() => [ALL, ...Array.from(new Set(items.map(d => d.category)))], [items])
  const brands = useMemo(() => [ALL, ...Array.from(new Set(items.map(d => d.brand)))], [items])

  const [query, setQuery] = useState('')
  const [cat, setCat] = useState(ALL)
  const [brand, setBrand] = useState(ALL)
  const [stockFilter, setStockFilter] = useState(ALL)
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' })
  const [page, setPage] = useState(1)
  const pageSize = 20

  /* Realtime demo: random stock nudge every 2s, broadcast to other tabs */
  useEffect(() => {
    if (!demoRunning) return
    const iv = setInterval(() => {
      if (!items.length) return
      const idx = Math.floor(Math.random() * items.length)
      const delta = Math.random() < 0.5 ? -1 : +1
      adjustStock(items[idx].id, delta, { broadcast: true })
    }, 2000)
    return () => clearInterval(iv)
  }, [demoRunning, items])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter(item => {
      if (cat !== ALL && item.category !== cat) return false
      if (brand !== ALL && item.brand !== brand) return false
      if (stockFilter !== ALL) {
        if (stockFilter === 'In Stock' && item.stock <= 0) return false
        if (stockFilter === 'Low' && !(item.stock > 0 && item.stock <= 10)) return false
        if (stockFilter === 'Out' && item.stock !== 0) return false
      }
      if (!q) return true
      return (
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q)
      )
    })
  }, [items, query, cat, brand, stockFilter])

  const sorted = useMemo(() => {
    const out = [...filtered]
    out.sort((a,b)=>{
      const { key, dir } = sort
      let av = a[key], bv = b[key]
      if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase() }
      if (av < bv) return dir === 'asc' ? -1 : 1
      if (av > bv) return dir === 'asc' ? 1 : -1
      return 0
    })
    return out
  }, [filtered, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const pageData = useMemo(() => {
    const p = Math.min(page, totalPages)
    const start = (p - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, totalPages])

  function onSort(key){
    setPage(1)
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' })
  }
  function resetFilters(){
    setQuery(''); setCat(ALL); setBrand(ALL); setStockFilter(ALL); setSort({ key:'name', dir:'asc' }); setPage(1)
  }

  function submitNewItem(e){
    e.preventDefault()
    const payload = {
      name: newItem.name || 'Untitled',
      brand: newItem.brand || 'Acme',
      category: newItem.category || 'Toys',
      price: Number(newItem.price) || 9.99,
      stock: Number.isFinite(Number(newItem.stock)) ? Number(newItem.stock) : 0,
    }
    const created = addItem(payload, { broadcast: true })
    setNewItem({ name: '', brand: '', category: '', price: '', stock: '' })
    // jump to its detail page to show the new record
    navigate(`/inventory/${created.id}`)
  }

  return (
    <section className="panel">
      <div style={{display:'flex', alignItems:'center', gap:12, flexWrap:'wrap'}}>
        <h2 style={{margin:0}}>Inventory</h2>
        <span className="badge" title="Open in two tabs to see live sync">Realtime demo</span>
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          <button className={`btn ${demoRunning ? 'danger' : ''}`} onClick={() => setDemoRunning(v=>!v)}>
            {demoRunning ? 'Stop demo updates' : 'Start demo updates'}
          </button>
        </div>
      </div>

      {/* Add Item */}
      <form className="add-item" onSubmit={submitNewItem}>
        <div className="add-grid">
          <input className="input" placeholder="Name" value={newItem.name} onChange={e=>setNewItem(s=>({...s, name:e.target.value}))} />
          <input className="input" placeholder="Brand" value={newItem.brand} onChange={e=>setNewItem(s=>({...s, brand:e.target.value}))} />
          <input className="input" placeholder="Category" value={newItem.category} onChange={e=>setNewItem(s=>({...s, category:e.target.value}))} />
          <input className="input" placeholder="Price" type="number" min="0" step="0.01" value={newItem.price} onChange={e=>setNewItem(s=>({...s, price:e.target.value}))} />
          <input className="input" placeholder="Stock" type="number" min="0" value={newItem.stock} onChange={e=>setNewItem(s=>({...s, stock:e.target.value}))} />
          <button className="btn" type="submit">Add Item</button>
        </div>
      </form>

      {/* Filters */}
      <div className="controls" style={{marginTop:8}}>
        <input className="input" placeholder="Search name, SKU, brand…"
               value={query} onChange={e=>{ setQuery(e.target.value); setPage(1) }} />
        <select className="select" value={cat} onChange={e=>{ setCat(e.target.value); setPage(1) }}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="select" value={brand} onChange={e=>{ setBrand(e.target.value); setPage(1) }}>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select className="select" value={stockFilter} onChange={e=>{ setStockFilter(e.target.value); setPage(1) }}>
          {[ALL, 'In Stock', 'Low', 'Out'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="btn secondary" onClick={resetFilters}>Reset</button>
      </div>

      <div className="table-wrap">
        <InventoryTable
          data={pageData}
          sort={sort}
          onSort={onSort}
          onAdjust={(id, delta) => adjustStock(id, delta)}
          onRowClick={(row) => navigate(`/inventory/${row.id}`)}
        />
      </div>

      <div className="controls" style={{justifyContent:'space-between', marginTop:12}}>
        <div style={{color:'var(--muted)'}}>Showing <b>{pageData.length}</b> of <b>{sorted.length}</b> results</div>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <button className="btn secondary" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
          <span style={{minWidth:70, textAlign:'center'}}>Page {page} / {totalPages}</span>
          <button className="btn secondary" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</button>
        </div>
      </div>
    </section>
  )
}