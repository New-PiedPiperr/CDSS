import zipfile
import xml.etree.ElementTree as ET

docx_path = r"public/rules/Shoulder Region.docx"
output_path = r"scratch/shoulder_docx_extracted.txt"

with zipfile.ZipFile(docx_path) as z:
    xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)

ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

lines = []
lines.append("--- SHOULDERS DOCX CONTENT ---")

for child in root.iter():
    if child.tag.endswith('p'):
        runs = []
        for run in child.findall('.//w:r', ns):
            color_elem = run.find('.//w:color', ns)
            color_val = color_elem.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val') if color_elem is not None else None
            
            run_text = "".join([t.text for t in run.findall('.//w:t', ns) if t.text])
            if color_val == 'FF0000':
                runs.append(f"<{run_text}>[RED]")
            else:
                runs.append(run_text)
        
        text = "".join(runs)
        if text.strip():
            lines.append(f"P: {text}")
            
    elif child.tag.endswith('tbl'):
        lines.append("\n[TABLE START]")
        for row in child.findall('.//w:tr', ns):
            cells = []
            for cell in row.findall('.//w:tc', ns):
                cell_runs = []
                for run in cell.findall('.//w:r', ns):
                    color_elem = run.find('.//w:color', ns)
                    color_val = color_elem.get('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}val') if color_elem is not None else None
                    run_text = "".join([t.text for t in run.findall('.//w:t', ns) if t.text])
                    if color_val == 'FF0000':
                        cell_runs.append(f"<{run_text}>[RED]")
                    else:
                        cell_runs.append(run_text)
                cells.append("".join(cell_runs).strip())
            lines.append(f"  ROW: {cells}")
        lines.append("[TABLE END]\n")

with open(output_path, 'w', encoding='utf-8') as f:
    f.write("\n".join(lines))

print("Shoulder DOCX extracted successfully to:", output_path)
