import json

json_path = r"public/rules/Lumbar Region.json"

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

modified_count = 0

# We need to remove the incorrect exclusions:
# 1. q1: "Radiates down one leg" -> excludes Sciatica
# 2. q1: "Radiates down both legs" -> excludes Cauda Equina Syndrome
# 3. q2: "Sudden" -> excludes Lumbar Disc Herniation
# 4. q6: "Yes" -> excludes Lumbar Disc Herniation, Cauda Equina Syndrome
# 5. q7: "Yes" -> excludes Cauda Equina Syndrome
# 6. q10: "Yes" -> excludes Cauda Equina Syndrome

target_questions = {
    'lumbar_q1': ['Radiates down one leg', 'Radiates down both legs'],
    'lumbar_q2': ['Sudden'],
    'lumbar_q6': ['Yes'],
    'lumbar_q7': ['Yes'],
    'lumbar_q10': ['Yes']
}

for condition in data.get('conditions', []):
    for question in condition.get('questions', []):
        qid = question.get('id')
        if qid in target_questions:
            target_vals = target_questions[qid]
            for arr_name in ('options', 'answers'):
                arr = question.get(arr_name)
                if not arr:
                    continue
                for opt in arr:
                    val = opt.get('value')
                    if val in target_vals:
                        effects = opt.get('effects', {})
                        if 'excludedConditions' in effects and len(effects['excludedConditions']) > 0:
                            print(f"Clearing excludedConditions for {qid} ('{val}'): was {effects['excludedConditions']}")
                            effects['excludedConditions'] = []
                            modified_count += 1

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Done. Modified {modified_count} fields.")
