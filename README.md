# oschina-webhook-handler

[![NPM](https://nodei.co/npm/oschina-webhook-handler.png?downloads=true&downloadRank=true)](https://nodei.co/npm/oschina-webhook-handler/)
[![NPM](https://nodei.co/npm-dl/oschina-webhook-handler.png?months=6&height=3)](https://nodei.co/npm/oschina-webhook-handler/)

The oschina allows you to register Webhooks for your repositories. Each time an event occurs on your repository, whether it be pushing code, filling issues or creating pull requests, the webhook address you register can be configured to be pinged with details.

This library is a small handler (or "middleware" if you must) fornode.jsweb servers that handles all the logic of receiving and verifying webhook requests from the oschina.

(The base code with https://github.com/rvagg/github-webhook-handler)

## Event Links

You can see the url(http://git.mydoc.io/?t=154711) and find events.

- note_hooks
- merge_request_hooks
- issue_hooks
- push_hooks
- tag_push_hooks

## Installation

- npm install oschina-webhook-handler@latest

## Example

```

const http = require('http');
const createHandler = require('../lib/index');
const handler = createHandler([
    {path: '/incoming', secret: 'xudaolong'},
    {path: '/sucheye', secret: 'xudaolong'},
]);

// 上面的 secret 保持和 oschina 后台设置的一致
function run_cmd(cmd, args, callback) {
    const spawn = require('child_process').spawn;
    const child = spawn(cmd, args);
    let resp = '';

    child.stdout.on('data', function (buffer) {
        resp += buffer.toString();
    });
    child.stdout.on('end', function () {
        callback(resp);
    });
}

http.createServer(function (req, res) {
    handler(req, res, function (err) {
        res.statusCode = 404;
        res.end('no such location ke pa');
    });
}).listen(5555);

handler.on('error', function (err) {
    console.error('Error:', err.message);
});

// 去官网查看相关的事件:http://git.mydoc.io/?t=154711
handler.on('push_hooks', function (event) {
    console.log('Received a push event for %s to %s', event.payload.repository.name, event.url);
    switch (event.url) {
        case '/incoming':
            // do sth about
            // run_cmd('sh', ['./prod.sh'], function (text) {
            //     console.log(text);
            // });
            console.log('incoming');
            break;
        case '/sucheye':
            console.log('sucheye');
            // do sth about webhook2
            break;
        default:
            console.log('default');
            // do sth else or nothing
            break
    }
});


```


