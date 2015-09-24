
ISTANBUL=node_modules/.bin/istanbul
TAPE=node_modules/.bin/tape
COVERALLS=node_modules/.bin/coveralls

test:
	@$(TAPE) test/*.js

cover:
	@$(ISTANBUL) cover $(TAPE) -- test/*.js

coveralls:
	@$(ISTANBUL) cover --report lcovonly $(TAPE) -- test/*.js && cat ./coverage/lcov.info | $(COVERALLS)


.PHONY: test cover coveralls

