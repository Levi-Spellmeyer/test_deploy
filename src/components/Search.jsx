import { useState } from 'react'

export default function Search(){
  const [q, setQ] = useState('')
  return (
    <section className="panel">
      <h2 style={{marginTop:0}}>Search</h2>
      <div className="controls">
        <input
          className="input"
          placeholder="Search across the app…"
          value={q}
          onChange={e=>setQ(e.target.value)}
        />
        <button className="btn">Search</button>
      </div>
      <p style={{color:'var(--muted)'}}>
        This is a placeholder for global search. In a real app, this would query inventory, storage locations, and more.
      </p>
    </section>
  )
}