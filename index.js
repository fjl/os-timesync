/*
 * Copyright (c) 2016 Felix Lange <fjl@twurst.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR
 * THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var childProcess = require("child_process");

function checkWindows(cb) {
    var args = ["query", "HKLM\\SYSTEM\\CurrentControlSet\\Services\\W32Time", "/v", "Start"];
    childProcess.execFile("reg", args, function (err, stdout, stderr) {
        cb(err, /REG_DWORD\s+0x3/.test(stdout));
    });
}

function checkDarwin(cb) {
    childProcess.execFile("ps", ["-A", "-o", "command"], function (err, stdout, stderr) {
        cb(err, /^\/usr\/sbin\/ntpd/m.test(stdout));
    });
}

/**
 * canCheck is true if checkEnabled is supported on the current platform.
 */
exports.canCheck = ["win32", "darwin"].indexOf(process.platform) > -1;

/**
 * checkEnabled invokes {cb} with {(error, enabled)} after checking whether
 * NTP time synchronization is enabled in OS settings.
 */
exports.checkEnabled = function checkEnabled(cb) {
    switch (process.platform) {
    case "win32":
        return checkWindows(cb);
    case "darwin":
    case "freebsd":
        return checkDarwin(cb);
    default:
        var err = new Error("checkEnabled is not supported on " + process.platform);
        process.nextTick(cb, err);
    }
}
