const view = require("./view.js")
const model = require("./model.js")

let controller = {
    start: function(res){
        view.showCustomer(res)
    },

}

console.log(model.showAll())
//view.placeOrder(model.showStock);