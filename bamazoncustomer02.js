/*
5. Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

6. The app should then prompt users with two messages.

   * The first should ask them the ID of the product they would like to buy.
   * The second message should ask how many units of the product they would like to buy.

7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

   * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
   * This means updating the SQL database to reflect the remaining quantity.
   * Once the update goes through, show the customer the total cost of their purchase.
*/

//const model = require("./model.js")
//const view = require("./view.js")
const connection = require("./connection.js")
const inquirer = require("inquirer")

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
        return new Promise(function(resolve, reject){
            return connection.query(
                "SELECT * FROM products",
                function(err, res){
                    if (err) {reject(err)}
                    console.log(`|--ID--|---------------Product---------------|--Price--|`)
                    res.forEach(el => {
                        console.log(`| ${el.item_id} |  ${el.product_name}  |  $${el.price.toFixed(2)}  |`)
                    });
                    console.log(`|------------------------------------------------------|\n`)
                    //customer.order();
                    return resolve(res)
                }
            )

        })







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
                customer.menu();
            }
        )
    }
}

//customer.menu();
customer.windowShop().then(res => customer.order(res));

