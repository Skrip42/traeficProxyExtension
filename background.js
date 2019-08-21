var activeHost = {
};

var tabList = {
}

function isHostActive(host) {
    return typeof activeHost[host] !== 'undefined';
}

function addHost(fromUrl, toUrl) {
    activeHost[fromUrl] = new hostInstance(fromUrl, toUrl);
    activeHost[fromUrl].appendListeners();
}

function removeHost(fromUrl) {
   activeHost[fromUrl].removeListeners();
   delete activeHost[fromUrl];
}

var hostInstance = function (fromUrl, toUrl) {
    this.fromUrl = fromUrl;
    this.toUrl = toUrl;
    this.replaceUrl = function (details) {
        tabList[details.tabId] = fromUrl;
        var protocolPattern = new RegExp('.*:\/\/');
        var oldUrl = fromUrl.replace(protocolPattern, '');
        return {
            redirectUrl: details.url.replace(oldUrl, toUrl)
        }
    };
    this.replaceHeader = function (details) {
        if (tabList[details.tabId] == fromUrl) {
            var protocolPattern = new RegExp('.*:\/\/');
            var oldUrl = fromUrl.replace(protocolPattern, '');
            details.requestHeaders.push({ name: "Host", value: oldUrl});
            return {requestHeaders: details.requestHeaders};
        } else {
            return;
        }
    };
    this.appendListeners = function () {
        chrome.webRequest.onBeforeRequest.addListener(
            this.replaceUrl,
            {urls: [this.fromUrl + '/*']},
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
