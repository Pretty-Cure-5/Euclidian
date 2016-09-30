/*
vim mod.js; node sys.js -li
*/

const
    fs = require('fs')
    , url = require('url')
    , exec = require('child_process').exec
    , queryString = require('querystring')
;

exports.checkExternal = (request) => {
    return request.url.startsWith('/bro/');
};

exports.handleExternal = (request, response) => {
    let url = request.url.substr(1);
    // readFileSync is not asynchronous; this may come in handy...
    fs.readFile(url, (error, data) => {
        if(error) {
            // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
            console.log(`HTTP 404: Not Found!\n${error}`);
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.end(`HTTP 404: Not Found!\n${error}`);
        } else {
            response.statusCode = 200;
            response.end(data);
        }
    });
};

exports.handleInternal = (request, response) => {
    function r(body) {
        let head = [
            '<!DOCTYPE html>'
            , '<html><head>'
            , '<meta charset="utf-8"/>'
            , '<title>Pretty Cure Server</title>'
            , '<link rel="shortcut icon" type="image/x-icon" href="/bro/favicon.ico"/>'
            , '<style>'
            , '*{font-family:monospace,sans-serif;}'
            , '</style>'
            , '</head><body>'
        ];
        var tail = '</body></html>';
        // HTTP header
        response.writeHead(200, {'Content-Type': 'text/html'});
        // HTML source
        response.write(head.join('')  );
        response.write(body.toString());
        response.end  (tail           );
    }

    let parsely    = url.parse(request.url)
        , pathname = parsely.pathname.substr(1)
        , query    = queryString.parse(parsely.query)
    ;

    switch(pathname) {
        case 'sync':
            let child = exec(
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
            let keys = Object.keys(query);
            if(keys.length == 1) {
                if(keys[0] == 'ip') {
                    if(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(query.ip)) {
                        r(
                            '<span style="color:green">'
                            + query.ip
                            + ' has been invited to the Pretty Cure party! :D</span>'
                        );
                        let child = exec(
                            'sh /home/ubuntu/Euclidian/Server/ip_address.sh ' + query.ip
                            , (error, stdout, stderr) => {
                                if (error) {
                                    console.error(`exec error: ${error}`);
                                    return;
                                }
                                console.log(query.ip + '; Invited! :D');
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
};
