make tree = require 'mktree'
spawn = require 'child_process'.spawn
fs = require 'fs'
request = require 'request'

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
    
    get (path, callback) =
        request.get "http://localhost:3000#(path)" (callback)
    
    it "compiles js code for the browser" @(done)
        request.get 'http://localhost:3000/js/app.js' @(err, res, body)
            (body) should be stitched lib
            done()

    it "compiles js code to disk" @(done)
        get '/js/app.js' @(err, res, body)
             (read file "./public/js/app.js") should be stitched lib
             done()        

    it "hosts a static web server" @(done)
        get '/' @(err, res, body)
            if (err)
                done (err)
            else
                body.should.equal "hello"
                get '/other.html' @(err, res, body)
                    body.should.equal "world"
                    done()   