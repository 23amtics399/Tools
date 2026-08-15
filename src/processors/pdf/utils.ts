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

/**
 * Gets the font size in points based on the selected option string.
 */
export function getFontSizeForOption(fontSizeOption: string): number {
  if (fontSizeOption === 'small') return 10;
  if (fontSizeOption === 'large') return 16;
  return 12; // medium
}

/**
 * Gets the margin in points based on the selected option string.
 */
export function getMarginForOption(marginOption: string): number {
  if (marginOption === 'small') return 15;
  if (marginOption === 'large') return 45;
  return 30; // medium
}

/**
 * Calculates the visual coordinates (vx, vy) for rendering text over a PDF page.
 * NOTE: The origin (0, 0) is at the BOTTOM-LEFT of the visual bounding box.
 * 
 * @param position The 3x3 position string (e.g. 'bottom-center', 'top-left')
 * @param visualW The visual width of the page in points
 * @param visualH The visual height of the page in points
 * @param textWidth The width of the text in points
 * @param textHeight The height of the text in points
 * @param margin The margin distance from edges in points
 * @returns The bottom-left origin coordinates { vx, vy } in points.
 */
export function calculateVisualPosition(
  position: string,
  visualW: number,
  visualH: number,
  textWidth: number,
  textHeight: number,
  margin: number,
  customPosition?: { x: number; y: number }
): { vx: number; vy: number } {
  let vx = 0;
  let vy = 0;
  
  if (position === 'custom' && customPosition) {
    // customPosition.x and customPosition.y are center point ratios (0 to 1) 
    // from the top-left visual corner (standard DOM coordinate system).
    // Convert to PDF coordinate system (bottom-left origin).
    const centerX = customPosition.x * visualW;
    const centerY = (1 - customPosition.y) * visualH;
    
    // Text drawing origin in PDF is bottom-left
    vx = centerX - (textWidth / 2);
    vy = centerY - (textHeight / 2);
    
    // Clamp to ensure the text stays completely inside the page boundaries
    const maxVx = visualW - textWidth;
    const maxVy = visualH - textHeight;
    vx = Math.max(0, Math.min(vx, maxVx));
    vy = Math.max(0, Math.min(vy, maxVy));
    
    return { vx, vy };
  }

  
  // Calculate X (from left)
  if (position.includes('left')) {
    vx = margin;
  } else if (position.includes('right')) {
    vx = visualW - margin - textWidth;
  } else { // center
    vx = (visualW - textWidth) / 2;
  }
  
  // Calculate Y (from bottom)
  if (position.includes('bottom')) {
    vy = margin;
  } else if (position.includes('top')) {
    vy = visualH - margin - textHeight;
  } else { // middle
    vy = (visualH - textHeight) / 2;
  }
  
  return { vx, vy };
}
