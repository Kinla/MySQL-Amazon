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
                case "View Products for Sale":
                  manager.viewStore();
                  break;
                case "View Low Inventory":
                  manager.lowStock();
                  break;
                case "Add to Inventory":
                  manager.restock();
                  break;
                case "Add New Product":
                  manager.addNew();
                  break;
                case "Exit":
                    process.exit();
                    break;
                default:
                    break;
            }
        })
    },
    viewStore: () => {
        connection.query(
            "SELECT * FROM products",
            function(err, res){
                if (err) throw err
                console.log(`|--ID--|---------------Product---------------|-----------Department-----------|--Price--|--Stock--|`)
                res.forEach(el => {
                    console.log(`| ${el.item_id} |  ${el.product_name}  |  ${el.department_name}  |  $${el.price.toFixed(2)}  |  ${el.stock_quantity}  |`)
                });
                console.log(`\n`)
                manager.menu();
            }
        )
    },
    lowStock: () => {
      connection.query(
        "SELECT * FROM products",
        function(err, res){
          if (err) throw err
          console.log(`|--ID--|---------------Product---------------|-----------Department-----------|--Price--|--Stock--|`)
          res.forEach(el => {
            if(el.stock_quantity < 5){
              console.log(`| ${el.item_id} |  ${el.product_name}  |  ${el.department_name}  |  $${el.price.toFixed(2)}  |  ${el.stock_quantity}  |`)
            }
          });
          console.log(`\n`)
          manager.menu();
        }
      )
    },
    restock: () => {
      connection.query(
        "SELECT * FROM products",
        function(err, res){
            if (err) throw err
            let products = res.map(el => el.product_name)
            inquirer.prompt([
              {
                type: "list",
                message: "Which product would you like to restock?",
                choices: products,
                name: "product"
              },
              {
                type: "input",
                message: "How many units would you like to restock?",
                name: "units"
              }
            ]).then( answers => {
                let product = answers.product
                let unitsAdded = answers.units
                connection.query(
                  "SELECT stock_quantity FROM products WHERE ?",
                  {
                      product_name: product
                  },
                  function(err, res){
                      if (err) throw err
                      let stock = res[0].stock_quantity
                      let updatedUnits = parseInt(unitsAdded) + parseInt(stock)
                      connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [{
                            stock_quantity: updatedUnits,
                        },
                        {
                            product_name: product
                        }],
                        function(err, res){
                            if (err) throw err
                            console.log(`Your inventory has been updated.\n\n`)
                            manager.menu();               
                        }
                    )
                  }
                )
            })
        }
      )
    },
    addNew: () => {
      inquirer.prompt([
        {
          type:"input",
          message:"What is the product name?",
          name: "product"
        },
        {/*may want to change this to an list that can expand?*/
          type:"input",
          message:"In what department would you like to list this product?",
          name: "dept"
        },
        {
          type:"input",
          message:"What is the price per unit?",
          name: "price"
        },
        {
          type:"input",
          message:"How many units would you like to add to the inventory?",
          name: "stock"
        }
      ]).then(answers => {
        connection.query(
            "INSERT INTO products SET ?",
            [{
                product_name: answers.product,
                department_name: answers.dept,
                price: answers.price,
                stock_quantity: answers.stock
            }],
            function(err, res){
                if (err) throw err
                console.log(`${res.affectedRows} has been added to the product list.\n\n`)
                manager.menu();
            }
        )
      })
    }
}

manager.menu();

