# MySQL-Amazon
This is a Cli based Amazon-like store front creating using MySQL database. The app will take in orders from customers and deplete stock from the store's inventory. It will allow the manager to view, restock, and add new products to the store. It will also allow the supervisor to view profits by department and to create new department(s).

## Technologies
  * JavaScript
  * Node.js
  * MySQL
  * npm - inquirer
  * npm - mysql
  * npm - table
  * npm - figlet
  * npm - chalk

## Installation & Set Up
  1. Clone this repository.
  2. Run `npm install`.
  3. Start up MySQL connection
  4. Update `user` and `password` from the default of `root` in `connection.js` if necessary.
  5. Run MySQL code in `bamazon.sql` to set up the database and tables for this program.
  6. Nagigate to the folder in which `index.js` is saved to start the program through node with this command: `node index.js`.

## Usage Example
### Customer View
![usage](https://github.com/Kinla/MySQL-Amazon/blob/master/assets/customer.gif)

### Manager View
![usage](https://github.com/Kinla/MySQL-Amazon/blob/master/assets/manager.gif)

### Supervisor View
![usage](https://github.com/Kinla/MySQL-Amazon/blob/master/assets/supervisor.gif)

## Bugs / Improvements
  * Revisit validation of user input

## License
MIT  