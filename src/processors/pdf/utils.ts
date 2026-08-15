/**
 * Shared utility functions for PDF processors.
 */

/**
 * Parses a page range string like "1-3, 5, 8-10" into an array of 1-based page numbers.
 * 
 * Rules:
 * - Empty, blank, or "all" -> returns all pages.
 * - Valid ranges (e.g. "1-3", "5") -> returns unique selected pages.
 * - Invalid characters, 0, or pages out of bounds -> throws an Error.
 * - Reversed ranges (e.g. "5-2") -> throws an Error to prevent unexpected behavior.
 * 
 * @param rangesStr The input string from the user.
 * @param totalPages The total number of pages in the PDF.
 * @returns An array of 1-based page numbers.
 * @throws Error if the range is invalid or out of bounds.
 */
export function parseRanges(rangesStr: string, totalPages: number): number[] {
  const str = rangesStr.trim().toLowerCase();
  
  if (!str || str === 'all') {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: number[] = [];
  const parts = str.split(',').map(p => p.trim()).filter(Boolean);

  if (parts.length === 0) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  for (const part of parts) {
    // Check for invalid characters (only digits and hyphens allowed)
    if (!/^\d+(-\d+)?$/.test(part)) {
      throw new Error(`Invalid page range format: "${part}". Please use numbers and hyphens (e.g., 1-3, 5).`);
    }

    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      
      if (isNaN(start) || isNaN(end)) {
        throw new Error(`Invalid range: "${part}".`);
      }

      if (start <= 0 || end <= 0) {
        throw new Error(`Page numbers must be greater than 0: "${part}".`);
      }

      if (start > totalPages || end > totalPages) {
        throw new Error(`Page number out of bounds in range "${part}". The PDF only has ${totalPages} pages.`);
      }

      if (start > end) {
        throw new Error(`Invalid range: "${part}". Start page must be less than or equal to end page.`);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    } else {
      const page = parseInt(part, 10);
      if (isNaN(page)) {
        throw new Error(`Invalid page number: "${part}".`);
      }

      if (page <= 0) {
        throw new Error(`Page numbers must be greater than 0: "${part}".`);
      }

      if (page > totalPages) {
        throw new Error(`Page number ${page} is out of bounds. The PDF only has ${totalPages} pages.`);
      }

      pages.push(page);
    }
  }
  
  // Return unique pages preserving requested order
  const uniquePages = Array.from(new Set(pages));
  
  if (uniquePages.length === 0) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  return uniquePages;
}

/**
 * Converts a set or array of 0-indexed page numbers into a compressed 1-indexed range string.
 * Example: [0, 1, 2, 4, 6, 7] -> "1-3, 5, 7-8"
 * 
 * @param pageIndices Array or Set of 0-indexed page numbers
 * @returns A formatted string of ranges
 */
export function stringifyRanges(pageIndices: Iterable<number>): string {
  const sorted = Array.from(pageIndices).sort((a, b) => a - b);
  if (sorted.length === 0) return "";

  const ranges: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      if (start === end) {
        ranges.push(`${start + 1}`);
      } else {
        ranges.push(`${start + 1}-${end + 1}`);
      }
      start = sorted[i];
      end = sorted[i];
    }
  }

  // Handle the last range
  if (start === end) {
    ranges.push(`${start + 1}`);
  } else {
    ranges.push(`${start + 1}-${end + 1}`);
  }

  return ranges.join(", ");
}
