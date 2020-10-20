var bunyan = require('bunyan');
var logger = bunyan.createLogger({
    name: "AskAnything",
    streams: [
        {
            stream: process.stderr,
            level: "debug"
        }
    ],
    src: true
});
module.exports = logger;