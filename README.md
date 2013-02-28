## Stitchy

A little utility to fire up a static web server for development of static web apps (with PogoScript). This is little more than a command-line wrapper around [stitch](https://github.com/sstephenson/stitch). Stitchy compiles CommonJS modules AND write them to disk, so that they are ready to deploy to static hosting environments.

#### Install

npm install stitchy

#### Running the server

From a command line

    stitchy [options]
    
##### Options

    --port
    
        Web server port, defaults to 3000

    --lib
    
        Path to the directory comtaining your pogo and js files, defaults to ./lib
  
    --target
        
        Path to the compiled JavaScript file, defaults to ./public/js/app.js

    --public
    
        Path to the directory comtaining your static assets, defaults to ./public


#### Example

Add the following following files:

    ./lib/foo.pogo
    ./lib/bar.js
    ./public/js/app.js

Run stitchy:

    > stitchy

Visit:

    http://localhost:3000/js/app.js

You should see the two modules under /lib compiled into a single JavaScript. The compiled output is also saved to disk at ./js/app.js

Add some HTML:

    ./public/index.html

Link to your compiled JavaScript and require one of your CommonJS modules:

    <html>
      <head>
        <script type="text/javascript" src="js/app.js"></script>
      </head>
      <body>
        <script type="text/javascript">
        
          require('foo');
        
        </script>
      </body>
    </html>
    
Open a web browser at:
 
     http://localhost:3000
  
Win!