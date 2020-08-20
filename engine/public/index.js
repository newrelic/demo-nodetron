index = window.index || {};

index.init = function () {
}

index.load = function(callback){
    const options = {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: null
    }
    fetch(`/api/index`, options)
    .then(response => response.json())
    .then(function (response) {
        callback(response)
    });
}
