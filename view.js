const inquirer = require("inquirer")

const view = {
    showCustomer: (res) =>{
        console.log("view " + res)
        console.log(`|--ID--|-------------Product-------------|-Price-|`)
        res.forEach(el => {
            console.log(`| ${el.item_id} |  ${el.product_name}  |  $${el.price}  |`)
        });

        
        //view.placeOrder();
    },
    placeOrder: () =>{
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
            model.showStock(answers.id); 
            // this is IDed outside of view but not inside...???
        })
    }
}

module.exports = view