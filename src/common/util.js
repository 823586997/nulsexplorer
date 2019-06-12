let util={
    //返回指定格式的时间
    getTime: function (date) {
        date = date || new Date();
        function formatNumber(n) {
            n = n.toString();
            return n[1] ? n : '0' + n
        }
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        return [formatNumber(year), formatNumber(month), formatNumber(day)].join('-') + ' ' + [formatNumber(hour), formatNumber(minute), formatNumber(second)].join(':')
    },

    getDate: function (date) {
        return this.getTime(date).split(" ")[0];
    },
    
    addDays: function(date, days){
        return this.addTimes(date, 60, 60, 24, days);     
    },
    addHours: function(date, hours){
        return this.addTimes(date, 60, 60, hours, 1);      
    },
    addMinutes: function(date, minutes){
        return this.addTimes(date, 60, minutes, 1, 1);
    },
    addSeconds: function(date, secs){
        return this.addTimes(date, secs, 1, 1, 1);      
    },
    addTimes: function(date, s, m, h, days){
      //new时间对象
      date = date || new Date();
      //转换成毫秒
      var mt = date.getTime();
      //把毫秒时间对象减7天，转换成时间对象
      var premt = mt + 1000 * s * m * h * days;
      var dt = new Date(premt);
      return dt;        
    },
    
    //格式化时间  
    //参数: 时间对象 
    //      要转换换的格式 年:yyyy 月:MM 日: dd  时(24):HH 时(12):hh 分:mm 秒:ss 
    //返回值: 按传的参数输出字符串
    formatTime: function(obj, arg){
      function fixNum(num)
      {
        num = parseInt(num);
        if(num < 10)
          return "0" + num;
        return num;  
      }
      function to12Hour(num)
      {
         num = parseInt(num);
         if(num > 12)
         {
           return num - 12; 
         } 
         return num;
      }
      if(!obj)
        obj = new Date();
      var year = obj.getFullYear();
      var month = fixNum(obj.getMonth() + 1);
      var date = fixNum(obj.getDate());
      var hour24 = fixNum(obj.getHours());
      var hour12 = fixNum(to12Hour(obj.getHours()));
      var minute = fixNum(obj.getMinutes());
      var second = fixNum(obj.getSeconds());
      if(!arg)
      {
        return "" + year + month + date + hour24 + minute + second;  
      }
      arg = arg.replace(/yyyy/g, year);
      arg = arg.replace(/MM/g, month);
      arg = arg.replace(/dd/g, date);
      arg = arg.replace(/HH/g, hour24);
      arg = arg.replace(/hh/g, hour12);
      arg = arg.replace(/mm/g, minute);
      arg = arg.replace(/ss/g, second);
      return arg;      
    },
    getQueryString: function (queryStringName){
        var returnValue="";
        var URLString = window.location.href;
        var serachLocation=-1;
        var queryStringLength=queryStringName.length;
        do{
            serachLocation=URLString.indexOf(queryStringName+"\=");
            if (serachLocation!=-1)
            {
                if ((URLString.charAt(serachLocation-1)=='?') || (URLString.charAt(serachLocation-1)=='&'))
                {
                    URLString=URLString.substr(serachLocation);
                    break;
                }
                URLString=URLString.substr(serachLocation+queryStringLength+1);
            }

        }
        while (serachLocation!=-1)
        if (serachLocation!=-1){
            var seperatorLocation=URLString.indexOf("&");
            if (seperatorLocation==-1)
            {
                returnValue=URLString.substr(queryStringLength+1);
            }
            else
            {
                returnValue=URLString.substring(queryStringLength+1,seperatorLocation);
            }
        }
        return returnValue;
    },
    getErrorCode: function(errStr) {
      return parseInt(errStr.toString().split("__")[1]);
    },
    getErrorDesc: function(errStr) {
      return errStr.toString().split("__")[2];
    },
};
export default util;
