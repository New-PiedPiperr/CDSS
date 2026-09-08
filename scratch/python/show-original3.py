import subprocess

# Get original file from git
result = subprocess.run(
    ['git', 'show', 'HEAD:public/rules/Ankle Region.json'],
    capture_output=True,
    text=True
)

original = result.stdout
original_lines = original.split('\n')

# Show original ankle_q50 full question
print('ORIGINAL ankle_q50 full question:')
for i in range(4574, 4675):
    if i < len(original_lines):
        print(f'{i+1}: {original_lines[i]}')
