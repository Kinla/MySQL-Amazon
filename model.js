const connection = require("./connection.js")
const view = require("./view.js")

const model = {
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
                let stock = res[0].stock_quantity
                console.log(`Current stock: ${stock}`)
            })
    }

}

module.exports = model
