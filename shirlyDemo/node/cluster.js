var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

cluster.schedulingPolicy = cluster.SCHED_NONE;
console.log('exec app at '+Date.now())
console.log('cluster.isMaster : '+cluster.isMaster)

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    var a = process.listeners('disconnect');
    console.log('process.listeners("disconnect").length is : ' + a.length);
    process.removeAllListeners('disconnect');
    a = process.listeners('disconnect');
    console.log('process.listeners("disconnect").length is : ' + a.length);

    http.createServer(function(req, res) {
    res.writeHead(200);
    res.end("hello world\n");
    }).listen(4002);
}