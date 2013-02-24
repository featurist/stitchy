(function() {
    var self = this;
    var stitch, fs, connect, createCompiler, stitchyCompiler, createLogger, consoleLog, nullLog;
    stitch = require("stitch");
    fs = require("fs");
    connect = require("connect");
    exports.run = function(gen1_options) {
        var self = this;
        var paths, target, logging, port;
        paths = gen1_options !== void 0 && Object.prototype.hasOwnProperty.call(gen1_options, "paths") && gen1_options.paths !== void 0 ? gen1_options.paths : undefined;
        target = gen1_options !== void 0 && Object.prototype.hasOwnProperty.call(gen1_options, "target") && gen1_options.target !== void 0 ? gen1_options.target : undefined;
        logging = gen1_options !== void 0 && Object.prototype.hasOwnProperty.call(gen1_options, "logging") && gen1_options.logging !== void 0 ? gen1_options.logging : true;
        port = gen1_options !== void 0 && Object.prototype.hasOwnProperty.call(gen1_options, "port") && gen1_options.port !== void 0 ? gen1_options.port : 3e3;
        var log, compiler, server;
        log = createLogger(logging);
        compiler = createCompiler({
            paths: paths,
            target: target,
            logging: logging
        });
        server = connect().use(compiler.connectify()).use(connect.static("public")).listen(port);
        log("Serving http://127.0.0.1:" + port);
        return server;
    };
    exports.compile = function(options, continuation) {
        var self = this;
        var gen2_arguments = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
        continuation = arguments[arguments.length - 1];
        if (!(continuation instanceof Function)) {
            throw new Error("asynchronous function called synchronously");
        }
        options = gen2_arguments[0];
        createCompiler(options).compile(continuation);
    };
    createCompiler = function(gen3_options) {
        var paths, target, logging;
        paths = gen3_options !== void 0 && Object.prototype.hasOwnProperty.call(gen3_options, "paths") && gen3_options.paths !== void 0 ? gen3_options.paths : [ fs.realpathSync("./lib") ];
        target = gen3_options !== void 0 && Object.prototype.hasOwnProperty.call(gen3_options, "target") && gen3_options.target !== void 0 ? gen3_options.target : "js/app.js";
        logging = gen3_options !== void 0 && Object.prototype.hasOwnProperty.call(gen3_options, "logging") && gen3_options.logging !== void 0 ? gen3_options.logging : true;
        var log, package;
        log = createLogger(logging);
        package = stitch.createPackage({
            paths: paths
        });
        return stitchyCompiler(package, target, log);
    };
    stitchyCompiler = function(package, target, log) {
        return {
            compile: function(continuation) {
                var self = this;
                var gen4_arguments = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
                continuation = arguments[arguments.length - 1];
                if (!(continuation instanceof Function)) {
                    throw new Error("asynchronous function called synchronously");
                }
                package.compile(function(gen5_error, gen6_asyncResult) {
                    var source;
                    if (gen5_error) {
                        continuation(gen5_error);
                    } else {
                        try {
                            source = gen6_asyncResult;
                            fs.writeFile("public/" + target, source, function(gen7_error, gen8_asyncResult) {
                                if (gen7_error) {
                                    continuation(gen7_error);
                                } else {
                                    try {
                                        gen8_asyncResult;
                                        continuation(void 0, source);
                                    } catch (gen9_exception) {
                                        continuation(gen9_exception);
                                    }
                                }
                            });
                        } catch (gen10_exception) {
                            continuation(gen10_exception);
                        }
                    }
                });
            },
            compileAndRespond: function(res) {
                var self = this;
                return self.compile(function(err, source) {
                    var message;
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
            connectify: function() {
                var self = this;
                var handle;
                return handle = function(req, res, next) {
                    if (req.url === "/" + target) {
                        return self.compileAndRespond(res);
                    } else {
                        return next();
                    }
                };
            }
        };
    };
    createLogger = function(logging) {
        if (logging) {
            return consoleLog;
        } else {
            return nullLog;
        }
    };
    consoleLog = function(message) {
        var now, time;
        now = new Date().toString();
        time = now.match(/\d\d\:\d\d\:\d\d/)[0];
        return console.log(time + " -- " + message);
    };
    nullLog = function(message) {};
}).call(this);