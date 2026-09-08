import json

json_path = r"public/rules/Shoulder Region.json"

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for condition in data.get('conditions', []):
    print(f"\nCondition: {condition.get('name')}")
    for q in condition.get('questions', []):
        qid = q.get('id')
        text = q.get('questionText', q.get('question'))
        
        opt_info = []
        for opt in q.get('options', []):
            val = opt.get('value')
            effects = opt.get('effects', {})
            color = effects.get('optionColor')
            excl = effects.get('excludedConditions')
            trig = effects.get('triggeredConditions')
            inc = effects.get('increaseLikelihood')
            dec = effects.get('decreaseLikelihood')
            term = effects.get('terminateAssessment')
            notes = effects.get('notes')
            
            eff_strs = []
            if color: eff_strs.append(f"color:{color}")
            if excl: eff_strs.append(f"excl:{excl}")
            if trig: eff_strs.append(f"trig:{trig}")
            if inc: eff_strs.append(f"inc:{inc}")
            if dec: eff_strs.append(f"dec:{dec}")
            if term: eff_strs.append(f"term:{term}")
            if notes: eff_strs.append(f"notes:{notes}")
            
            opt_info.append(f"{val} ({', '.join(eff_strs)})")
            
        print(f"  {qid}: {text} -> {', '.join(opt_info)}")
