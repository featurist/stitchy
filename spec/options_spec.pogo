make tree = require 'mktree'
spawn = require 'child_process'.spawn
fs = require 'fs'
httpism = require 'httpism'

describe "stitchy (with command line options)"
    
    stitchy = nil
    tree = nil
    
    before @(ready)
        make tree {
            dir = {
                lib = {
                    "foo.pogo" = "exports.foo = 123"
                    "bar.pogo" = "exports.bar = 456"
                    "baz.js" = "exports.baz = 789"
                }
                public = {
                    "index.html" = "hello"
                    "other.html" = "world"
                    js = {
                        jquery = {
                            "jquery.js" = "ouch!"
                        }
                    }
                }
            }
        } @(err, destroyable)
            tree := destroyable
            stitchy := spawn "./bin/stitchy" [
                "--lib"
                "./dir/lib"
                "--public"
                "./dir/public"
                "--target"
                "./dir/public/js/foo.js"
                "--port"
                "7657"
            ]
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
        httpism.get! "http://localhost:7657#(path)".body
    
    it "compiles js code for the browser"
        body = get! '/js/foo.js'
        (body) should be stitched lib

    it "compiles js code to disk"
        get! '/js/foo.js'
        (read file "./dir/public/js/foo.js") should be stitched lib
        
    it "hosts a static web server"
        get! '/'.should.equal "hello"
        get! '/other.html'.should.equal "world"
        get! '/js/jquery/jquery.js'.should.equal "ouch!"
