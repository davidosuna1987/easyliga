export const MAX_FILE_SIZE = 5

export const humanFileSize = (bytes: number) =>
  bytes > 1000000
    ? Math.round((bytes / 1000000) * 10) / 10 + ' MB'
    : Math.round((bytes / 1000) * 10) / 10 + ' KB'

export const humanFileSizeBig = (bytes: number, si = true) => {
  const thresh = si ? 1000 : 1024
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`
  }
  const units = si
    ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  let u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return `${bytes.toFixed(1)} ${units[u]}`
}
