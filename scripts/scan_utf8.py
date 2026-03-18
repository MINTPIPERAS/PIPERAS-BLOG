import glob
import os

root = r'd:\PIPERAS_NET\my-website\src'
exts = ['.vue', '.js', '.ts', '.jsx', '.tsx', '.css', '.json', '.html']
bad = []
for path in glob.glob(os.path.join(root, '**', '*'), recursive=True):
    if os.path.isdir(path):
        continue
    if not any(path.lower().endswith(e) for e in exts):
        continue
    try:
        open(path, 'r', encoding='utf-8').read()
    except Exception as e:
        bad.append((path, str(e)))

out = []
out.append(f'bad count: {len(bad)}')
for p, e in bad:
    out.append(f'{p} ::: {e}')

with open('scan_out.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))

print(out[0])
