/*
nohup node sys.js -li
vim sys.js; node sys.js -li
*/
console.log("Maintenance script...");

////////////////////////////////////////////////////////////////////////////////
console.log("Importing modules...");
const http = require("http");
const url = require('url');
const exec = require('child_process').exec;

////////////////////////////////////////////////////////////////////////////////
console.log("Creating server...");
http.createServer(function(request, response) {
    function r(body) {
        var head = '<!DOCTYPE html><html><head><title>Pretty Cure Server</title><meta charset="utf-8"></head><body>';
        var tail = '</body></html>';

        // Send the HTTP header
        // HTTP Status: 200 : OK
        // Content Type: text/plain
        response.writeHead(200, {'Content-Type': 'text/html'});// 'text/plain'

        // Send the response body as "Hello World"
        response.write(head + body.toString() + tail);
        //response.end();
    }

    // Parse the request containing file name
    var pathname = url.parse(request.url).pathname;

    // Print the name of the file for which request is made.
    console.log("Request for " + pathname.substr(1) + " received.");

    switch(pathname.substr(1)) {
        case 'sync':
            const child = exec('sh /home/ubuntu/Euclidian/Server/sync.sh', (error, stdout, stderr) => {
                //if (error) {console.log(error);}
                //console.log(stdout);
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                //console.log(`stdout: ${stdout}`);
                //console.log(`stderr: ${stderr}`);
                console.log('Synchronised! :D');
            });
            r('SAGE2 Apps have been synchronised! :D');
            break;
        default:
            r('Hello World! :D\n');
            break;
    }
    response.end();
}).listen(1337);/** Port 1337 **/// https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers

// Console will print the message
console.log('Server running at http://43.240.97.247:1337/');

////////////////////////////////////////////////////////////////////////////////
