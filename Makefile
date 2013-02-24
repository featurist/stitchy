compile :
	pogo -c src/stitchy.pogo

mocha :
	mocha spec/command_line_spec.pogo

test : compile mocha