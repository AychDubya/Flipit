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
    User.belongsToMany(models.Deck, {through: 'SavedDecks'});
    User.hasMany(models.Deck, {
      onDelete: "cascade",
      foreignKey: 'CreatorId'
    })
  }
  return User;
};
