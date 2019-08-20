var currentHost = "symfony.test.local";
var targetUrls = "127.0.0.1";

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        console.log(1);
        console.log(details);
        details.requestHeaders.push({ name: "Host", value: currentHost});
        console.log(details);
        return {requestHeaders: details.requestHeaders};
    },
    {urls: ['*://' + targetUrls.replace('http://', '').replace('https://', '') + '/*']}, 
    ["blocking", "requestHeaders"]
);
chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        console.log(2);
        console.log(details);
        details.requestHeaders.push({ name: "Host", value: currentHost});
        details.url = details.url.replace(currentHost, targetUrls.replace('http://', '').replace('https://', ''));
        console.log(details);
        return {requestHeaders: details.requestHeaders};
    },
    {urls: ['*://' + currentHost + '/*']},
    ["blocking", "requestHeaders"]
);

