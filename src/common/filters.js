import util from "@/common/util.js";

const ft = {
    install: function(Vue) {
        // 货币格式转换 188888 -> 188,888.00
        Vue.filter('toNumberString',function(value){return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')});
        Vue.filter("timeFilter", function(v) {
            // console.log("filter ", v, isNaN(v))
            if(isNaN(v) || !v)
              return v;
            let o = new Date(v);
            let isToday = (d)=>{
              return util.formatTime(new Date(), 'yyyyMMdd') == util.formatTime(d, 'yyyyMMdd');
            }
            if(isToday(o)){
              return util.formatTime(o, 'HH:mm');
            }
            else {
              return util.formatTime(o, 'MM-dd HH:mm');
            }
        })
        let defImg = require("@/assets/pic/def-img.jpg");
        Vue.directive('img-def', {
            bind: function (el, binding, vnode) {
                el.onerror = function(){
                    el.src = defImg;
                    el.onerror = null;
                }
            }
        })        
    }
}
export default ft;

export function formatDate (date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
 };

 function padLeftZero (str) {
    return ('00' + str).substr(str.length);
 };
