import { DataTypes } from "sequelize";
import sequelize from "@/config/db";
const Expense = sequelize.define(
  "Expense",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency : {
      type: DataTypes.STRING,
      defaultValue : "$",
      allowNull : false
    }
  },
  {
    timestamps: true,
    indexes: [
      {
        fields: ["date"],
      },
      {
        fields: ["category"],
      },
      {
        fields: ["userId"],
      },
    ],
  }
);
(async () => {
  try {
    // Sync the database and force table creation
    await sequelize.sync();  // { force: true } will recreate the table if it exists

    // Now you can perform your database operations
  } catch (error) {
    console.error('Error during table creation:', error);
  }
})();
module.exports = Expense;
