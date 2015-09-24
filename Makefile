
ISTANBUL=node_modules/.bin/istanbul
TAPE=node_modules/.bin/tape

test:
	@$(TAPE) test/*.js

cover:
	@$(ISTANBUL) cover $(TAPE) -- test/*.js

coveralls:
	@$(ISTANBUL) cover $(TAPE) -- test/*.js --report lcovonly && cat ./coverage/lcov.info | coveralls  && rm -rf ./coverage


.PHONY: test cover coveralls

