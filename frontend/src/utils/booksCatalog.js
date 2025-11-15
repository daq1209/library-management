// Single source of truth for book catalog
// Always returns an array of normalized book objects
let _cache = null;

function normalizeBook(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const id = raw._id ?? raw.id;
  if (id == null) return null;
  return {
    ...raw,
    _id: String(id),
  };
}

export async function getBooks() {
  if (_cache) return _cache;
  const res = await fetch('/books.json');
  const data = await res.json();
  const list = Array.isArray(data) ? data : (Array.isArray(data?.books) ? data.books : []);
  _cache = list.map(normalizeBook).filter(Boolean);
  return _cache;
}

export async function getBookById(id) {
  const books = await getBooks();
  const target = String(id);
  return books.find(b => String(b._id) === target) || null;
}

export function clearBooksCache() { _cache = null; }
