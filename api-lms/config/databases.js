const Sequelize = require('sequelize');

let databases= {};

for(var i = 0; i < 50; i++) {
  const dbName = process.env["DB_"+i+"_NAME"],
        dbUsername = process.env["DB_"+i+"_USERNAME"],
        dbPassword = process.env["DB_"+i+"_PASSWORD"],
        dbHost = process.env["DB_"+i+"_HOST"],
        dbPort = process.env["DB_"+i+"_PORT"]

  console.log('connection', dbName, dbUsername, dbPassword, dbHost, dbPort)
  
  if (!dbName) {
    break;
  }

  databases[dbName] = new Sequelize(
    dbName,
    dbUsername,
    dbPassword,
    {
      host: dbHost || 'localhost',
      port: dbPort || '3306',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
    },
  );  
}

module.exports = databases;
