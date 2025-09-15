// Deterministic mock inventory
const categories = ["Toys", "Electronics", "Apparel", "Home", "Sports", "Books"]
const brands = ["Acme", "Nimbus", "Flux", "Orion", "Zephyr", "Atlas"]
const adjectives = ["Ultra", "Mini", "Pro", "Lite", "Max", "Eco", "Smart"]
const items = ["Robot", "Headphones", "Hoodie", "Lamp", "Ball", "Novel", "Drone", "Backpack", "Bottle", "Keyboard"]

function seededRand(seed) {
  // simple LCG for repeatability
  let s = seed % 2147483647
  return () => (s = (s * 48271) % 2147483647) / 2147483647
}

export function generateInventory(count = 250, seed = 42) {
  const rand = seededRand(seed)
  const data = []
  for (let i = 1; i <= count; i++) {
    const c = categories[Math.floor(rand() * categories.length)]
    const b = brands[Math.floor(rand() * brands.length)]
    const name = `${adjectives[Math.floor(rand()*adjectives.length)]} ${items[Math.floor(rand()*items.length)]}`
    const price = +(Math.floor(rand() * 30000) / 100 + 4.99).toFixed(2)
    const stock = Math.floor(rand() * 150)
    const sku = `${b.slice(0,3).toUpperCase()}-${c.slice(0,2).toUpperCase()}-${String(i).padStart(4,'0')}`
    data.push({
      id: i,
      name,
      brand: b,
      category: c,
      price,
      stock,
      sku
    })
  }
  return data
}