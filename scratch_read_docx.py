import zipfile
import xml.etree.ElementTree as ET

docx_path = r"public/rules/Cervical Region.docx"

with zipfile.ZipFile(docx_path) as z:
    xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)

ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

# Print paragraphs and tables
for child in root.iter():
    if child.tag.endswith('p'):
        text = "".join([t.text for t in child.findall('.//w:t', ns) if t.text])
        if text.strip():
            print(f"P: {text}")
    elif child.tag.endswith('tbl'):
        print("\n[TABLE START]")
        for row in child.findall('.//w:tr', ns):
            cells = []
            for cell in row.findall('.//w:tc', ns):
                cell_text = "".join([t.text for t in cell.findall('.//w:t', ns) if t.text])
                cells.append(cell_text.strip())
            print(f"  ROW: {cells}")
        print("[TABLE END]\n")
