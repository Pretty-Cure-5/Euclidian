/*
nohup node sys.js -li &
vim sys.js; node sys.js -li
*/
console.log('Booting the 1337 server...');

////////////////////////////////////////////////////////////////////////////////
console.log('Importing modules...');
const
    http = require('http')
    , mod = require('./mod.js')
;

// $ ifconfig
// https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
console.log('Declaring constants...');
const
    server = '43.240.97.247'
    , port = 1337
;

////////////////////////////////////////////////////////////////////////////////
console.log('Creating server...');
http.createServer(function(request, response) {
    console.log(`Incoming request: ${request.url}`);
    if(mod.checkExternal(request)) {
        // external files (from the /bro/ directory)
        mod.handleExternal(request, response);
    } else {
        // internal files (address bar = commandline interface)
        mod.handleInternal(request, response);
    }
}).listen(port, server, () => {
    console.log(`Server listening to http://${server}:${port}/`);
});

////////////////////////////////////////////////////////////////////////////////
