import random
import array

f = open("portfolio\src\preprocessing\words.txt", "r")

w = open("portfolio\src\preprocessing\words2.txt", "w")

words = []

for line in f:
    line = line.strip()

    if line != "" and len(line) == 5 and line[0] == line[0].lower():
        words.append(line)
        # w.write(f"{line}\n")

random.shuffle(words)

for word in words:
    w.write(f"{word}\n")


f.close()
w.close()