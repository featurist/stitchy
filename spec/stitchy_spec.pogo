make tree = require 'mktree'
spawn = require 'child_process'.spawn
fs = require 'fs'
httpism = require 'httpism'

describe "stitchy"
    
    stitchy = nil
    tree = nil
    
    before @(ready)
        make tree {
            lib = {
                "foo.pogo" = "exports.foo = 123"
                "bar.pogo" = "exports.bar = 456"
                "baz.js" = "exports.baz = 789"
            }
            public = {
                "index.html" = "hello"
                "other.html" = "world"
                js = {}
            }
        } @(err, destroyable)
            tree := destroyable
            stitchy := spawn "./bin/stitchy" []
            stitchy.stdout.once 'data'
                ready()
    
    after
        tree.destroy!
        stitchy.kill()
    
    (text) should be stitched lib =
        text.should.include 'exports.foo'
        text.should.include 'exports.bar'
        text.should.include 'exports.baz'
    
    read file (path) =
        fs.read file sync(path, "utf-8")
    
    get (path) =
        httpism.get! "http://localhost:3000#(path)".body
    
    it "compiles js code for the browser"
        body = get! '/js/app.js'
        (body) should be stitched lib

    it "compiles js code to disk"
        get! '/js/app.js'
        (read file "./public/js/app.js") should be stitched lib
        
    it "hosts a static web server"
        body = get! '/'
        body.should.equal "hello"
        body := get! '/other.html'
        body.should.equal "world"
