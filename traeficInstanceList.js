var traeficInstanceList = {
    traeficInstances : [],

    save : function (callback) {
        chrome.storage.sync.set(
            {traeficInstances: this.traeficInstances},
            function () {
                callback();
            }
        );
    },

    load : function (callback) {
        console.log('load');
        var self = this;
        chrome.storage.sync.get(
            ['traeficInstances'],
            function (result) {
                var list = result.traeficInstances;
                if (typeof list === 'undefined') {
                    list = [];
                }
                self.traeficInstances = list;
                console.log(list);
                callback();
            }
        );
    },

    getHosts : function (traeficHost, callback) {
        var traeficHost = traeficHost + ':8080/api/providers'
        var hosts = [];
        var xhr = new XMLHttpRequest();
        xhr.open("GET", traeficHost, true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4)  {
            var serverResponse = JSON.parse(xhr.responseText);
            for (var providerName in serverResponse) {
                var provider = serverResponse[providerName];
                for (var frontendName in provider.frontends) {
                    var frontend = provider.frontends[frontendName];
                    for (var routeName in frontend.routes) {
                        var route = frontend.routes[routeName];
                        hosts.push(route.rule.replace('Host:', ''));
                    }
                }
            }
            callback(hosts);
          }
        };
        xhr.send(null);
    },

    getListWithHost : function (callback) {
        var result = {};
        var self = this;
        if (!this.traeficInstances.length) {
            callback(result);
        }
        console.log(this.traeficInstances);
        for (var i = 0; i < this.traeficInstances.length; i++) {
            this.getHosts(
                this.traeficInstances[i],
                function (traeficHost, limit) {
                    return function (hosts) {
                        result[traeficHost] = hosts;
                        console.log(result);
                        console.log(limit);
                        console.log(Object.keys(result).length);
                        if (Object.keys(result).length == limit) {
                            callback(result);
                        }
                    }
                } (this.traeficInstances[i], this.traeficInstances.length)
            ); 
        }
    },

    add : function (traeficHost) {
        this.traeficInstances.push(traeficHost);
    },
}
