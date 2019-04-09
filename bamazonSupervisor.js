const connection = require("./connection.js")
const inquirer = require("inquirer")
const {table} = require('table')

const supervisor = {
    menu: () => {
        inquirer.prompt([
            {
                type: "list",
                message: "What would you like to do?",
                choices: ["View Product Sales by Department", "Create New Department", "EXIT"],
                name: "choice"
            }
        ]).then( answers => {
            switch (answers.choice) {
                case "View Product Sales by Department":
                    supervisor.viewSales();
                    break;
                case "Create New Department":
                    supervisor.createDept();
                    break;
                case "EXIT":
                    process.exit();
                    break;
            
                default:
                    break;
            }
            
        })
    },
    viewSales: () => {
        connection.query(
            "SELECT department_id, new.department_name, over_head_costs, product_sales, product_sales-over_head_costs AS total_profit FROM\x28 SELECT department_name, SUM\x28product_sales\x29 product_sales FROM products GROUP BY department_name \x29 AS new RIGHT JOIN departments ON new.department_name = departments.department_name",
            function(err, res){
                if (err) throw err
                let data, output;
                let headers = res.map(el => Object.keys(el))[0]
                data = res.map(el => Object.keys(el).map(key => el[key]))
                data.unshift(headers)
                output = table(data)
                console.log(output)
                supervisor.menu();
            }
        )
    },
    createDept: () => {
        inquirer.prompt([
            {
                type: "input",
                message: "What department would you like to create?",
                name: "name"
            },
            {
                type: "input",
                message: "Whta is the over head cost of running this department?",
                name: "cost"
            }
        ]).then(answers => {
            let name = answers.name
            let cost = answers.cost
            connection.query(
                "INSERT INTO departments SET ?",
                [{
                    department_name: name,
                    over_head_costs: cost
                }],
                function(err, res){
                    if (err) throw err
                    console.log(`${res.affectedRows} has been added to the store.`)
                    supervisor.menu();
                }
            )
        })
    },
}

//supervisor.menu();

module.exports = supervisor