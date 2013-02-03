stitch  = require 'stitch'
fs      = require 'fs'
connect = require 'connect'

exports.run (paths: [fs.realpath sync('./lib')], target: "js/app.js", port: 3000) =
    package = stitch.create package { paths = paths }
    compiler = create compiler (package, target)
    connect().use(compiler.connect handler()).use(connect.static('public')).listen(port)
    log "Serving http://127.0.0.1:#(port)"

create compiler (package, target) = {

    compile (res) =
        package.compile @(err, source)
            fs.write file sync ("public/#(target)", source)
            log "Compiled #(target)"
            if (err)
                console.error "#{err.stack}"
                message = "" + err.stack
                res.write head 500 { 'Content-Type' = 'text/javascript' }
                res.end "throw #(JSON.stringify(message))"
            else
                res.write head 200 { 'Content-Type' = 'text/javascript' }
                res.end (source)
    
    connect handler () =
        handle (req, res, next) =
            if (req.url == "/#(target)")            
                self.compile (res)
            else
                next()

}

log (message) =
    now = (new (Date)).to string()
    time = now.match(r/\d\d\:\d\d\:\d\d/).0
    console.log "#(time) -- #(message)"