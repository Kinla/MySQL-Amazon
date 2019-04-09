const connection = require("./connection.js")
const inquirer = require("inquirer")
const {table} = require('table')

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
                let data, output;
                let headers = res.map(el => Object.keys(el))[0]
                data = res.map(el => Object.keys(el).map(key => el[key]))
                data.unshift(headers)
                output = table(data)
                console.log(output)
                manager.menu();
            }
        )
    },
    lowStock: () => {
      connection.query(
        "SELECT * FROM products WHERE stock_quantity < 5",
        function(err, res){
          if (err) throw err
          let data, output;
          let headers = res.map(el => Object.keys(el))[0]
          data = res.map(el => Object.keys(el).map(key => el[key]))
          data.unshift(headers)
          output = table(data)
          console.log(output)
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
                message:"In what department would you like to list this product?",
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
        })

    }
}

//manager.menu();

module.exports = manager