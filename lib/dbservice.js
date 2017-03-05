'use strict';

const fs = require('fs');

const save = (movie) => {
    return new Promise((resolve, reject) => {
        fs.appendFile(__dirname + '/../db.json', ',' + JSON.stringify(movie), (err) => {
            if (err) reject(err);
            resolve(true);
        });
    });
}

module.exports = {
    save
}