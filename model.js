const connection = require("./connection.js")
const view = require("./view.js")

//show entire product table

let model = {
    showAll: () => {
        connection.query(
            "SELECT * FROM products",
            function(err, res){
                if (err) throw err
                view.showCustomer(res)
            }
        )
    },
    showStock: (id) => {
        connection.query(
            "SELECT stock_quantity FROM products WHERE ?",
            {
                item_id: id
            },
            function(err, res){
                if (err) throw err
                console.log(res[0].stock_quantity)
            })
    }

}

module.exports = model