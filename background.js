var currentHost = "empty.local";
var targetUrls = "empty.local";

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        details.requestHeaders.push({ name: "Host", value: currentHost});
        return {requestHeaders: details.requestHeaders};
    },
    {urls: ['*://' + targetUrls.replace('http://').replace('https://') + '/*']}, 
    ["blocking", "requestHeaders"]
);
chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        details.requestHeaders.push({ name: "Host", value: currentHost});
        return {requestHeaders: details.requestHeaders};
    },
    {urls: ['*://' + currentHost + '/*']},
    ["blocking", "requestHeaders"]
);

