const connection = require("./connection.js")
const inquirer = require("inquirer")
const {table} = require('table')

const customer = {
    menu: () => {
        inquirer.prompt([
            {
                type: "list",
                message: "What would you like to?",
                choices: ["SHOP", "EXIT"],
                name: "choice"
            }
        ]).then( answers => {
            switch (answers.choice) {
                case "SHOP":
                    customer.windowShop();
                    break;
                case "EXIT":
                    process.exit();
                    break;
            
                default:
                    break;
            }
            
        })
    },
    windowShop: () => {
        connection.query(
            "SELECT item_id, product_name, price FROM products",
            function(err, res){
                if (err) throw err
                let data, output;
                let headers = res.map(el => Object.keys(el))[0]
                data = res.map(el => Object.keys(el).map(key => el[key]))
                data.unshift(headers)
                output = table(data)
                console.log(output)
                customer.order();
            }
        )
    },
    order: () => {
        inquirer.prompt([
            {
                type: "input",
                message: "What is the ID of the product you would like to buy?",
                name: "id"
            },
            {
                type: "input",
                message: "How many units would you like to purchase?",
                name: "quantity"
            }
        ]).then(answers => {
            let id = answers.id
            let orderQuantity = answers.quantity
            customer.checkStock(id, orderQuantity);
        })
    },
    checkStock: (id, orderQuantity) => {
        connection.query(
            "SELECT stock_quantity FROM products WHERE ?",
            {
                item_id: id
            },
            function(err, res){
                if (err) throw err
                let stock = res[0].stock_quantity
                if (orderQuantity > stock){
                    console.log(`Insufficient quantity!`)
                    customer.menu();

                } else {
                    let newStock = parseInt(stock) - parseInt(orderQuantity)
                    customer.updateStock(id, newStock)
                    customer.bill(id, orderQuantity)
                }
            }
        )
    },
    updateStock: (id, newStock) => {
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [{
                stock_quantity: newStock,
            },
            {
                item_id: id
            }],
            function(err, res){
                if (err) throw err
                console.log(`Your purchase request has gone through.`)
            }
        )
    },
    bill: (id, orderQuantity) => {
        connection.query(
            "SELECT price FROM products WHERE ?",
            [{
                item_id: id
            }],
            function(err, res){
                if (err) throw err
                let bill = parseFloat(res[0].price) * parseInt(orderQuantity)
                console.log(`Your total is $${bill.toFixed(2)}.`)
                customer.recordSale(id, bill)
            }
        )
    },
    recordSale: (id, sale) => {
        connection.query(
            "SELECT product_sales FROM products WHERE ?",
            [{
                item_id: id
            }],
            function(err, res){
                if (err) throw err
                let salesNum = parseFloat(res[0].product_sales)
                let updatedSalesNum = sale + salesNum
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [{
                        product_sales: updatedSalesNum
                    },{
                        item_id: id
                    }],
                    function(err, res){
                        if (err) throw err
                        customer.menu();
                    }
                )
            }
        )

    }
}

customer.menu();

