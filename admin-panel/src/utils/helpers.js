// Format paise to ₹ string  e.g. 29900 → "₹299"
export const formatPrice = (paise) =>
  '₹' + (paise / 100).toLocaleString('en-IN', { maximumFractionDigits: 0 })

// Format date  e.g. "2024-03-15" → "15 Mar 2024"
export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

// Status badge colour
export const statusColor = (s) => ({
  pending:     'bg-amber-500/15 text-amber-400',
  confirmed:   'bg-blue-500/15 text-blue-400',
  in_progress: 'bg-purple-500/15 text-purple-400',
  completed:   'bg-green-500/15 text-green-400',
  cancelled:   'bg-red-500/15 text-red-400',
})[s] || 'bg-white/10 text-white/60'

// Category label
export const categoryLabel = (c) => ({
  wash:       '🚿 Wash',
  detailing:  '✨ Detailing',
  coating:    '🛡 Coating',
  ppf:        '🎬 PPF',
})[c] || c
