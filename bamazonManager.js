const connection = require("./connection.js")
const inquirer = require("inquirer")
const table = require("./table.js")
const chalk = require("chalk")

const manager = {
    menu: () => {
        inquirer.prompt([
            {
                type: "list",
                message: "What would you like to do?",
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
                table(res);
                manager.menu();
            }
        )
    },
    lowStock: () => {
      connection.query(
        "SELECT * FROM products WHERE stock_quantity < 5",
        function(err, res){
          if (err) throw err // do an if statment if no product stock is under 5. by using if (res.length)
          table(res);
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
              },
              {
                type: "confirm",
                message: "Is the above information correct?",
                name: "confirm"
              }
            ]).then( answers => {
                let product = answers.product
                let unitsAdded = parseInt(answers.units)

                connection.query(
                  "SELECT stock_quantity FROM products WHERE ?",
                  {
                      product_name: product
                  },
                  function(err, res){
                      if (err) throw err
                      let stock = res[0].stock_quantity
                      let updatedUnits = unitsAdded + parseInt(stock)
                      if (answers.confirm && !isNaN(unitsAdded)){
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
                              console.log(chalk.green(`\n${unitsAdded} units has been added to ${product}. The total stock count is ${updatedUnits}.\n`))//should say what needs to be added
                              manager.menu();               
                          }
                      )} else {
                        console.log(chalk.red('\nSomething is not quite right. Please resubmit your request.\n'))
                        manager.restock()
                      }

                  }
                )
            })
        }
      )
    },
    addNew: () => {
      connection.query(
        "SELECT * FROM departments",
        function(err, res){
            if (err) throw err
            let dept = res.map(el => el.department_name)
            inquirer.prompt([
              {
                type:"input",
                message:"What is the product name?",
                name: "product"
              },
              {
                type:"list",
                message:"Please select from existing departments for listing this product. \nNote: New department need to be created by the supervisor first.",
                choices: dept,
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
              },
              {
                type:"confirm",
                message: "Please confirm the product details.",
                name: "confirm"
              }
            ]).then(answers => {
              let price = parseFloat(answers.price).toFixed(2)
              let stock = parseInt(answers.stock)
              if (answers.confirm && !isNaN(price) && !isNaN(stock)){
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
                        console.log(chalk.green(`\n${answers.product} has been added to the product list.\n`))
                        manager.menu();
                    }
                )
              } else {
                console.log(chalk.red('\nPlease check the values and resubmit your request.\n'))
                manager.addNew()
              }
            })
        })

    }
}

//manager.menu();

module.exports = manager