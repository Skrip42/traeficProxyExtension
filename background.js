//var currentHost = "symfony.test.local";
//var targetUrls = "31.135.34.71";

var activeHost = {
};

function isHostActive(host) {
    return typeof activeHost[host] !== 'undefined';
}

function addHost(fromUrl, toUrl) {
    console.log('add host ' + fromUrl);
    activeHost[fromUrl] = new hostInstance(fromUrl, toUrl);
    activeHost[fromUrl].appendListeners();
}

function removeHost(fromUrl) {
   console.log('remove host ' + fromUrl);
   activeHost[fromUrl].removeListeners();
   delete activeHost[fromUrl];
}

var hostInstance = function (fromUrl, toUrl) {
    this.fromUrl = fromUrl;
    this.toUrl = toUrl;
    this.replaceUrl = function (details) {
        console.log(fromUrl, toUrl, details);
        return {
            redirectUrl: details.url.replace(fromUrl, toUrl)
        }
    };
    this.replaceHeader = function (details) {
        console.log(fromUrl, toUrl, details);
        details.requestHeaders.push({ name: "Host", value: fromUrl});
        return {requestHeaders: details.requestHeaders};
    };
    this.appendListeners = function () {
        chrome.webRequest.onBeforeRequest.addListener(
            this.replaceUrl,
            {urls: ['*://' + this.fromUrl + '/*']},
            ["blocking"]
        );
        chrome.webRequest.onBeforeSendHeaders.addListener(
            this.replaceHeader,
            {urls: ['*://' + this.toUrl + '/*']},
            ["blocking", "requestHeaders" ]
        );
    };
    this.removeListeners = function () {
        chrome.webRequest.onBeforeRequest.removeListener(this.replaceUrl);
        chrome.webRequest.onBeforeSendHeaders.removeListener(this.replaceHeader);
    };
}

//chrome.webRequest.onBeforeRequest.addListener(
        //function (details) {
            //console.log(details);
            //return {
                //redirectUrl: details.url.replace(currentHost, targetUrls)
            //}
        //},
        //{ urls: ['*://' + currentHost + '/*']},
        //["blocking"]
    //);

//chrome.webRequest.onBeforeSendHeaders.addListener(
    //function (details) {
        //console.log(details);
        //details.requestHeaders.push({ name: "Host", value: currentHost});
        //return {requestHeaders: details.requestHeaders};
    //},
    //{urls: ['*://' + targetUrls + '/*']}, 
    //["blocking", "requestHeaders"]
//);
