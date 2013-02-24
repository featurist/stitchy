compile :
	pogo -c src/stitchy.pogo

mocha :
	mocha spec/*_spec.pogo

test : compile mocha