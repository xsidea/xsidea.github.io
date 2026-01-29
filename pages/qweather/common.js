const qweather = {
    // api:'https://api.qweather.com/',
    api: 'https://devapi.qweather.com/',// 免费版 
    key: 'aee65f04692f43c3a815a44cecdeb486',
    locationId: '101030100', // 天津
    day7: function (calllback) {
        var xsQweather = xs.storage.local.get('xsQweather');
        if (xs.is.empty(xsQweather)) {
            xs.ajax({
                url: 'https://devapi.qweather.com/v7/weather/7d?location=' + qweather.locationId + '&key=' + qweather.key,
                method: 'GET',
                success: function (res) {
                    xs.storage.local.set('xsQweather', res, 86400);
                    setTimeout(function(){
                        xsQweather = xs.storage.local.get('xsQweather');
                        typeof calllback === 'function' && calllback(xsQweather);
                    },100)                    
                }
            })
        }else{
            typeof calllback === 'function' && calllback(xsQweather);
        }
        
        
    }
}