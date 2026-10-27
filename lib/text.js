export function shorten(text, max = 80) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
