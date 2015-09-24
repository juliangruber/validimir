
test:
	@node_modules/.bin/tape test/*.js

cover:
	@node_modules/.bin/istanbul cover test/*.js

.PHONY: test cover

