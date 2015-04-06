nfo:
	@echo "Makefile for GSGL available commands are:"
	@echo "* build_prod - Builds and minifies GSGL."

build_prod:
	@echo "=================="
	@echo "= Minifying GSGL ="
	@echo "=================="
	@cat src/gsgl.js src/gsgl.event.js src/gsgl.geometry.js src/gsgl.graphics.js src/gsgl.physics.js src/gsgl.surface.js src/gsgl.ui.js src/gsgl.utility.js > bin/gsgl.js
	@uglifyjs bin/gsgl.js > bin/gsgl.min.js