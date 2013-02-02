mktree = require 'mktree'
spawn = require 'child_process'.spawn
wrench = require 'wrench'
fs = require 'fs'

describe "stitchup"
  
  before
    mktree ! {
      lib = {
        "foo.pogo" = "exports.foo = 123"
        "bar.pogo" = "exports.bar = 456"
        "baz.js" = "exports.baz = 789"
      }
    }
  
  after
    wrench.rmdir sync recursive './lib'
    fs.unlink sync "./stitched.js"
  
  it "continuously stitches code together for the browser" @(done)
    stitchup = spawn "./bin/stitchup" []
    stitchup.stdout.on 'data' @(data)
      compiled = data.to string().index of "Compiled ./stitched.js"
      if (compiled > 0)
        contents = fs.read file sync("./stitched.js", "utf-8")
        contents.should.include 'exports.foo'
        contents.should.include 'exports.bar'
        done()