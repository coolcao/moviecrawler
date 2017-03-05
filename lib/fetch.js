'use strict'

const http = require('http');

let opt = {

};

const get = (url) => {
    return new Promise((resolve, reject) => {
        if (!url) {
            reject('url不能为空');
        } else {
            http.get(url, (res) => {
                const statusCode = res.statusCode;
                const contentType = res.headers['content-type'];
                let error;
                if (statusCode !== 200) {
                    error = new Error(`Request Failed.\n` +
                        `Status Code: ${statusCode}`);
                }
                if (error) {
                    console.log(error.message);
                    // consume response data to free up memory
                    res.resume();
                    reject(error);
                }
                res.setEncoding('utf8');
                let rawData = [];
                res.on('data', (chunk) => rawData.push(chunk));
                res.on('end', () => {
                    resolve(rawData.toString());
                });
            }).on('error', (e) => {
                console.log(`Got error: ${e.message}`);
                reject(e);
            });
        }
    });

}

module.exports = {
    get
}