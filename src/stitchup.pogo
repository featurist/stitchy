stitch  = require 'stitch'
fs      = require 'fs'

run (block) every (timeout) milliseconds =
    set interval
        block @{}
    (timeout)

file exists (filename, callback) =
    fs.exists(filename) @(result)
        callback (nil, result)

log (message) =
    now = (new (Date)).to string()
    time = now.match(r/\d\d\:\d\d\:\d\d/).0
    console.log "#(time) -- #(message)"

exports.run (paths: [fs.realpath sync('./lib')], target: './stitched.js', interval: 200) =
  
    package = stitch.create package { paths = paths }

    recompile () =
        try
            source = package.compile !
            if (file (target) exists!)
                previous = fs.read file ! (target, 'utf-8')
                if (previous != source)
                    fs.write file ! (target, source, 'utf-8')
                    log "Reompiled #(target)"
            else
                fs.write file ! (target, source, 'utf-8')
                log "Compiled #(target)"
        catch (e)
            log "ERROR: #(e)"
    
    run
        recompile !
    every (interval) milliseconds
    
    log "Watching #(paths)"
    
    connect = require('connect')
    http = require('http')
    connect().use(connect.static('public')).listen(3000)
    log "Serving http://127.0.0.1:3000"