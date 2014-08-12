// recieve message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Background', request);
    var response = request.status == 1 ? {status: 1, info: '收到消息'} : {status: 0, info: ''};
    sendResponse(response);
    var popup = chrome.extension.getViews({type: "popup"})[0];
    popup.setValue(request);
})
