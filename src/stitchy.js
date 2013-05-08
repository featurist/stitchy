(function() {
    var self = this;
    var stitch, fs, connect, path, createLogger, consoleLog, nullLog;
    stitch = require("stitch");
    fs = require("fs");
    connect = require("connect");
    path = require("path");
    exports.compile = function(options, continuation) {
        var self = this;
        var gen1_arguments = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
        continuation = arguments[arguments.length - 1];
        if (!(continuation instanceof Function)) {
            throw new Error("asynchronous function called synchronously");
        }
        options = gen1_arguments[0];
        exports.createCompiler(options).compile(continuation);
    };
    exports.run = function(gen2_options) {
        var self = this;
        var lib, public, port, paths, target, logging;
        lib = gen2_options !== void 0 && Object.prototype.hasOwnProperty.call(gen2_options, "lib") && gen2_options.lib !== void 0 ? gen2_options.lib : undefined;
        public = gen2_options !== void 0 && Object.prototype.hasOwnProperty.call(gen2_options, "public") && gen2_options.public !== void 0 ? gen2_options.public : "./public";
        port = gen2_options !== void 0 && Object.prototype.hasOwnProperty.call(gen2_options, "port") && gen2_options.port !== void 0 ? gen2_options.port : 3e3;
        paths = gen2_options !== void 0 && Object.prototype.hasOwnProperty.call(gen2_options, "paths") && gen2_options.paths !== void 0 ? gen2_options.paths : undefined;
        target = gen2_options !== void 0 && Object.prototype.hasOwnProperty.call(gen2_options, "target") && gen2_options.target !== void 0 ? gen2_options.target : undefined;
        logging = gen2_options !== void 0 && Object.prototype.hasOwnProperty.call(gen2_options, "logging") && gen2_options.logging !== void 0 ? gen2_options.logging : true;
        var log, compiler, realPublic, app, server;
        log = createLogger(logging);
        compiler = exports.createCompiler({
            lib: lib,
            "public": public,
            paths: paths,
            target: target,
            logging: logging
        });
        realPublic = fs.realpathSync(public);
        app = connect().use(compiler.connectify()).use(connect.static(realPublic));
        server = app.listen(port);
        log("Serving http://127.0.0.1:" + port);
        return server;
    };
    exports.createCompiler = function(gen3_options) {
        var self = this;
        var lib, public, target, logging;
        lib = gen3_options !== void 0 && Object.prototype.hasOwnProperty.call(gen3_options, "lib") && gen3_options.lib !== void 0 ? gen3_options.lib : "./lib";
        public = gen3_options !== void 0 && Object.prototype.hasOwnProperty.call(gen3_options, "public") && gen3_options.public !== void 0 ? gen3_options.public : "./public";
        target = gen3_options !== void 0 && Object.prototype.hasOwnProperty.call(gen3_options, "target") && gen3_options.target !== void 0 ? gen3_options.target : "./public/js/app.js";
        logging = gen3_options !== void 0 && Object.prototype.hasOwnProperty.call(gen3_options, "logging") && gen3_options.logging !== void 0 ? gen3_options.logging : true;
        var paths, log, realPublic, relativeTarget, targetUrl, package;
        paths = [ fs.realpathSync(lib) ];
        log = createLogger(logging);
        realPublic = fs.realpathSync(public);
        relativeTarget = path.relative(realPublic, target);
        if (/^\./.test(relativeTarget)) {
            throw new Error("target must be under public");
        }
        targetUrl = "/" + relativeTarget;
        package = stitch.createPackage({
            paths: paths
        });
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
                            fs.writeFile(target, source, function(gen7_error, gen8_asyncResult) {
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
                var js;
                js = function(status, body) {
                    res.writeHead(status, {
                        "Content-Type": "text/javascript"
                    });
                    return res.end(body);
                };
                return self.compile(function(err, source) {
                    log("Compiled " + target);
                    if (err) {
                        console.error(err.stack);
                        return js(500, "throw " + JSON.stringify("" + err.stack));
                    } else {
                        return js(200, source);
                    }
                });
            },
            connectify: function() {
                var self = this;
                var handle;
                return handle = function(req, res, next) {
                    if (req.url === targetUrl) {
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