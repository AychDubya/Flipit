module.exports = function(sequelize, DataTypes) {
    let Deck = sequelize.define("Deck", 
    {
        name: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1]
        }
    },
    {
       private: DataTypes.BOOLEAN,
       allowNull: false,
       validate: {
           len: [1]
       }
    }
    );
    Deck.associate = function(models){
        Deck.hasMany(models.Card, {
            onDelete: "cascade"
        });
        Deck.belongsToMany(models.User, {through: 'SavedDeck'});
        Deck.belongsTo(models.User,{as:"creator"});
        Deck.belongsTo(models.Category)
    };
    return Deck;
}