import { generateInventory } from '../data/mockInventory.js'
import { realtimeBus } from './realtime.js'

const LS_KEY = 'inv:items'
let items = loadItems() || generateInventory(400, 1337)
const listeners = new Set()

function loadItems(){
  try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null') } catch { return null }
}
function saveItems(){
  localStorage.setItem(LS_KEY, JSON.stringify(items))
}
function notify(){
  for (const fn of listeners) fn(items)
}

export function subscribe(fn){
  listeners.add(fn)
  return () => listeners.delete(fn)
}
export function getItems(){ return items }
export function getItemById(id){ return items.find(i => i.id === Number(id)) || null }

function clampStock(n){ return Math.max(0, Math.floor(n)) }

function applyPatch(patch){
  const { id } = patch
  items = items.map(it => {
    if (it.id !== id) return it
    const nextStock = typeof patch.delta === 'number'
      ? clampStock((it.stock ?? 0) + patch.delta)
      : clampStock(patch.stock ?? it.stock)
    return { ...it, stock: nextStock }
  })
  saveItems()
  notify()
}

function applyAdd(newItem){
  // ensure unique id
  const maxId = items.reduce((m, it) => Math.max(m, it.id), 0)
  const id = newItem.id ?? maxId + 1
  const item = {
    id,
    name: newItem.name || 'New Item',
    brand: newItem.brand || 'Acme',
    category: newItem.category || 'Toys',
    price: Number.isFinite(newItem.price) ? Number(newItem.price) : 9.99,
    stock: clampStock(newItem.stock ?? 0),
    sku: newItem.sku || generateSku(newItem.brand || 'Acme', newItem.category || 'Toys', id)
  }
  items = [...items, item]
  saveItems()
  notify()
  return item
}

function generateSku(brand, category, id){
  return `${brand.slice(0,3).toUpperCase()}-${category.slice(0,2).toUpperCase()}-${String(id).padStart(4,'0')}`
}

/* Public API */
export function adjustStock(id, delta, { broadcast = true } = {}){
  applyPatch({ id, delta })
  if (broadcast) realtimeBus.send('patch', { id, delta })
}

export function setStock(id, stock, { broadcast = true } = {}){
  applyPatch({ id, stock })
  if (broadcast) realtimeBus.send('patch', { id, stock })
}

export function addItem(partialItem, { broadcast = true } = {}){
  const created = applyAdd(partialItem)
  if (broadcast) realtimeBus.send('add', { item: created })
  return created
}

/* React hooks */
import { useEffect, useState } from 'react'
export function useItems(){
  const [state, setState] = useState(items)
  useEffect(() => subscribe(setState), [])
  return state
}

/* Realtime listeners from other tabs */
realtimeBus.on((msg) => {
  if (msg.type === 'patch') {
    applyPatch({ ...msg.data })
  } else if (msg.type === 'add') {
    // trust sender's payload to keep IDs identical across tabs
    const exists = items.some(i => i.id === msg.data?.item?.id)
    if (!exists && msg.data?.item) {
      items = [...items, msg.data.item]
      saveItems()
      notify()
    }
  }
})