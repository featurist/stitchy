(function() {
    var self = this;
    var stitch, fs, connect, createCompiler, consoleLog, nullLog;
    stitch = require("stitch");
    fs = require("fs");
    connect = require("connect");
    exports.run = function(gen1_options) {
        var self = this;
        var paths, target, port, logging;
        paths = gen1_options !== void 0 && Object.prototype.hasOwnProperty.call(gen1_options, "paths") && gen1_options.paths !== void 0 ? gen1_options.paths : [ fs.realpathSync("./lib") ];
        target = gen1_options !== void 0 && Object.prototype.hasOwnProperty.call(gen1_options, "target") && gen1_options.target !== void 0 ? gen1_options.target : "js/app.js";
        port = gen1_options !== void 0 && Object.prototype.hasOwnProperty.call(gen1_options, "port") && gen1_options.port !== void 0 ? gen1_options.port : 3e3;
        logging = gen1_options !== void 0 && Object.prototype.hasOwnProperty.call(gen1_options, "logging") && gen1_options.logging !== void 0 ? gen1_options.logging : true;
        var log, package, compiler, server;
        log = function() {
            if (logging) {
                return consoleLog;
            } else {
                return nullLog;
            }
        }();
        package = stitch.createPackage({
            paths: paths
        });
        compiler = createCompiler(package, target, log);
        server = connect().use(compiler.connectHandler()).use(connect.static("public")).listen(port);
        log("Serving http://127.0.0.1:" + port);
        return server;
    };
    createCompiler = function(package, target, log) {
        return {
            compile: function(res) {
                var self = this;
                return package.compile(function(err, source) {
                    var message;
                    fs.writeFileSync("public/" + target, source);
                    log("Compiled " + target);
                    if (err) {
                        console.error(err.stack);
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
            connectHandler: function() {
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
    consoleLog = function(message) {
        var now, time;
        now = new Date().toString();
        time = now.match(/\d\d\:\d\d\:\d\d/)[0];
        return console.log(time + " -- " + message);
    };
    nullLog = function(message) {};
}).call(this);