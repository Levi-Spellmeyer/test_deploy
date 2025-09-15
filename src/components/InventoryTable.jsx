export default function InventoryTable({ data, sort, onSort, onAdjust, onRowClick }){
  const Col = ({label, accessor, className}) => (
    <th
      className={className ? `col-${className}` : undefined}
      onClick={()=>onSort(accessor)}
      style={{cursor:'pointer', userSelect:'none'}}
    >
      {label} {sort.key === accessor ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
    </th>
  )

  const badge = (stock) => {
    if (stock === 0) return <span className="badge out status-badge">Out</span>
    if (stock <= 10) return <span className="badge low status-badge">Low</span>
    return <span className="badge good status-badge">In Stock</span>
  }

  return (
    <table>
      <thead>
        <tr>
          <Col label="Name" accessor="name" className="name" />
          <Col label="SKU" accessor="sku" className="sku" />
          <Col label="Category" accessor="category" className="category" />
          <Col label="Brand" accessor="brand" className="brand" />
          <Col label="Price" accessor="price" className="price" />
          <Col label="Stock" accessor="stock" className="stock" />
          <th className="col-status">Status</th>
          <th className="col-actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row=>(
          <tr
            key={row.id}
            style={{cursor: onRowClick ? 'pointer' : 'default'}}
            onClick={() => onRowClick && onRowClick(row)}
          >
            <td className="col-name" style={{fontWeight:600}}>{row.name}</td>
            <td className="col-sku" style={{opacity:.9}}>{row.sku}</td>
            <td className="col-category">{row.category}</td>
            <td className="col-brand">{row.brand}</td>
            <td className="col-price">${row.price.toFixed(2)}</td>
            <td className="col-stock">{row.stock}</td>
            <td className="col-status">{badge(row.stock)}</td>
            <td className="col-actions" onClick={(e)=>e.stopPropagation()}>
              <div className="actions">
                <button className="btn secondary btn-compact" onClick={() => onAdjust(row.id, -1)}>-1</button>
                <button className="btn secondary btn-compact" onClick={() => onAdjust(row.id, +1)}>+1</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}