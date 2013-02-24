stitch  = require 'stitch'
fs      = require 'fs'
connect = require 'connect'

exports.run (paths: undefined, target: undefined, logging: true, port: 3000) =
    log = create logger (logging)
    compiler = create compiler (paths: paths, target: target, logging: logging)
    server = connect().use(compiler.connectify()).use(connect.static('public')).listen(port)
    log "Serving http://127.0.0.1:#(port)"
    server

exports.compile (options) =
    create compiler (options).compile!

create compiler (paths: [fs.realpath sync('./lib')], target: "js/app.js", logging: true) =
    log = create logger (logging)
    package = stitch.create package { paths = paths }
    stitchy compiler (package, target, log)

stitchy compiler (package, target, log) = {
    
    compile! =
        source = package.compile!
        fs.write file! ("public/#(target)", source)
        source
    
    compile and respond (res) =
        self.compile @(err, source)
            log "Compiled #(target)"
            
            if (err)
                console.error "#(err.stack)"
                message = "" + err.stack
                res.write head 500 { 'Content-Type' = 'text/javascript' }
                res.end "throw #(JSON.stringify(message))"
            else
                res.write head 200 { 'Content-Type' = 'text/javascript' }
                res.end (source)
    
    connectify () =
        handle (req, res, next) =
            if (req.url == "/#(target)")            
                self.compile and respond (res)
            else
                next()
}

create logger (logging) =
    if (logging) @{ console log } else @{ null log }

console log (message) =
    now = (new (Date)).to string()
    time = now.match(r/\d\d\:\d\d\:\d\d/).0
    console.log "#(time) -- #(message)"

null log (message) = @{}
