import re

with open('src/config/tools.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

current_id = None
new_lines = []

for line in lines:
    # Try to extract id: 'something'
    id_match = re.search(r"id:\s*'([^']+)'", line)
    if id_match:
        current_id = id_match.group(1)
        
    icon_match = re.search(r"icon:\s*'[^']+'", line)
    if icon_match and current_id:
        if current_id in ('image', 'pdf', 'other'):
            new_val = f"{current_id}-category"
        else:
            new_val = current_id
        
        # Replace only the icon value
        line = re.sub(r"icon:\s*'[^']+'", f"icon: '{new_val}'", line)
        
    new_lines.append(line)

with open('src/config/tools.ts', 'w', encoding='utf-8') as f:
    f.write("".join(new_lines))

print("tools.ts updated successfully")
