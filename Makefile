VERSION=$(shell jq -r .version manifest.json)

all: build/chrome-autoreload-crashed-$(VERSION).zip

build/chrome-autoreload-crashed-$(VERSION).zip: manifest.json background.js
	@rm -f $@
	@mkdir -p build/
	zip $@ $^

.PHONY: clean
clean:
	@rm -rf build/
