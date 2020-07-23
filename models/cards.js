module.exports = function (sequelize, DataTypes) {
    let Card = sequelize.define("Card", {
        question:
        {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        answer:
        {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
    });
    return Card;
};