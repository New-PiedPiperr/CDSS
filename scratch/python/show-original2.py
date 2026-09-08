import subprocess

# Get original file from git
result = subprocess.run(
    ['git', 'show', 'HEAD:public/rules/Ankle Region.json'],
    capture_output=True,
    text=True
)

original = result.stdout
original_lines = original.split('\n')

# Show original ankle_q50 options and answers
print('ORIGINAL ankle_q50 options (lines 4585-4620):')
for i in range(4584, 4620):
    if i < len(original_lines):
        print(f'{i+1}: {original_lines[i]}')

print('\nORIGINAL ankle_q50 answers (lines 4621-4675):')
for i in range(4620, 4675):
    if i < len(original_lines):
        print(f'{i+1}: {original_lines[i]}')
