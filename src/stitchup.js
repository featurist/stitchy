(function() {
    var self = this;
    var gen1_asyncIf, gen2_asyncIfElse, gen3_asyncTry, stitch, fs, runEveryMilliseconds, fileExists, log;
    gen1_asyncIf = function(condition, thenBody, cb) {
        if (condition) {
            try {
                thenBody(cb);
            } catch (ex) {
                cb(ex);
            }
        } else {
            cb();
        }
    };
    gen2_asyncIfElse = function(condition, thenBody, elseBody, cb) {
        if (condition) {
            try {
                thenBody(cb);
            } catch (ex) {
                cb(ex);
            }
        } else {
            try {
                elseBody(cb);
            } catch (ex) {
                cb(ex);
            }
        }
    };
    gen3_asyncTry = function(body, catchBody, finallyBody, cb) {
        var callbackCalled = false;
        var callback = function(error, result) {
            if (!callbackCalled) {
                callbackCalled = true;
                cb(error, result);
            }
        };
        try {
            body(function(error, result) {
                if (error) {
                    if (finallyBody && catchBody) {
                        try {
                            catchBody(error, function(error, result) {
                                try {
                                    finallyBody(function(finallyError) {
                                        callback(finallyError || error, finallyError || error ? undefined : result);
                                    });
                                } catch (error) {
                                    callback(error);
                                }
                            });
                        } catch (error) {
                            try {
                                finallyBody(function(finallyError) {
                                    callback(finallyError || error);
                                });
                            } catch (error) {
                                callback(error);
                            }
                        }
                    } else if (catchBody) {
                        try {
                            catchBody(error, callback);
                        } catch (error) {
                            callback(error);
                        }
                    } else {
                        try {
                            finallyBody(function(finallyError) {
                                callback(finallyError || error, finallyError ? undefined : result);
                            });
                        } catch (error) {
                            callback(error);
                        }
                    }
                } else {
                    if (finallyBody) {
                        try {
                            finallyBody(function(finallyError) {
                                callback(finallyError, finallyError ? undefined : result);
                            });
                        } catch (error) {
                            callback(error);
                        }
                    } else {
                        callback(undefined, result);
                    }
                }
            });
        } catch (error) {
            if (finallyBody && catchBody) {
                try {
                    catchBody(error, function(error, result) {
                        try {
                            finallyBody(function(finallyError) {
                                callback(finallyError || error, finallyError ? undefined : result);
                            });
                        } catch (error) {
                            callback(error);
                        }
                    });
                } catch (error) {
                    try {
                        finallyBody(function(finallyError) {
                            callback(finallyError || error);
                        });
                    } catch (error) {
                        callback(error);
                    }
                }
            } else if (catchBody) {
                try {
                    catchBody(error, callback);
                } catch (error) {
                    callback(error);
                }
            } else {
                try {
                    finallyBody(function(finallyError) {
                        callback(finallyError || error);
                    });
                } catch (error) {
                    callback(error);
                }
            }
        }
    };
    stitch = require("stitch");
    fs = require("fs");
    runEveryMilliseconds = function(block, timeout) {
        return setInterval(function() {
            return block(function() {});
        }, timeout);
    };
    fileExists = function(filename, callback) {
        return fs.exists(filename, function(result) {
            return callback(void 0, result);
        });
    };
    log = function(message) {
        var now, time;
        now = (new Date).toString();
        time = now.match(/\d\d\:\d\d\:\d\d/)[0];
        return console.log(time + " -- " + message);
    };
    exports.run = function(gen4_options) {
        var self = this;
        var paths, target, interval;
        paths = gen4_options !== void 0 && Object.prototype.hasOwnProperty.call(gen4_options, "paths") && gen4_options.paths !== void 0 ? gen4_options.paths : [ fs.realpathSync("./lib") ];
        target = gen4_options !== void 0 && Object.prototype.hasOwnProperty.call(gen4_options, "target") && gen4_options.target !== void 0 ? gen4_options.target : "./stitched.js";
        interval = gen4_options !== void 0 && Object.prototype.hasOwnProperty.call(gen4_options, "interval") && gen4_options.interval !== void 0 ? gen4_options.interval : 200;
        var package, recompile, connect, http;
        package = stitch.createPackage({
            paths: paths
        });
        recompile = function(gen5_callback) {
            var gen6_arguments = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
            gen5_callback = arguments[arguments.length - 1];
            if (!(gen5_callback instanceof Function)) {
                throw new Error("asynchronous function called synchronously");
            }
            gen3_asyncTry(function(gen5_callback) {
                var gen7_arguments = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
                gen5_callback = arguments[arguments.length - 1];
                if (!(gen5_callback instanceof Function)) {
                    throw new Error("asynchronous function called synchronously");
                }
                package.compile(function(gen8_error, gen9_asyncResult) {
                    var source;
                    if (gen8_error) {
                        gen5_callback(gen8_error);
                    } else {
                        try {
                            source = gen9_asyncResult;
                            fileExists(target, function(gen10_error, gen11_asyncResult) {
                                if (gen10_error) {
                                    gen5_callback(gen10_error);
                                } else {
                                    try {
                                        gen2_asyncIfElse(gen11_asyncResult, function(gen5_callback) {
                                            var gen12_arguments = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
                                            gen5_callback = arguments[arguments.length - 1];
                                            if (!(gen5_callback instanceof Function)) {
                                                throw new Error("asynchronous function called synchronously");
                                            }
                                            fs.readFile(target, "utf-8", function(gen13_error, gen14_asyncResult) {
                                                var previous;
                                                if (gen13_error) {
                                                    gen5_callback(gen13_error);
                                                } else {
                                                    try {
                                                        previous = gen14_asyncResult;
                                                        gen1_asyncIf(previous !== source, function(gen5_callback) {
                                                            var gen15_arguments = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
                                                            gen5_callback = arguments[arguments.length - 1];
                                                            if (!(gen5_callback instanceof Function)) {
                                                                throw new Error("asynchronous function called synchronously");
                                                            }
                                                            fs.writeFile(target, source, "utf-8", function(gen16_error, gen17_asyncResult) {
                                                                if (gen16_error) {
                                                                    gen5_callback(gen16_error);
                                                                } else {
                                                                    try {
                                                                        gen17_asyncResult;
                                                                        gen5_callback(void 0, log("Reompiled " + target));
                                                                    } catch (gen18_exception) {
                                                                        gen5_callback(gen18_exception);
                                                                    }
                                                                }
                                                            });
                                                        }, gen5_callback);
                                                    } catch (gen19_exception) {
                                                        gen5_callback(gen19_exception);
                                                    }
                                                }
                                            });
                                        }, function(gen5_callback) {
                                            var gen20_arguments = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
                                            gen5_callback = arguments[arguments.length - 1];
                                            if (!(gen5_callback instanceof Function)) {
                                                throw new Error("asynchronous function called synchronously");
                                            }
                                            fs.writeFile(target, source, "utf-8", function(gen21_error, gen22_asyncResult) {
                                                if (gen21_error) {
                                                    gen5_callback(gen21_error);
                                                } else {
                                                    try {
                                                        gen22_asyncResult;
                                                        gen5_callback(void 0, log("Compiled " + target));
                                                    } catch (gen23_exception) {
                                                        gen5_callback(gen23_exception);
                                                    }
                                                }
                                            });
                                        }, gen5_callback);
                                    } catch (gen24_exception) {
                                        gen5_callback(gen24_exception);
                                    }
                                }
                            });
                        } catch (gen25_exception) {
                            gen5_callback(gen25_exception);
                        }
                    }
                });
            }, function(e, gen5_callback) {
                var gen26_arguments = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
                gen5_callback = arguments[arguments.length - 1];
                if (!(gen5_callback instanceof Function)) {
                    throw new Error("asynchronous function called synchronously");
                }
                e = gen26_arguments[0];
                gen5_callback(void 0, log("ERROR: " + e));
            }, void 0, gen5_callback);
        };
        runEveryMilliseconds(function(gen5_callback) {
            var gen27_arguments = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
            gen5_callback = arguments[arguments.length - 1];
            if (!(gen5_callback instanceof Function)) {
                throw new Error("asynchronous function called synchronously");
            }
            recompile(gen5_callback);
        }, interval);
        log("Watching " + paths);
        connect = require("connect");
        http = require("http");
        connect().use(connect.static("public")).listen(3e3);
        return log("Serving http://127.0.0.1:3000");
    };
}).call(this);