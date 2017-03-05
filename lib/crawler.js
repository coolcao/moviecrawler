'use strict'
const fetch = require('./fetch.js');
const cheerio = require('cheerio');
const _url = require('url');
const EventEmitter = require('events');


let replaceSpace = function(str) {
    if (Object.prototype.toString.call(str) !== '[object String]') {
        throw new Error('str must be String ');
    }
    return str.replace(/ /g, '').replace(/\n/g, '');
}


class Crawler extends EventEmitter {
    getMovieList(url) {
        let urlObj = _url.parse(url);
        return fetch.get(url).then(body => {
            let $ = cheerio.load(body);
            let list = $('ul.me1>li');
            let pager = $('div.pager>a');

            let detaillist = [];

            list.each((i, item) => {
                let $item = $(item);
                let a = $item.children('a');
                let h3 = $item.children('h3');
                let des = $item.children('span.tip');
                let title = $(h3).text();
                let detailUrl = $(a).attr('href');
                let description = $(des).text();
                title = title && replaceSpace(title);
                description = description && replaceSpace(description);

                //拼装完整的url
                if (!detailUrl.includes(urlObj.host)) {
                    detailUrl = urlObj.protocol + '//' + urlObj.host + detailUrl;
                }

                detaillist.push({
                    title: title,
                    detailUrl: detailUrl,
                    description: description
                });
            });

            let pagers = [];
            pager.each((i, item) => {
                let $item = $(item);
                let item_url = $item.attr('href');
                if (!item_url.includes(urlObj.host)) {
                    item_url = urlObj.protocol + urlObj.host + item_url;
                }
                pagers.push($item.attr('href'));
            });

            return {
                detailUrlList: detaillist,
                pagers: pagers
            };

        })
    }



    /**
     * 获取电影详细信息
     * @param  {string} url 详情页链接
     * @return {object}     返回的包装类
     */
    getMovieInfo(url) {
        let urlObj = _url.parse(url);
        return new Promise((resolve, reject) => {
            return fetch.get(url).then(body => {
                try {
                    let $ = cheerio.load(body);
                    let downloadlist = $('li.dlurlelement.backcolor1');

                    let info = $('div.info');
                    let title = $(info).children('h1').text();

                    let $downloadEle = $(downloadlist[0]);

                    let $dname = $($downloadEle.children('span.dlname'));
                    let $xunlei = $($downloadEle.children('span.xunlei'));

                    let down = {
                        name: title,
                        down_url: $dname.children('input').attr('value'),
                        thunder: {
                            href: $xunlei.children('a').attr('href'),
                            thundertitle: $xunlei.children('a').attr('thunderrestitle'),
                            thunderhref: $xunlei.children('a').attr('thunderhref')
                        }
                    };
                    resolve(down);

                } catch (err) {
                    reject(err);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
}



module.exports = Crawler;