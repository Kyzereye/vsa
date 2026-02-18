export function isImage(item) {
  const t = (item.fileType || "").toLowerCase();
  return t.startsWith("image/") || /\.(jpe?g|png|gif|webp)$/i.test(item.path || "");
}
