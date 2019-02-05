const mysql = require('mysql')

const db = {}

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'codeup',
  database: 'products_db',
})

connection.connect()

db.query = (sql, ...params) => new Promise((resolve, reject) => {
  connection.query(sql, params, (err, results, fields) => {
    if (err) { reject(err) }
    db.meta = fields
    resolve(results)
  })
})

db.close = () => {
  connection.end()
}

module.exports = db
