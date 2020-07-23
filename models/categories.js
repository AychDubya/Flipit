module.exports = function (sequelize, DataTypes) {
  let Category = sequelize.define("Category", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
      }
    }
  });
  Category.associate = function (models) {
    Category.hasMany(models.Deck, {
      onDelete: "cascade"
    })
  }
  return Category;
};