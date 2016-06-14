[![Travis](https://travis-ci.org/fjl/os-timesync.svg?branch=master)](https://travis-ci.org/fjl/os-timesync)
[![AppVeyor](https://ci.appveyor.com/api/projects/status/y9turyxri81u35ih?svg=true)](https://ci.appveyor.com/project/fjl/os-timesync)

`os-timesync` can help you check whether NTP time sync is enabled in OS settings.
It can do so reliably on OS X and Windows and somewhat less reliably on Linux.
Note that the result does not tell you whether the local time is accurate.

```js
var timesync = require("os-timesync");

timesync.checkEnabled(function (err, enabled) {
    if (err) {
        console.log("can't check: " + err.toString());
        return;
    }
    console.log("enabled =", enabled);
});
```

