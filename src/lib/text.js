export function shortLabel(name, max = 14) {
  if (name.length <= max) return name;
  const words = name.split(/\s+/);
  if (words.length === 1) return `${name.slice(0, max - 1)}…`;
  let out = words[0];
  for (const w of words.slice(1)) {
    if ((out + " " + w).length > max - 1) return `${out}…`;
    out += " " + w;
  }
  return out;
}
