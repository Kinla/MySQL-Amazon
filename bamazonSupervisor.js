const connection = require("./connection.js")
const inquirer = require("inquirer")
const table = require("./table.js")
const chalk = require("chalk")


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
            "SELECT department_id, departments.department_name, over_head_costs, product_sales, product_sales-over_head_costs AS total_profit FROM\x28 SELECT department_name, SUM\x28product_sales\x29 product_sales FROM products GROUP BY department_name \x29 AS new RIGHT JOIN departments ON new.department_name = departments.department_name",
            function(err, res){
                if (err) throw err
                table(res);
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
                message: "What is the over head cost of running this department?",
                name: "cost"
            },
            {
                type: "confirm",
                message: "IS the above information correct?",
                name: "confirm"
            }
        ]).then(answers => {
            let name = answers.name
            console.log(name)
            let cost = parseInt(answers.cost)
            if (answers.confirm && !isNaN(cost)){
                connection.query(
                    "INSERT INTO departments SET ?",
                    [{
                        department_name: name,
                        over_head_costs: cost
                    }],
                    function(err, res){
                        if (err) throw err
                        console.log(chalk.green(`\nThe ${name} department has been added to the store.\n`))
                        supervisor.menu();
                    }
                )
            } else {
                console.log(chalk.red(`\nPlease resubmit your request.\n`))
                supervisor.createDept();
            }
        })
    },
}

//supervisor.menu();

module.exports = supervisor