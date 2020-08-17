inventory = window.inventory || {};

inventory.init = function () {
}

inventory.load = function(callback){
    const options = {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: null
    }
    fetch(`/api/inventory`, options)
    .then(response => response.json())
    .then(function (response) {
        callback(response)
    });
}

inventory.load_by_id = function(id, callback){
    const options = {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: null
    }
    fetch(`/api/inventory/${id}`, options)
    .then(response => response.json())
    .then(function (response) {
        callback(response)
    });
}
