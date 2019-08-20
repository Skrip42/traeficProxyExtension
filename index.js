//window.addEventListener("load", function (e)
document.addEventListener('DOMContentLoaded', function () {
        //var traeficHost = 'http://31.135.34.71:8080';
        traeficInstanceList.load(function () {
            traeficInstanceList.getListWithHost(function (result) {
                console.log(result); 
                drowRouts(result);
                eventInit();
            });
        });
    }
);

function eventInit() {
    console.log('eventInit');
    document.getElementById('traeficHostAccept').addEventListener(
        'click', 
        function () {
            //console.log(document.getElementById('traeficHostInput').value);
            traeficInstanceList.add(
                document.getElementById('traeficHostInput').value
            );    
            traeficInstanceList.save(function () {
                traeficInstanceList.getListWithHost(function (result) {
                    //console.log(result);
                    drowRouts(result);
                });
            }); 
        }
    );
    document.getElementById('traeficInstanceContainer').addEventListener(
        'click',
        function (e) {
            //var route;
            if (e.target.classList.contains('route')) {
                var route = e.target
            } else if (e.target.parentNode.classList.contains('route')) {
                var route = e.target.parentNode
            } else {
                return;
            }
            //var currentElement = document.getElementsByClassName('active')[0];
            //if (typeof currentElement !== 'undefined') {
                //currentElement.classList.remove('active');
            //}
            if (route.classList.contains('active')) {
                route.classList.remove('active');
                console.log('disable: ' + route.getAttribute('data-rout'));
                chrome.extension.getBackgroundPage().removeHost(route.getAttribute('data-rout'));
            } else {
                route.classList.add('active');
                console.log('enabled: ' + route.getAttribute('data-rout'));
                chrome.extension.getBackgroundPage().addHost(
                    route.getAttribute('data-rout'),
                    route.getAttribute('data-host')
                );
            }
            //chrome.extension.getBackgroundPage().targetUrls 
                //= route.getAttribute('data-host');
            //chrome.extension.getBackgroundPage().currentHost
                //= route.getAttribute('data-rout');
            //route.classList.add('active');
        }
    )
}

function drowRouts(traeficHosts) {
    var ret = ''
    //var currentHost = chrome.extension.getBackgroundPage().currentHost;
    //var currentTraeficHost = chrome.extension.getBackgroundPage().targetUrls;
    //console.log(currentHost);
    //console.log(currentTraeficHost);
    for (var traeficHost in traeficHosts) {
        var tHosts = traeficHosts[traeficHost]
        var sHost = traeficHost.replace('https://', '');
        var sHost = sHost.replace('http://', '');
        //tHosts = tHosts.replace('https://', '');
        //tHosts = tHosts.replace('http://', '');
        ret += '<div data-host="' + traeficHost + '">'
        ret += '<div class="traeficHostTitle">'
        ret += '<span><a href="' + traeficHost + '">' + traeficHost + '</a></span>'
        ret += '<span><i class="material-icons">delete</i></span>'
        ret += '</div>'
        for (var i = 0; i < tHosts.length; i++) {
            ret += '<div class="route';
            if (
                chrome.extension.getBackgroundPage().isHostActive(tHosts[i])
            ) {
                ret += ' active'
            }
            ret += '" data-host="' + sHost
                + '" data-rout="' + tHosts[i] + '">'
            ret += '<span class="activeIcon"><i class="material-icons">check_circle</i></span>'
            ret += '<span>' + tHosts[i] + '</span>'
            ret += '</div>'
        }
        ret += '</div>'
    }
    document.getElementById('traeficInstanceContainer').innerHTML = ret;
}
