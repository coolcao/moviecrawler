'use strict';

const fetch = require('./lib/fetch.js');
const Crawler = require('./lib/crawler.js');
const dbservice = require('./lib/dbservice.js');

let crawler = new Crawler();

crawler.on('getMovieInfo',function (movie) {
    let url = movie.detailUrl;
    // console.log('正在获取'+movie.title+'的详情页面：' + movie.detailUrl);
    crawler.getMovieInfo(url).then(result => {
        dbservice.save(result).then(_r => {
            console.log(`保存【${result.name}】成功`);
        }).catch(err => {
            console.log(`保存${JSON.stringify(result)}出错，` + err.message);
        });
    }).catch(err => {
        console.log(err);
    });
});

crawler.getMovieList('http://www.80s.tw/movie/list/4----').then(result => {
    console.log(result.pagers);
    let list = result.detailUrlList;
    list.forEach(item => {
        // console.log(JSON.stringify(item));
        crawler.emit('getMovieInfo',item);
    });
}).catch();

// crawler.emit('getMovieInfo',{title:'测试',detailUrl:'http://www.80s.tw/movie/19854'});
