module.exports = function(sequelize, DataTypes) {
    let Deck = sequelize.define("Deck", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        private: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                len: [1]
            }
        }
    });
    Deck.associate = function(models){
        Deck.belongsToMany(models.User, {through: 'SavedDecks'});
        Deck.hasMany(models.Card, {
            onDelete: "cascade"
        });
    };
    return Deck;
}