all:
	mkdir -p build
	node ../gendoc/bin/gendoc docs/api/index.md --format=html --template=docs/template.html > build/index.html
	node ../gendoc/bin/gendoc docs/api/all.md --format=html --template=docs/template.html > build/all.html
	node ../gendoc/bin/gendoc docs/api/gendoc.md --format=html --template=docs/template.html > build/gendoc.html
	node ../gendoc/bin/gendoc docs/api/markup.md --format=html --template=docs/template.html > build/markup.html
	node ../gendoc/bin/gendoc docs/api/index.md --format=json > build/index.json
	node ../gendoc/bin/gendoc docs/api/all.md --format=json > build/all.json
	node ../gendoc/bin/gendoc docs/api/gendoc.md --format=json > build/gendoc.json
	node ../gendoc/bin/gendoc docs/api/markup.md --format=json > build/markup.json

