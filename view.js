const inquirer = require("inquirer")
const {table} = require('table')


let view = {
    displayTable: (res) => {
        if (err) throw err
        let data, output;
        let headers = res.map(el => Object.keys(el))[0]
        data = res.map(el => Object.keys(el).map(key => el[key]))
        data.unshift(headers)
        output = table(data)
        console.log(output)
    }

}

console.log(view)
module.exports = view