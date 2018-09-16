import ast, json, fileinput

infile = 'program.py'

class FuncLister(ast.NodeVisitor):
	def visit_FunctionDef(self, node):
		args = []
		for arg in node.args.args:
			args.append(arg.arg)
		print(json.dumps({'Name':node.name, 'Params':args}, indent=4))
		self.generic_visit(node) # guarantee child nodes visited

def topLevel(tree):
	funcs = []
	for node in tree.body:
		args = []
		if isinstance(node, ast.FunctionDef):
			args = []
			for arg in node.args.args:
				args.append(arg.arg)
				funcs.append({'Name':node.name, 'Params':args})
	print(json.dumps(funcs))

# with open(infile) as f:
# 	tree = ast.parse(f.read())
# 
# FuncLister().visit(tree)

s = ''
for line in fileinput.input():
	s += line

tree = ast.parse(s)
topLevel(tree)
