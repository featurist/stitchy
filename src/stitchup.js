(function() {
    var self = this;
    var stitch, fs, connect, createCompiler, log;
    stitch = require("stitch");
    fs = require("fs");
    connect = require("connect");
    createCompiler = function(package, target) {
        return {
            compile: function(res) {
                var self = this;
                return package.compile(function(err, source) {
                    var message;
                    fs.writeFileSync("public/" + target, source);
                    log("Compiled " + target);
                    if (err) {
                        console.error("#{err.stack}");
                        message = "" + err.stack;
                        res.writeHead(500, {
                            "Content-Type": "text/javascript"
                        });
                        return res.end("throw " + JSON.stringify(message));
                    } else {
                        res.writeHead(200, {
                            "Content-Type": "text/javascript"
                        });
                        return res.end(source);
                    }
                });
            },
            createHandler: function() {
                var self = this;
                var handle;
                return handle = function(req, res, next) {
                    if (req.url === "/" + target) {
                        return self.compile(res);
                    } else {
                        return next();
                    }
                };
            }
        };
    };
    exports.run = function(gen1_options) {
        var self = this;
        var paths, target, port;
        paths = gen1_options !== void 0 && Object.prototype.hasOwnProperty.call(gen1_options, "paths") && gen1_options.paths !== void 0 ? gen1_options.paths : [ fs.realpathSync("./lib") ];
        target = gen1_options !== void 0 && Object.prototype.hasOwnProperty.call(gen1_options, "target") && gen1_options.target !== void 0 ? gen1_options.target : "js/app.js";
        port = gen1_options !== void 0 && Object.prototype.hasOwnProperty.call(gen1_options, "port") && gen1_options.port !== void 0 ? gen1_options.port : 3e3;
        var package, compiler, handler;
        package = stitch.createPackage({
            paths: paths
        });
        compiler = createCompiler(package, target);
        handler = compiler.createHandler();
        connect().use(handler).use(connect.static("public")).listen(port);
        return log("Serving http://127.0.0.1:" + port);
    };
    log = function(message) {
        var now, time;
        now = (new Date).toString();
        time = now.match(/\d\d\:\d\d\:\d\d/)[0];
        return console.log(time + " -- " + message);
    };
}).call(this);