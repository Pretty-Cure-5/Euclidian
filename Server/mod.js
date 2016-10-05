/*
vim mod.js; node sys.js -li
https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
*/

// Modulated Modules
const
    fs = require('fs')
    , url = require('url')
    , exec = require('child_process').exec
    , queryString = require('querystring')
;

// handleExternal || handleInternal
const checkExternal = (request) => {
    return request.url.startsWith('/bro/');
};

// the /bro/ directory (the sys.js server)
const handleExternal = (request, response) => {
    let url = request.url.substr(1);
    // readFileSync is not asynchronous; this may come in handy...
    fs.readFile(url, (error, data) => {
        if(error) {
            console.log(`HTTP 404: Not Found!\n${error}`);
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.end(`HTTP 404: Not Found!\n${error}`);
        } else {
            response.statusCode = 200;
            response.end(data);
        }
    });
};

// address bar = commandline interface
const handleInternal = (request, response) => {
    let parsely    = url.parse(request.url)
        , pathname = parsely.pathname.substr(1)
        , query    = queryString.parse(parsely.query)
    ;
    switch(pathname) {
        case 'sync':
            sync(response);
            break;
        case 'firewall':
            firewall(response, query);
            break;
        default:
            hello_world(response);
            break;
    }
};

// Transmit Internal File
const TIF = (response, colour, body) => {
    let head =
        '<!DOCTYPE html>'
        + '<html><head>'
        + '<meta charset="utf-8"/>'
        + '<title>Pretty Cure Server</title>'
        + '<link'
        + ' rel="shortcut icon" type="image/x-icon" href="/bro/favicon.ico"/>'
        + '<style>'
        + 'body{font-family:monospace,sans-serif;}'
        + '</style>'
        + '</head><body>'
        + '<span style="color:' + colour + '">'
    ;
    let tail = '</span></body></html>';
    // HTTP header
    response.writeHead(200, {'Content-Type': 'text/html'});
    // HTML source
    response.write(head           );
    response.write(body.toString());
    response.end  (tail           );
};

// GitHub-NeCTAR Synchronisation
const sync = (response) => {
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
    TIF(response, 'green', 'SAGE2 Apps have been synchronised! :D');
};

// Firewall Invitations
const firewall = (response, query) => {
    let keys = Object.keys(query);
    if(keys.length == 1) {
        if(keys[0] == 'ip') {
            if(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(query.ip)) {
                TIF(
                    response
                    , 'green'
                    , query.ip
                    + ' has been invited to the Pretty Cure party! :D'
                );
                let child = exec(
                    'sh /home/ubuntu/Euclidian/Server/ip_address.sh A '
                    + query.ip
                    , (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                        console.log(query.ip + '; Invited! :D');
                    }
                );
            } else {
                TIF(
                    response
                    , 'red'
                    , 'ERR: Invalid IP address!<br>REQ: x.x.x.x'
                );
            }
        } else {
            TIF(response, 'red', 'ERR: Unrecognised variable!<br>REQ: ?ip=');
        }
    } else {
        if(keys.length < 1) {
            TIF(response, 'red', 'ERR: Missing parameter!<br>REQ: ?ip=');
        } else {
            TIF(response, 'red', 'ERR: Too many parameters!<br>REQ: ?ip=');
        }
    }
};

const hello_world = (response) => {
    let
        link = (a, b) => '<a href="' + a + '" target="_blank">' + b + '</a>'
        , server = '43.240.97.247'
    ;
    TIF(
        response
        , 'blue'
        , 'Welcome to Palmier Kingdom! :D'
        + '<br/><br/><br/>'
        + link('https://' + server + ':9090/index.html', 'SAGE2 UI')
        + '<br/>'
        + link(
            'http://' + server + ':9292/display.html?clientID=-1'
            , 'SAGE2 Overview Display'
        )
        + '<br/>'
        + link(
            'http://' + server + ':1337/sync', 'GitHub-NeCTAR synchronisation'
        )
        + '<br/>'
        + link(
            'http://' + server + ':1337/firewall?ip='
            , 'Firewall Invitations'
        )
        + '<br/><br/><br/>'
        + link('https://github.com/Pretty-Cure-5/Euclidian', 'GitHub')
        + '<br/>'
        + link(
            'https://trello.com/b/ARauINZx/pretty-cure-secret-base-scrum-board'
            , 'Trello'
        )
        + '<br/>'
        + link('https://web.skype.com/en/', 'Skype')
        + '<br/><br/><br/>'
        + link(
            'https://docs.google.com/spreadsheets/d/'
            + '1PNBJMEwX-8fp1xYTyLk_5K_6TfWP3BsGcwKvCsfWj64/'
            + 'edit?ts=57c8b3d4#gid=1910985826'
            , 'PC5 Resources'
        )
        + '<br/>('
        + link(
            'http://web.archive.org/web/20160124014556/'
            + 'http://bob.bob.bofh.org/~robm/knowledge/computer-rite.html'
            , 'Secret'
        )
        + ')'
    );
};

// Self Modularity
module.exports = {
    checkExternal   : checkExternal
    , handleExternal: handleExternal
    , handleInternal: handleInternal
    , TIF           : TIF
    , sync          : sync
    , firewall      : firewall
    , hello_world   : hello_world
}
