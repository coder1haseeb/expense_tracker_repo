// import { Sequelize } from "sequelize";
// import sqlite3 from "sqlite3";
// import { open } from "sqlite";

// // Use SQLite configuration without pg-connection-string
// const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: "./database.sqlite", 
//   logging: false,
//   dialectModule: sqlite3,
//   dialectOptions: {
//     // Disable SSL configuration that requires 'fs'
//     ssl: false
//   }
// });

// // Wrap authentication in an async function
// const initDatabase = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connection has been established successfully.');
    
//     // Also initialize SQLite connection
//     const db = await open({
//       filename: './database.sqlite',
//       driver: sqlite3.Database
//     });
    
//     // Sync models with database
//     await sequelize.sync();
    
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//     process.exit(1);
//   }
// };

// // Call the init function
// initDatabase();

// export default sequelize;

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('atomixweb_investment_tool_db', 'atomixweb_haseeb', 'dc7iDKc5DDYvLh2', {
  host: '66.248.237.59',
  dialect: 'mysql', // Explicitly set MySQL as the dialect
  dialectModule: require('mysql2'),
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

export default sequelize;
