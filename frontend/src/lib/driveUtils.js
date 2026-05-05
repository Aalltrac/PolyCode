export function extractDriveFileId(url) {
  if (!url) return null;
  const trimmed = String(url).trim();
  // Already an ID (no slash, no protocol)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return trimmed;

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m && m[1]) return m[1];
  }
  return null;
}

export function buildDrivePreviewUrl(driveLinkOrId) {
  const id = extractDriveFileId(driveLinkOrId);
  if (!id) return null;
  return `https://drive.google.com/file/d/${id}/preview`;
}
