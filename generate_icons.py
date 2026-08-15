import json
import re
import os

with open('svgs_extracted.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

def clean_svg(svg_str, is_logo=False):
    # Remove outer <svg ...> and </svg>
    inner = re.sub(r'^<svg[^>]*>', '', svg_str)
    inner = re.sub(r'</svg>\s*$', '', inner)
    
    if is_logo:
        # Don't convert colors for the logo, preserve it exactly as supplied
        pass
    else:
        # For UI and tool icons, we adapt for dark/light mode
        # Replace white with currentColor
        inner = inner.replace('"white"', '"currentColor"')
        inner = inner.replace("'white'", "'currentColor'")
        # Replace rgba(0,0,0,0.3) with currentColor + opacity
        inner = inner.replace('fill="rgba(0,0,0,0.3)"', 'fill="currentColor" opacity="0.3"')
        inner = inner.replace("fill='rgba(0,0,0,0.3)'", 'fill="currentColor" opacity="0.3"')
        inner = inner.replace('stroke="rgba(0,0,0,0.3)"', 'stroke="currentColor" opacity="0.3"')

    return inner.strip()

# Generate the IconRegistry.tsx
out = []
out.append("import React from 'react';")
out.append("")
out.append("export interface IconProps extends React.SVGProps<SVGSVGElement> {")
out.append("  size?: number | string;")
out.append("}")
out.append("")
out.append("function BaseIcon({ children, size = 24, className = '', style, ...props }: IconProps & { children: React.ReactNode }) {")
out.append("  return (")
out.append("    <svg")
out.append('      viewBox="0 0 24 24"')
out.append("      width={size}")
out.append("      height={size}")
out.append("      className={className}")
out.append("      style={{ display: 'inline-block', flexShrink: 0, ...style }}")
out.append("      {...props}")
out.append("    >")
out.append("      {children}")
out.append("    </svg>")
out.append("  );")
out.append("}")
out.append("")

def add_icon(name, inner_svg, default_fill="currentColor", default_stroke="none", is_logo=False):
    extra_props = f'fill="{default_fill}" stroke="{default_stroke}"'
    if not is_logo and 'stroke-width=' not in inner_svg and default_stroke != 'none':
        extra_props += ' strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"'
        
    out.append(f'export function {name}(props: IconProps) {{')
    
    # We need to replace class= with className=
    jsx_inner = inner_svg.replace('class=', 'className=')
    jsx_inner = jsx_inner.replace('stroke-width', 'strokeWidth')
    jsx_inner = jsx_inner.replace('stroke-linecap', 'strokeLinecap')
    jsx_inner = jsx_inner.replace('stroke-dasharray', 'strokeDasharray')
    jsx_inner = jsx_inner.replace('stroke-linejoin', 'strokeLinejoin')
    jsx_inner = jsx_inner.replace('font-size', 'fontSize')
    jsx_inner = jsx_inner.replace('font-weight', 'fontWeight')
    jsx_inner = jsx_inner.replace('clip-path', 'clipPath')
    jsx_inner = jsx_inner.replace('fill-rule', 'fillRule')
    jsx_inner = jsx_inner.replace('clip-rule', 'clipRule')
    
    if default_stroke == 'currentColor':
        out.append(f'  return <BaseIcon fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {{...props}}>{jsx_inner}</BaseIcon>;')
    else:
        out.append(f'  return <BaseIcon fill="currentColor" stroke="none" {{...props}}>{jsx_inner}</BaseIcon>;')
    out.append('}')
    out.append('')

# TOOL ICONS
tools = data['toolicons.html']
add_icon('ImageCategoryIcon', clean_svg(tools[0]))
add_icon('PdfCategoryIcon', clean_svg(tools[1]))
add_icon('OtherCategoryIcon', clean_svg(tools[2]))
add_icon('CompressImageIcon', clean_svg(tools[3]))
add_icon('ResizeImageIcon', clean_svg(tools[4]))
add_icon('CropImageIcon', clean_svg(tools[5]))
add_icon('ConvertImageIcon', clean_svg(tools[6]))
add_icon('WebpIcon', clean_svg(tools[7]))
add_icon('ImageToPdfIcon', clean_svg(tools[8]))
add_icon('PdfToImagesIcon', clean_svg(tools[9]))
add_icon('MergePdfIcon', clean_svg(tools[10]))
add_icon('SplitPdfIcon', clean_svg(tools[11]))
add_icon('RotatePdfIcon', clean_svg(tools[12]))
add_icon('CompressPdfIcon', clean_svg(tools[13]))
add_icon('RemovePdfPagesIcon', clean_svg(tools[14]))
add_icon('PdfNumberingIcon', clean_svg(tools[15]))
add_icon('HeicIcon', clean_svg(tools[16]))
add_icon('PassportIcon', clean_svg(tools[17]))
add_icon('SignatureIcon', clean_svg(tools[18]))

# UI ICONS
ui = data['uinavicons.html']
ui_names = ['Home', 'Search', 'Menu', 'Back', 'Next', 'Sun', 'Moon', 'Upload', 'Folder', 'File', 'Files', 'Download', 'DownloadAll', 'Close', 'Reset', 'Settings', 'More', 'Delete', 'View', 'Success', 'Warning', 'Info', 'Error', 'Processing', 'MoveUp', 'MoveDown', 'DragHandle']

for i, name in enumerate(ui_names):
    svg = ui[i]
    is_stroke = 'class="stroke"' in svg
    cleaned = clean_svg(svg)
    add_icon(f'{name}Icon', cleaned, default_fill='none' if is_stroke else 'currentColor', default_stroke='currentColor' if is_stroke else 'none')

os.makedirs('src/components/icons', exist_ok=True)
with open('src/components/icons/IconRegistry.tsx', 'w', encoding='utf-8') as f:
    f.write('\\n'.join(out))
print("IconRegistry.tsx generated.")
