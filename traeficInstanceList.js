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
        var self = this;
        chrome.storage.sync.get(
            ['traeficInstances'],
            function (result) {
                var list = result.traeficInstances;
                if (typeof list === 'undefined') {
                    list = [];
                }
                self.traeficInstances = list;
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
                    var entryPoint = frontend.entryPoints[0]
                    for (var routeName in frontend.routes) {
                        var route = frontend.routes[routeName];
                        hosts.push(entryPoint + '://' + route.rule.replace('Host:', ''));
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
        for (var i = 0; i < this.traeficInstances.length; i++) {
            this.getHosts(
                this.traeficInstances[i],
                function (traeficHost, limit) {
                    return function (hosts) {
                        result[traeficHost] = hosts;
                        if (Object.keys(result).length == limit) {
                            callback(result);
                        }
                    }
                } (this.traeficInstances[i], this.traeficInstances.length)
            ); 
        }
    },

    add : function (traeficHost, callback) {
        if (this.traeficInstances.indexOf(traeficHost) == -1) {
            //this.traeficInstances.push(traeficHost);
            this.getHosts(traeficHost, function (list) {
                return function () {
                    list.push(traeficHost);
                    callback();
                }
            } (this.traeficInstances));
        }
    },

    remove: function (traeficHost) {
        this.traeficInstances.splice(this.traeficInstances.indexOf(traeficHost), 1);
    }
}
