/*
nohup node sys.js -li &
vim sys.js; node sys.js -li
*/
console.log("Maintenance script...");

////////////////////////////////////////////////////////////////////////////////
console.log("Importing modules...");
const
    http = require("http")
    , url = require('url')
    , exec = require('child_process').exec
    , queryString = require('querystring')
;

////////////////////////////////////////////////////////////////////////////////
console.log("Creating server...");
http.createServer(function(request, response) {
    function r(body) {
        var head = [
            '<!DOCTYPE html>'
            , '<html><head>'
            , '<meta charset="utf-8">'
            , '<title>Pretty Cure Server</title>'
            , '<link rel="shortcut icon" type="image/x-icon" href="favicon.ico"/>'
            , '<style>'
            , '*{font-family:monospace,sans-serif;}'
            , '</style>'
            , '</head><body>'
        ];
        var tail = '</body></html>';
        // HTTP header
        response.writeHead(200, {'Content-Type': 'text/html'});
        // HTML source
        response.write(head.join('') + body.toString() + tail);
    }

    // Parse the request containing file name
    var parsely    = url.parse(request.url)
        , pathname = parsely.pathname.substr(1)
        , query    = queryString.parse(parsely.query)
    ;

    // Print the name of the file for which request is made.
    console.log("Request for " + pathname + " received.");

    var address = 'asdf';
    switch(pathname) {
        case 'sync':
            const child = exec(
                'sh /home/ubuntu/Euclidian/Server/sync.sh'
                , (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    console.log('Synchronised! :D');
                }
            );
            r('<span style="color:green">SAGE2 Apps have been synchronised! :D</span>');
            break;
        case 'firewall':
            var keys = Object.keys(query);
            if(keys.length == 1) {
                if(keys[0] == 'ip') {
                    if(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(query.ip)) {
                        r('<span style="color:green">' + query.ip + ' has been invited to the Pretty Cure party! :D</span>');
                        console.log(query.ip + '; Invited! :D');
                        const child = exec(
                            'sh /home/ubuntu/Euclidian/Server/ip_address.sh ' + query.ip
                            , (error, stdout, stderr) => {
                                if (error) {
                                    console.error(`exec error: ${error}`);
                                    return;
                                }
                                console.log(query.ip + '; Invited! :D');
                                console.log('Error: ' + error)
                                console.log('STDout: ' + stdout)
                                console.log('STDerr: ' + stderr)
                            }
                        );
                    } else {
                        r('<span style="color:red">ERR: Invalid IP address!</span>');
                    }
                } else {
                    r('<span style="color:red">ERR: Unrecognised variable!</span>');
                }
            } else {
                if(keys.length < 1) {
                    r('<span style="color:red">ERR: Missing parameter!</span>');
                } else {
                    r('<span style="color:red">ERR: Too many parameters!</span>');
                }
            }
            break;
        default:
            r('Hello World! :D');
            break;
    }
    response.end();
}).listen(1337);/** Port 1337 **/// https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers

console.log('Server running at http://43.240.97.247:1337/');

////////////////////////////////////////////////////////////////////////////////
