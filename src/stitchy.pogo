stitch  = require 'stitch'
fs      = require 'fs'
connect = require 'connect'
path    = require 'path'

exports.compile (options) =
    exports.create compiler (options).compile!

exports.run (
    lib: undefined
    public: './public'
    port: 3000
    paths: undefined
    target: undefined
    logging: true
) =
    log = create logger (logging)
    compiler = exports.create compiler (
        lib: lib
        public: public
        paths: paths
        target: target
        logging: logging
    )
    real public = fs.realpath sync(public)
    app = connect().use(compiler.connectify()).use(connect.static(real public))
    server = app.listen (port)
    log "Serving http://127.0.0.1:#(port)"
    server

exports.create compiler (
    lib: './lib'
    public: './public'
    target: './public/js/app.js'
    logging: true
) =
    paths = [fs.realpath sync(lib)]
    log = create logger (logging)
    real public = fs.realpath sync(public)
    relative target = path.relative(real public, target)
    
    if (r/^\./.test(relative target))
        throw (@new Error ("target must be under public"))
    
    target url = '/' + relative target
        
    package = stitch.create package { paths = paths }
    {    
        compile! =
            source = package.compile!
            fs.write file! (target, source)
            source
    
        compile and respond (res) =
            js (status, body) =
                res.write head (status) { 'Content-Type' = 'text/javascript' }
                res.end (body)
        
            self.compile @(err, source)
                log "Compiled #(target)"
                if (err)
                    console.error "#(err.stack)"
                    js 500 "throw #(JSON.stringify('' + err.stack))"
                else
                    js 200 (source)
    
        connectify () =
            handle (req, res, next) =
                if (req.url == target url)            
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
