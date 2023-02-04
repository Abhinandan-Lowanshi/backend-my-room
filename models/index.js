const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: 3306,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  // operatorsAliases: false
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log("Error:" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Users = require("./user.model.js")(sequelize, Sequelize);
db.room_details = require("./room_details.model")(sequelize, Sequelize);
db.images = require("./images.model")(sequelize, Sequelize);
db.favorite = require("./favorite.model")(sequelize, Sequelize);
db.Notification = require("./notification.model")(sequelize, Sequelize);
db.temp = require("./temp.model")(sequelize, Sequelize);

db.Users.hasMany(db.favorite, { foreignKey: "fav_usr_fkey", as: "favorites" });
db.room_details.hasMany(db.favorite, {
  foreignKey: "fav_rm_fkey",
  as: "favorites",
});

db.favorite.belongsTo(db.Users, {
  foreignKey: "fav_usr_fkey",
  as: "users",
});

db.favorite.belongsTo(db.room_details, {
  foreignKey: "fav_rm_fkey",
  as: "room_details",
});

db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and re-sync db.");
});

module.exports = db;
