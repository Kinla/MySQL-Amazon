/*
* Create a new Node application called `bamazonManager.js`. Running this application will:

  * List a set of menu options:

    * View Products for Sale
    
    * View Low Inventory
    
    * Add to Inventory
    
    * Add New Product

  * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.

  * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

  * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

  * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.
*/
const connection = require("./connection.js")
const inquirer = require("inquirer")

const manager = {
    menu: () => {
        inquirer.prompt([
            {
                type: "list",
                message: "What would you like to?",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
                name: "choice"
            }
        ]).then( answers => {
            switch (answers.choice) {
                case "SHOP":
                    customer.windowShop();
                    break;
                case "Exit":
                    process.exit();
                    break;
            
                default:
                    break;
            }
            
        })
    },
    windowShop: () => {
        connection.query(
            "SELECT * FROM products",
            function(err, res){
                if (err) throw err
                console.log(`|--ID--|---------------Product---------------|--Price--|`)
                res.forEach(el => {
                    console.log(`| ${el.item_id} |  ${el.product_name}  |  $${el.price.toFixed(2)}  |`)
                });
                console.log(`|------------------------------------------------------|\n`)
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
                    let newStock = stock - orderQuantity
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
                let bill = res[0].price * orderQuantity
                console.log(`Your total is $${bill.toFixed(2)}.`)
                customer.menu();
            }
        )
    }
}

manager.menu();

