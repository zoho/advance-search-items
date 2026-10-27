// Default table columns. show = visible until a saved preference is loaded.
const columns = [
  { key: 'name', label: 'Item Name', show: true },
  { key: 'sku', label: 'SKU', show: true },
  { key: 'description', label: 'Description', show: false },
  { key: 'ean', label: 'EAN', show: false },
  { key: 'upc', label: 'UPC', show: false },
  { key: 'part_number', label: 'MPN', show: false },
  { key: 'isbn', label: 'ISBN', show: false },
  { key: 'rate', label: 'Rate', show: true },
  { key: 'purchase_rate', label: 'Purchase Rate', show: true },
  { key: 'status', label: 'Status', show: true },
  { key: 'stock_on_hand', label: 'Stock', show: true },
  { key: 'unit', label: 'Unit', show: true },
  { key: 'item_type_formatted', label: 'Item type', show: false }
];

export default columns;
