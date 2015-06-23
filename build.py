import re

input = "src/phase.js"
output = "build/phase.js"
with open (input, "r") as myfile:
    data=myfile.read()

data = re.sub('/\*.*?\*/', '', data, flags=re.S)
data = re.sub('\n', '', data)
data = re.sub('\t', '', data)
data = re.sub('\s*\(\s*', '(', data)
data = re.sub('\s*\)\s*', ')', data)
data = re.sub(r'\s*([=\+\-<>/]+)\s*', r'\1', data)

print(data)

with open(output, "w") as text_file:
    text_file.write("/*Compiled Phase library - By Perry*/\n"+data)