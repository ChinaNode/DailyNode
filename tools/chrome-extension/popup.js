// var post_site_url = 'http://localhost:3000/post/submit';
var post_site_url = 'http://news.rednode.cn/post/submit';

/* post 数据 */
function postData(url, data, callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                callback(data);
            } else {
                callback({code: 1, message: '数据POST失败!'});
            }
        }
    }
    var arg = [];
    for(var i in data)
        arg.push(i + '=' + data[i]);
    xhr.open('POST', url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
    xhr.send(arg.join('&'));
}

/*
    设置表单元素的值
 */
function setValue(data){
    document.getElementById('title').value = data.title;
    document.getElementById('link').value = data.link;
}

/*
 * 提交站点
 */
function submit_info(e){
    e.preventDefault();
    var post_data = {
        title: document.getElementById('title').value,
        link: document.getElementById('link').value
    };
    console.log(post_data)
    postData(post_site_url, post_data, function(data){
        var info_id = data.code == 0 ? 'info' : 'error'
            , info = document.getElementById(info_id);
        info.style.display = 'inline';
    })
    return false;
}


/* 代码执行 */
document.addEventListener('DOMContentLoaded', function(){
    // 执行content-script
    chrome.tabs.executeScript(null, {file: 'get-info.js'});
    // 提交事件绑定
    document.getElementById('site-info-form').addEventListener('submit', submit_info);
});
