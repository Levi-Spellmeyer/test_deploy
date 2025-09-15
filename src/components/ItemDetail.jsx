import { useParams, useNavigate } from 'react-router-dom'
import { useItems, adjustStock, setStock } from '../lib/store.js'
import { useMemo, useState } from 'react'

export default function ItemDetail(){
  const { id } = useParams()
  const items = useItems()               // <-- subscribed; re-renders on updates from any tab
  const navigate = useNavigate()
  const item = useMemo(() => items.find(i => i.id === Number(id)) || null, [items, id])
  const [custom, setCustom] = useState(item?.stock ?? 0)

  if (!item) {
    return (
      <section className="panel">
        <h2 style={{marginTop:0}}>Item not found</h2>
        <button className="btn" onClick={()=>navigate('/inventory')}>Back to Inventory</button>
      </section>
    )
  }

  const status = item.stock === 0 ? 'Out'
    : item.stock <= 10 ? 'Low'
    : 'In Stock'

  return (
    <section className="panel">
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12}}>
        <h2 style={{margin:0}}>{item.name}</h2>
        <button className="btn secondary" onClick={()=>navigate(-1)}>Back</button>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <div className="detail-title">Overview</div>
          <div className="detail-row"><span>SKU</span><b>{item.sku}</b></div>
          <div className="detail-row"><span>Category</span><b>{item.category}</b></div>
          <div className="detail-row"><span>Brand</span><b>{item.brand}</b></div>
          <div className="detail-row"><span>Price</span><b>${item.price.toFixed(2)}</b></div>
          <div className="detail-row"><span>Status</span>
            <b className={`badge ${status === 'Out' ? 'out' : status === 'Low' ? 'low' : 'good'}`}>{status}</b>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-title">Stock Controls</div>
          <div className="stock-controls">
            <button className="btn secondary" onClick={()=>adjustStock(item.id, -10)}>-10</button>
            <button className="btn secondary" onClick={()=>adjustStock(item.id, -1)}>-1</button>
            <div className="stock-display"><b>{item.stock}</b><span>units</span></div>
            <button className="btn secondary" onClick={()=>adjustStock(item.id, +1)}>+1</button>
            <button className="btn secondary" onClick={()=>adjustStock(item.id, +10)}>+10</button>
          </div>
          <div className="controls" style={{marginTop:10}}>
            <input className="input" type="number" min="0" value={custom}
                   onChange={e=>setCustom(e.target.value)} placeholder="Set stock…" />
            <button className="btn" onClick={()=>setStock(item.id, Number(custom))}>Set stock</button>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-title">Notes</div>
          <p style={{color:'var(--muted)'}}>
            Example space for item description, supplier, reorder threshold, and activity history.
            You can extend this with real fields from your backend.
          </p>
        </div>
      </div>
    </section>
  )
}