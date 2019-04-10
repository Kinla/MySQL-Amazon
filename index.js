const inquirer = require("inquirer")
let customer = require("./bamazonCustomer.js")
let manager = require("./bamazonManager.js")
let supervisor = require("./bamazonSupervisor.js")
let figlet = require("figlet")


let index = {
    start: () => {
        figlet.text('Welcome to Bamazon', {
            font: "Double",
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }, function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(data);
            index.menu()
        });
    },
    menu: () => {
        inquirer.prompt([
            {
                type: "list",
                message: "Who are you?",
                choices: ["Customer","Manager","Supervisor","EXIT"],
                name: "id"
                }
        ]).then( answer => {
            switch (answer.id) {
                case "Customer":
                    customer.menu();
                    break;
                case "Manager":
                    manager.menu();
                    break;
                case "Supervisor":
                    supervisor.menu();
                    break;        
                case "EXIT":
                    process.exit();
                    break;
                default:
                    break;
            }
        })
    }
}

index.start();

module.exports = index