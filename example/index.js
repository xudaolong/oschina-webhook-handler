/**
 * 该文件名- index
 * 编码作者- 许道龙
 * 创建日期- 2017/9/4 00:20
 * 作者邮箱- xudaolong@vip.qq.com
 * 作者博客- https://github.com/xudaolong
 * 修改时间-
 * 修改备注-
 * 编码内容-
 */
'use strict';
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
