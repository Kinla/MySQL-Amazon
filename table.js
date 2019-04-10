const {table} = require('table')
const chalk = require("chalk")

let showTable = (res) => {
    let data, output;
    let headers = res.map(el => Object.keys(el))[0]
    data = res.map(el => Object.keys(el).map(key => el[key]))
    data.unshift(headers)
    output = table(data)
    console.log(output)
}

module.exports = showTable