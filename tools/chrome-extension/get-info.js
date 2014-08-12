/* 获取host, title, descript */
var uri = location.href
    , title_tag = document.getElementsByTagName('title')[0]
    , title = title_tag ? title_tag.text : ''
    , message = {
        status: 1,
        link: uri,
        title: title
    };

// 发送信息
chrome.runtime.sendMessage(message, function(response) {
    console.log(response)
});