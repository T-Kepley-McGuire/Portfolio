categories = ["main", "accent", "background"]

for cat in categories:
    print(f"\t--{cat}-h: INSERT_VALUE;")
    print(f"\t--{cat}-s: INSERT_VALUE%;")
    print()


for cat in categories:
    for i in range(11):
        print(f"\t--{cat}-color-{i}0-raw: var(--{cat}-h) var(--{cat}-s) {i*10}%;")
        print(f"\t--{cat}-color-{i}0: hsl(var(--{cat}-color-{i}0-raw));")
    print()

for i in range (11):
    print(f"\t--gray-{i}0: hsl(0, 0%, {i*10}%);")