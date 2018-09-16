import ast, json, fileinput

class FuncLister(ast.NodeVisitor):
	def visit_FunctionDef(self, node):
		args = []
		for arg in node.args.args:
			args.append(arg.arg)
		print(json.dumps({'Name':node.name, 'Params':args}, indent=4))
		self.generic_visit(node) # guarantee child nodes visited

def topLevel(tree, fileName):
	funcs = []
	for node in tree.body:
		args = []
		if isinstance(node, ast.FunctionDef):
			args = []
			for arg in node.args.args:
				args.append({'Name':arg.arg, 'Type':None})
				funcs.append({'Name':node.name, 'Params':args})
	print(json.dumps({'Filename':Filename, 'ExportedFuncs':funcs}, indent=4))

# FuncLister().visit(tree)

url = input()
Filename = input()
s = ''
for line in fileinput.input():
	s += line

tree = ast.parse(s)
topLevel(tree, Filename)
