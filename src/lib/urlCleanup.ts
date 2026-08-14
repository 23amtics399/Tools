export function revokeUrl(url: string | null | undefined): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

export function revokeUrls(urls: (string | null | undefined)[]): void {
  urls.forEach(revokeUrl);
}

export function createManagedUrl(blob: Blob): { url: string; revoke: () => void } {
  const url = URL.createObjectURL(blob);
  return {
    url,
    revoke: () => revokeUrl(url)
  };
}
