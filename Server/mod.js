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

// Invariable Variables
const
    home     = fs.readFileSync('./etc/home')
    , server = fs.readFileSync(home + '/server')
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
        case 'config':
            config(response, query);
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

const debate = (parameters) => {
    let message = '';
    if(0 < parameters[0].length) {
        message += 'REQ: ?'
        for(var r in parameters[0]) {
            message += parameters[0][r] + '=';
            if(r < parameters[0].length -1) {message += '&';}
        }
    }
    if(0 < parameters[1].length) {
        message += 'OPT: ?'
        for(var r in parameters[1]) {
            message += parameters[1][r] + '=';
            if(r < parameters[1].length -1) {message += '&';}
        }
    }
    return message;
}

const underflow = (response, parameters) => {
    let message = 'ERR: Too many parameters!<br>';
    message += debate(parameters);
    TIF(response, 'red', message);
}

const ufo = (response, parameters) => {
    let message = 'ERR: Unrecognised variable!<br>';
    message += debate(parameters);
    TIF(response, 'red', message);
}

const overflow = (response, parameters) => {
    let message = 'ERR: Too many parameters!<br>';
    message += debate(parameters);
    TIF(response, 'red', message);
}

const invalid = (response, v, r) => {// var, regexp
    TIF(
        response
        , 'red'
        , 'ERR: Invalid "' + v + '" variable!<br>REQ: ' + r
    );
}

// GitHub-NeCTAR Synchronisation
const sync = (response) => {
    let child = exec(
        'bash ' + home + '/Euclidian/Server/sync.sh'
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
    let
        keys = Object.keys(query)
        , r = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
        , parameters = [['ip'],[]]
    ;
    if(keys.length == 1) {
        if(keys[0] == 'ip') {
            if(r.test(query.ip)) {
                TIF(
                    response
                    , 'green'
                    , query.ip
                    + ' has been invited to the Pretty Cure party! :D'
                );
                let child = exec(
                    'bash ' + home + '/Euclidian/Server/ip_address.sh A '
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
                invalid(response, keys[0], r)
            }
        } else {
            ufo(response, parameters);
        }
    } else {
        if(keys.length < 1) {
            underflow(response, parameters);
        } else {
            overflow(response, parameters);
        }
    }
};

// SAGE2 Reconfigurations
const config = (response, query) => {
    let
        parameters = [[], ['cols', 'rows', 'width', 'height', 'hex', 'rgba']]
        , cols     = '2'
        , r_cols   = /\d+/
        , rows     = '1'
        , r_rows   = /\d+/
        , width    = '1920'
        , r_width  = /\d+/
        , height   = '1080'
        , r_height = /\d+/
        , hex      = '003366'
        , r_hex    = /\d{6}/
        , rgba     = '255,0,0,1.0'
        , r_rgba   = /\d{1,3},\d{1,3},\d{1,3},\d\.\d/
        , keys = Object.keys(query)
    ;
    if(6 < keys.length) {
        overflow(response, parameters);
    } else if(keys.length < 1) {
        underflow(response, parameters);
    }
    for(let e of keys) {
        console.log(e);
        switch(e) {
            case 'cols':
                if(r_cols.test(query.cols)) {cols = query.cols;}
                else {invalid(response, e, r_cols);}
                break;
            case 'rows':
                if(r_rows.test(query.rows)) {rows = query.rows;}
                else {invalid(response, e, r_rows);}
                break;
            case 'width':
                if(r_width.test(query.width)) {width = query.width;}
                else {invalid(response, e, r_width);}
                break;
            case 'height':
                if(r_height.test(query.height)) {height = query.height;}
                else {invalid(response, e, r_height);}
                break;
            case 'hex':
                if(r_hex.test(query.hex)) {hex = query.hex;}
                else {invalid(response, e, r_query);}
                break;
            case 'rgba':
                if(r_rgba.test(query.rgba)) {rgba = query.rgba;}
                else {invalid(response, e, r_rgba);}
                break;
            default:
                ufo(response, parameters);
                break;
        }
    }
    let args =
        cols     + ' '
        + rows   + ' '
        + width  + ' '
        + height + ' '
        + hex    + ' '
        + rgba
    TIF(
        response
        , 'green'
        , 'cols      : ' + cols   + '<br/>'
        + 'rows      : ' + rows   + '<br/>'
        + 'width     : ' + width  + '<br/>'
        + 'height    : ' + height + '<br/>'
        + 'background: ' + hex    + '<br/>'
        + 'foreground: ' + rgba
    );
    let child = exec(//sage2.sh cols rows width height hex/bg rgba/fg
        'bash ' + home + '/Euclidian/Server/sage2.sh ' + args
        , (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log('Reconfigure SAGE2 with ' + args);
        }
    );
}

const hello_world = (response) => {
    let link = (a, b) => '<a href="' + a + '" target="_blank">' + b + '</a>';
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
        + '<br/>'
        + link(
            'http://' + server + ':1337/config?'
            + 'cols=2&rows=1&width=1920&height=1080&hex=003366&rgba=255,0,0,1.0'
            , 'SAGE2 Reconfigurations'
        )
        + '<br/><br/><br/>'
        + link(
            'https://dashboard.rc.nectar.org.au/project/instances/', 'NeCTAR'
        )
        + '<br/>'
        + link(
            'https://github.com/Pretty-Cure-5/Euclidian/commits/master'
            , 'GitHub Changes'
        )
        + '<br/>'
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
    , debate        : debate
    , underflow     : underflow
    , ufo           : ufo
    , overflow      : overflow
    , invalid       : invalid
    , sync          : sync
    , firewall      : firewall
    , config        : config
    , hello_world   : hello_world
}
