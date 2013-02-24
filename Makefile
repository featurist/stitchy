compile :
	pogo -c src/stitchy.pogo

mocha :
	mocha spec/stitchy_spec.pogo

test : compile mocha