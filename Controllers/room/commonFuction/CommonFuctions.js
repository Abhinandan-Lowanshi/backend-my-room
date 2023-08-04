const db = require("../../../models");
const asyncLoop = require("node-async-loop");
// const {
//   room_details,
//   images,
//   favorite,
//   Users,
//   Notification,
//   rating,
// } = require("../../models");

const getRatting = async (room_id, user_id) => {
  let review = {};
  let rating = {
    count: 0,
    rating: 0.0,
    avg: 0.0,
    isReviewed: false,
    room_id,
  };

  if (room_id) {
    let sql = `select * from ratings where room_id = ${room_id}`;
    await db.sequelize
      .query(sql)
      .then(async (result) => {
        if (result[0]?.length > 0) {
          let temp = result[0]?.map((item) => {
            console.log(user_id == item?.rm_usr_fkey);

            rating = {
              ...rating,
              count: rating?.count + 1,
              rating: rating?.rating + parseFloat(item?.ratings),
            };
            if (user_id == item?.rm_usr_fkey) {
              rating.isReviewed = true;
              return { ...item, isReviewed: true };
            } else {
              return { ...item, isReviewed: false };
            }
          });
          review = {
            reviewData: { ...rating, avg: rating?.rating / rating?.count },
            reviewList: temp,
          };
        }
      })
      .catch((error) => {
        console.log(error, ".....................");
      });
    // console.log(review, ".....................");
    return review;
  }
};
module.exports = { getRatting };
