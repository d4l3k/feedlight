
.PHONY: test
test:
	cd www && yarn test
	make -C srv test
