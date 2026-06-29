export function parseList<T>(res: unknown): T[] {
  const data = (res as { data?: T[] })?.data ?? res;
  return Array.isArray(data) ? data : [];
}

export function parseData<T>(res: unknown): T | null {
  if (!res || typeof res !== 'object') return null;
  const wrapped = (res as { data?: T })?.data;
  return (wrapped ?? res) as T;
}
