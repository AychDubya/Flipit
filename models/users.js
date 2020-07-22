module.exports = function (sequelize, DataTypes) {
  let User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 20],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
  });
  User.associate = function (models) {
    User.hasMany(models.Deck, {
      onDelete: "cascade"
    })
    User.belongsToMany(models.Deck, {through: 'SavedDeck'});
  }
  return User;
};
