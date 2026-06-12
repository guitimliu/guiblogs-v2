// Route params arrive percent-encoded for non-ASCII (CJK tag/category names)
// under static export; decode before comparing against display names.
export function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
