/**
 * 该文件名- index
 * 编码作者- 许道龙
 * 创建日期- 2017/9/4 10:20
 * 作者邮箱- xudaolong@vip.qq.com
 * 作者博客- https://github.com/xudaolong
 * 修改时间-
 * 修改备注-
 * 编码内容-
 */

'use strict';

const EventEmitter = require('events').EventEmitter;
const bl = require('bl');

function findHandler(url, arr) {
    let ret = arr[0];
    for (let i = 0; i < arr.length; i++) {
        if (url.split('?').shift() === arr[i].path)
            ret = arr[i]
    }
    return ret;
}

function create(options) {

    // make it an EventEmitter, sort of
    handler.__proto__ = EventEmitter.prototype;
    EventEmitter.call(handler);

    return handler;

    function handler(req, res, callback) {

        // throw err
        const hasError = (msg) => {
            res.writeHead(400, {'content-type': 'application/json'});
            res.end(JSON.stringify({error: msg}));

            const err = new Error(msg);

            handler.emit('error', err, req);
            callback(err);
        };

        // check option matching
        const checkOption = (currOption) => {
            if (typeof currOption !== 'object') {
                throw new TypeError('must provide an options object');
            }

            if (typeof currOption.path !== 'string') {
                throw new TypeError('must provide a \'path\' option');
            }

            if (typeof currOption.secret !== 'string') {
                throw new TypeError('must provide a \'secret\' option');
            }
        };

        // find and set current options with req
        let currentOptions;
        if (Array.isArray(options)) {
            currentOptions = findHandler(req.url, options);
        } else {
            currentOptions = options;
        }

        // check request path and method
        if (req.url.split('?').shift() !== currentOptions.path || req.method !== 'POST') {
            return callback();
        }

        checkOption(currentOptions);

        req.pipe(bl(function (err, data) {
            if (err) {
                return hasError(err.message);
            }

            let obj;
            let event;
            try {
                obj = JSON.parse(data.toString());
                event = obj.hook_name;
                const pass = obj.password;

                if (!event) {
                    return hasError(`No X-OsChina-Event found on ${event} data`);
                }

                if (!pass || pass !== currentOptions.secret) {
                    return hasError(`No X-OsChina-Password valid on ${event} data`);
                }

            } catch (e) {
                return hasError(e);
            }

            res.writeHead(200, {'content-type': 'application/json'});
            res.end('{"ok":true}');

            const emitData = {
                event,
                payload: obj,
                protocol: req.protocol,
                host: req.headers.host,
                url: req.url,
            };

            handler.emit(event, emitData);
            handler.emit('*', emitData);
        }));
    }
}


module.exports = create
;