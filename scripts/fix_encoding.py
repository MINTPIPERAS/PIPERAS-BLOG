import os

files = [
    r"d:\\PIPERAS_NET\\my-website\\server\\models\\Comment.js",
    r"d:\\PIPERAS_NET\\my-website\\server\\routes\\comments.js",
    r"d:\\PIPERAS_NET\\my-website\\src\\style.css",
    r"d:\\PIPERAS_NET\\my-website\\src\\pages\\BlogEdit.vue",
]

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as fh:
            fh.read()
        print(f, 'already utf-8')
        continue
    except Exception as e:
        print(f, 'utf-8 read failed:', e)

    for enc in ['gbk', 'latin-1']:
        try:
            with open(f, 'r', encoding=enc) as fh:
                txt = fh.read()
            with open(f, 'w', encoding='utf-8') as fh:
                fh.write(txt)
            print(f, 'converted from', enc, 'to utf-8')
            break
        except Exception as e:
            print(f, 'reading with', enc, 'failed:', e)
    else:
        print(f, 'could not convert to utf-8')
