
TAPE=node_modules/.bin/tape

test:
	@$(TAPE) test/*.js

cover:
	@node_modules/.bin/istanbul cover $(TAPE) -- test/*.js

.PHONY: test cover

