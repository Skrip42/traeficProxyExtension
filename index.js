document.addEventListener('DOMContentLoaded', function () {
        traeficInstanceList.load(function () {
            traeficInstanceList.getListWithHost(function (result) {
                drowRouts(result);
                eventInit();
            });
        });
    }
);

function eventInit() {
    document.getElementById('traeficHostAccept').addEventListener(
        'click', 
        function () {
            traeficInstanceList.add(
                document.getElementById('traeficHostInput').value,
                function () {
                    traeficInstanceList.save(function () {
                        traeficInstanceList.getListWithHost(function (result) {
                            drowRouts(result);
                        });
                    }); 
                }
            );    
        }
    );
    document.getElementById('traeficInstanceContainer').addEventListener(
        'click',
        function (e) {
            if (e.target.getAttribute('data-link')) {
                chrome.tabs.create({url:e.target.getAttribute('data-link')});
                return;
            }
            if (e.target.classList.contains('deleteTraeficProxy')) {
                var removedHost = e.target.getAttribute('data-traefic');
                traeficInstanceList.getListWithHost(function (result) {
                    for (var i =0; i = result.length; i++) {
                        chrome.extension.getBackgroundPage().removeHost(result[i]);
                    }
                    traeficInstanceList.remove(removedHost);
                    traeficInstanceList.save(function (result) {
                        traeficInstanceList.getListWithHost(function (result) {
                            drowRouts(result);
                        })
                    }); 
                });
                return;
            }
            if (e.target.classList.contains('route')) {
                var route = e.target
            } else if (e.target.parentNode.classList.contains('route')) {
                var route = e.target.parentNode
            } else {
                return;
            }
            if (route.classList.contains('active')) {
                route.classList.remove('active');
                chrome.extension.getBackgroundPage().removeHost(route.getAttribute('data-rout'));
            } else {
                route.classList.add('active');
                chrome.extension.getBackgroundPage().addHost(
                    route.getAttribute('data-rout'),
                    route.getAttribute('data-host')
                );
            }
        }
    )
}

function drowRouts(traeficHosts) {
    var ret = ''
    for (var traeficHost in traeficHosts) {
        var tHosts = traeficHosts[traeficHost]
        var sHost = traeficHost.replace('https://', '');
        var sHost = sHost.replace('http://', '');
        ret += '<div data-host="' + traeficHost + '">'
        ret += '<div class="traeficHostTitle">'
        ret += '<div class="traefikName">' + traeficHost + '</div>'
        ret += '<div class="traefikLink">';
        ret += '<i class="material-icons" data-link="' + traeficHost + ':8080">open_in_new</i>'
        ret += '</div>';
        ret += '<div class="traefikDelete"><i class="material-icons deleteTraeficProxy" data-traefic="'
            + traeficHost + '">delete</i></div>'
        ret += '<div class="clearfix"></div>'
        ret += '</div>'
        for (var i = 0; i < tHosts.length; i++) {
            ret += '<div class="route';
            if (
                chrome.extension.getBackgroundPage().isHostActive(tHosts[i])
            ) {
                ret += ' active';
            }
            ret += '" data-host="' + sHost + '" data-rout="' + tHosts[i] + '">';
            ret += '<div class="activeIcon"><i class="material-icons">check_circle</i></div>';
            ret += '<div class="routeName">' + tHosts[i] + '</div>';
            ret += '<div class="routeLink">';
            ret += '<i class="material-icons" data-link="' + tHosts[i] + '">open_in_new</i>'
            ret += '</div>';
            ret += '<div class="clearfix"></div>'
            ret += '</div>';
        }
        ret += '</div>'
    }
    document.getElementById('traeficInstanceContainer').innerHTML = ret;
}
