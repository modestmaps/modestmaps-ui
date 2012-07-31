UGLIFYJS = ./node_modules/.bin/uglifyjs
BANNER = ./node_modules/.bin/banner

JS_FILES = \
	build/header.js \
	lib/html-sanitizer-bundle.js \
	lib/html-sanitizer-loosen.js \
	src/attribution.js \
	src/boxselector.js \
	src/fullscreen.js \
	src/hash.js \
	src/legend.js \
	src/pointselector.js \
	src/util.js \
	src/zoombox.js \
	src/zoomer.js

all: modestmaps-ui.js modestmaps-ui.min.js

modestmaps-ui.min.js: modestmaps-ui.js
	rm -rf modestmaps-ui.min.js
	$(UGLIFYJS) modestmaps-ui.js > modestmaps-ui.min.js

modestmaps-ui.js: dist_setup $(JS_FILES) Makefile
	rm -rf modestmaps-ui.js
	cat $(JS_FILES) > modestmaps-ui.js

dist_setup:
	mkdir build
	$(BANNER) package.json > build/header.js

clean:
	rm modestmaps-ui.js
	rm modestmaps-ui.min.js
