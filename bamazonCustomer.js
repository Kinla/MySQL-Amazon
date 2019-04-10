const connection = require("./connection.js")
const inquirer = require("inquirer")
const table = require("./table.js")
const chalk = require("chalk")

const customer = {
    menu: () => {
        inquirer.prompt([
            {
                type: "list",
                message: "What would you like to do?",
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
                table(res);
                customer.order();
            }
        )
    },
    order: () => {
        inquirer.prompt([
            {
                type: "input",
                message: "Please enter the product ID of the item you would like to purchase.",
                name: "id"
            },
            {
                type: "input",
                message: "How many units would you like to purchase?",
                name: "quantity"
            },
            {
                type:"confirm",
                message: "Is the above order correct?",
                name: "confirm"
            }
        ]).then(answers => {
            if (answers.confirm){
                let id = answers.id
                let orderQuantity = answers.quantity
                customer.checkStock(id, orderQuantity);
            } else {customer.order()}
        })
    },
    checkStock: (id, orderQuantity) => {
        connection.query(
            "SELECT stock_quantity FROM products WHERE ?",
            {
                item_id: id
            },
            function(err, res){
                if (res.length){
                    if (err) throw err
                    let stock = res[0].stock_quantity
                    if (orderQuantity > stock){
                        console.log(chalk.red(`\nInsufficient quantity!\nThe maximum quantity available for purchase is ${stock}.\n`))
                        customer.menu();
    
                    } else {
                        let newStock = parseInt(stock) - parseInt(orderQuantity)
                        customer.updateStock(id, newStock)
                        customer.bill(id, orderQuantity)
                    }
                } else {
                    console.log(chalk.yellow("\nYou have entered an invalid ID.\nPlease refer to the product list and try again.\n"))
                    customer.windowShop();
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
                console.log(chalk.green(`\nYour purchase request has gone through.`))
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
                console.log(chalk.green(`Your total is $${bill.toFixed(2)}.\n`))
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

//customer.menu();

module.exports = customer