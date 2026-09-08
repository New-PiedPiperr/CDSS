import json

with open('public/rules/Hip Region.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print('Conditions:', len(data['conditions']))
for i, c in enumerate(data['conditions']):
    print(f'  {i+1}. {c["name"]} ({len(c["questions"])}q)')
