import json

json_path = r"public/rules/Cervical Region.json"

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for condition in data.get('conditions', []):
    name = condition.get('name')
    questions = condition.get('questions', [])
    
    if name == 'Cervical Disc Herniation':
        # Find cervical_q3 to remove it, and extract its info for entry_criteria
        condition['questions'] = [q for q in questions if q.get('id') != 'cervical_q3']
        condition['entry_criteria'] = [
            {
                "type": "age",
                "description": "Age (Below 40 years)"
            },
            {
                "type": "sex",
                "description": "Sex (Male)"
            }
        ]
        print(f"Updated Cervical Disc Herniation. Questions count: {len(condition['questions'])}")
        
    elif name == 'Cervical Spondylosis':
        # Find cervical_q17 to remove it, and extract its info for entry_criteria
        condition['questions'] = [q for q in questions if q.get('id') != 'cervical_q17']
        condition['entry_criteria'] = [
            {
                "type": "age",
                "description": "Age (Above 40 years)"
            },
            {
                "type": "sex",
                "description": "Sex (Female)"
            }
        ]
        print(f"Updated Cervical Spondylosis. Questions count: {len(condition['questions'])}")

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Cervical Region.json updated successfully.")
