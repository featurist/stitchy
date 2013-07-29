make tree = require 'mktree'
fs = require 'fs'
httpism = require 'httpism'
stitchy = require '../src/stitchy'
jsdom = require 'jsdom'

describe "stitchy"
    
    server = nil
    tree = nil
    
    before
        tree := make tree ! {
            a = {
                "foo.pogo" = "exports.foo = 123"
            }
            b = {
                "bar.pogo" = "exports.omg = require 'foo'.foo"
            }
            public = {
                js = {}
            }
        }
        server := stitchy.run(logging: false, lib: './a;./b')
    
    after
        tree.destroy!
        server.close()
    
    it "compiles many libs"
        window = jsdom.env! '<script>require("bar")</script>' ["http://localhost:3000/js/app.js"]
        window.require('bar').omg.should.equal(123)
