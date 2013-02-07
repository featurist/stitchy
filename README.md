## Stitchup

A little utility to fire up a web server with the wonderful [stitch](https://github.com/sstephenson/stitch) plugged in to compile your CommonJS modules AND write them to disk, so that they are ready for deploying to static hosting environments.

#### Install

npm install stitchup

#### Usage

Stitchup assumes your compiled JavaScript will live somewhere under ./public

#### Running the server

    stitchup [options]
    
##### Options
  
    -t, --target
        
        Path to the compiled JavaScript file, relative to ./public
        
        Defaults to js/app.js
        
    -p, --port
    
        Web server port
    
        Defaults to 3000

