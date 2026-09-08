import json

json_path = r"public/rules/Shoulder Region.json"

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Helper function to create options/answers list with options val and color
def make_yes_no_options(yes_color=None, yes_effects=None):
    if yes_effects is None:
        yes_effects = {}
    
    yes_eff = {
        "nextQuestionId": None,
        "skipToQuestionId": None,
        "triggeredConditions": [],
        "excludedConditions": [],
        "increaseLikelihood": [],
        "decreaseLikelihood": [],
        "redFlag": False,
        "redFlagText": None,
        "terminateAssessment": False,
        "notes": None,
        **yes_effects
    }
    
    if yes_color:
        yes_eff["optionColor"] = yes_color
        
    no_eff = {
        "nextQuestionId": None,
        "skipToQuestionId": None,
        "triggeredConditions": [],
        "excludedConditions": [],
        "increaseLikelihood": [],
        "decreaseLikelihood": [],
        "redFlag": False,
        "redFlagText": None,
        "terminateAssessment": False,
        "notes": None
    }
    
    opts = [
        {"value": "Yes", "effects": yes_eff},
        {"value": "No", "effects": no_eff}
    ]
    return opts

# 1. Process conditions
for condition in data.get('conditions', []):
    cond_name = condition.get('name')
    new_questions = []
    
    for q in condition.get('questions', []):
        qid = q.get('id')
        
        # Initial Assessment
        if cond_name == 'Initial Assessment':
            if qid == 'shoulder_q2':
                # Yes is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'Yes':
                            o['effects']['optionColor'] = 'red'
            elif qid == 'shoulder_q10':
                # Remove Objective option
                q['options'] = [o for o in q['options'] if o['value'] != 'Objective']
                q['answers'] = [a for a in q['answers'] if a['value'] != 'Objective']
            elif qid == 'shoulder_q11':
                # Fix alignment value parity
                for o in q.get('options', []):
                    if o['value'] == 'Yes, If sagging':
                        o['value'] = 'If sagging'
            
        # Shoulder Impingement Syndrome
        elif cond_name == 'Shoulder Impingement Syndrome':
            if qid == 'shoulder_q15':
                # Neck and shoulder / Shoulder red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] in ('Neck and shoulder region', 'Shoulder'):
                            o['effects']['optionColor'] = 'red'
            elif qid == 'shoulder_q16':
                # No is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'No':
                            o['effects']['optionColor'] = 'red'
            elif qid == 'shoulder_q17':
                # Sharp/pinching is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'Sharp or pinching':
                            o['effects']['optionColor'] = 'red'
            elif qid == 'shoulder_q20':
                # Yes is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'Yes':
                            o['effects']['optionColor'] = 'red'
            elif qid == 'shoulder_q21':
                # Yes is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'Yes':
                            o['effects']['optionColor'] = 'red'
            elif qid == 'shoulder_q22':
                # Active/Both are red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] in ('Active', 'Both'):
                            o['effects']['optionColor'] = 'red'
            elif qid == 'shoulder_q23':
                # Yes is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'Yes':
                            o['effects']['optionColor'] = 'red'
                            
        # Subacute tendinitis OR Painfularc syndrome
        elif cond_name == 'Subacute tendinitis OR Painfularc syndrome':
            if qid == 'shoulder_q24':
                # Yes is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'Yes':
                            o['effects']['optionColor'] = 'red'
                            
        # Chronic Tendinitis
        elif cond_name == 'Chronic Tendinitis':
            if qid == 'shoulder_q26':
                # Yes is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'Yes':
                            o['effects']['optionColor'] = 'red'
            elif qid == 'shoulder_q27':
                # Yes is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'Yes':
                            o['effects']['optionColor'] = 'red'
                            
        # Cuff Disruption
        elif cond_name == 'Cuff Disruption':
            if qid == 'shoulder_q29':
                # Yes is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'Yes':
                            o['effects']['optionColor'] = 'red'
            elif qid == 'shoulder_q30':
                # Remove 14 fabricated options, leave only Yes (red)/No
                q['options'] = make_yes_no_options('red')
                q['answers'] = make_yes_no_options('red')
                
        # CALCIFIC TENDINITIS
        elif cond_name == 'CALCIFIC TENDINITIS':
            if qid == 'shoulder_q31':
                # Dull/aching is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'Dull and aching':
                            o['effects']['optionColor'] = 'red'
            elif qid == 'shoulder_q32':
                # Gradual is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'Gradual':
                            o['effects']['optionColor'] = 'red'
            elif qid == 'shoulder_q33':
                # Keep only Yes/No (remove trailing combined options)
                q['options'] = make_yes_no_options('red')
                q['answers'] = make_yes_no_options('red')
                
                # We need to insert the new night pain question after this!
                new_questions.append(q)
                
                q_night = {
                    "id": "shoulder_q33_b",
                    "questionText": "Do you experience pain more at night?",
                    "question": "Do you experience pain more at night?",
                    "condition": "CALCIFIC TENDINITIS",
                    "category": "general",
                    "inputType": "select",
                    "source_line": 168,
                    "isGating": False,
                    "requiredConditions": [],
                    "excludedIfConditions": [],
                    "options": make_yes_no_options('red'),
                    "answers": make_yes_no_options('red')
                }
                new_questions.append(q_night)
                continue
            elif qid == 'shoulder_q34':
                # No is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'No':
                            o['effects']['optionColor'] = 'red'
            elif qid == 'shoulder_q35':
                # Yes confirms CALCIFIC TENDINITIS and terminates
                q['options'] = make_yes_no_options(yes_effects={
                    "terminateAssessment": True,
                    "triggeredConditions": ["CALCIFIC TENDINITIS"]
                })
                q['answers'] = make_yes_no_options(yes_effects={
                    "terminateAssessment": True,
                    "triggeredConditions": ["CALCIFIC TENDINITIS"]
                })
                
        # RECURRENT SHOULDER SUBLUXATION
        elif cond_name == 'RECURRENT SHOULDER SUBLUXATION':
            if qid == 'shoulder_q36':
                # Yes is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'Yes':
                            o['effects']['optionColor'] = 'red'
            elif qid == 'shoulder_q37':
                # Yes is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'Yes':
                            o['effects']['optionColor'] = 'red'
            elif qid == 'shoulder_q38':
                # Remove 5 fabricated options, leave only Yes (red)/No
                q['options'] = make_yes_no_options('red')
                q['answers'] = make_yes_no_options('red')
                
        # RHEUMATOID ARTHRITIS
        elif cond_name == 'RHEUMATOID ARTHRITIS':
            if qid in ('shoulder_q39', 'shoulder_q40', 'shoulder_q41', 'shoulder_q43', 'shoulder_q44', 'shoulder_q45'):
                # Yes is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'Yes':
                            o['effects']['optionColor'] = 'red'
                            
        # OSTEOARTHRITIS
        elif cond_name == 'OSTEOARTHRITIS':
            if qid in ('shoulder_q46', 'shoulder_q47', 'shoulder_q48', 'shoulder_q49', 'shoulder_q50'):
                # Yes is red
                for arr in ('options', 'answers'):
                    for o in q.get(arr, []):
                        if o['value'] == 'Yes':
                            o['effects']['optionColor'] = 'red'

        new_questions.append(q)
        
    condition['questions'] = new_questions

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Shoulder Region.json updated and formatted successfully.")
