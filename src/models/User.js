import { DataTypes } from 'sequelize';
import sequelize from '../config/db';

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});
(async () => {
  try {
    // Sync the database and force table creation
    await sequelize.sync();  // { force: true } will recreate the table if it exists

    // Now you can perform your database operations
  } catch (error) {
    console.error('Error during table creation:', error);
  }
})();
// Sync the model with the database
// export default User;
module.exports = User;


