const express = require("express");
const router = express.Router();
const jwtHelper = require("../helper/jwthelper");
let { roomController, favController } = require("../Controllers/room");
let {
  registerController,
  loginController,
  forgetController,
} = require("../Controllers/auth");
let { userController } = require("../Controllers/user");
let { notifyController } = require("../Controllers/notification");
let { ctUserConrtoller } = require("../Controllers/chat");

router.post("/register", registerController.register);
router.post("/socialLogin", loginController.socialLogin);
router.post("/sendEmailOtp", registerController.sendVerifyMail);
router.post("/verifyEmailotp", registerController.EmailVerifyOtp);
router.post("/login", loginController.login);
router.post("/forgetPassword", forgetController.forgetPassword);
router.post("/verfyOtp", forgetController.verifyOtp);
router.post("/updatePassword", forgetController.updatePassword);

router.post(
  "/resetPassword",
  jwtHelper.verifyAccessToken,
  userController.UserResatPassword
);
router.post(
  "/myAccountDetails",
  jwtHelper.verifyAccessToken,
  userController.UserAccountDetails
);
router.post(
  "/editUserProfile",
  jwtHelper.verifyAccessToken,
  userController.EditProfile
);

router.post("/addRoom", jwtHelper.verifyAccessToken, roomController.addRoom);
router.post(
  "/addReview",
  jwtHelper.verifyAccessToken,
  roomController.addReview
);
router.post("/findRoom", jwtHelper.verifyAccessToken, roomController.FindRoom);
router.post("/editRoom", jwtHelper.verifyAccessToken, roomController.EditRoom);
router.post(
  "/deleteRoom",
  jwtHelper.verifyAccessToken,
  roomController.deleteRoom
);
router.post(
  "/myRoomList",
  jwtHelper.verifyAccessToken,
  roomController.MyRoomList
);
router.post(
  "/toRoomStatus",
  jwtHelper.verifyAccessToken,
  roomController.updateRoomStatus
);
router.post(
  "/viewRoomDetails",
  jwtHelper.verifyAccessToken,
  roomController.ViewRoom
);

router.post(
  "/toFavorite",
  jwtHelper.verifyAccessToken,
  favController.Tofavorite
);
router.post(
  "/favoriteList",
  jwtHelper.verifyAccessToken,
  favController.FavroiteList
);
router.post(
  "/getNotification",
  jwtHelper.verifyAccessToken,
  notifyController.getNotification
);
router.post(
  "/updateUserNotificationDetails",
  jwtHelper.verifyAccessToken,
  userController.updateUserNotfication
);
router.post(
  "/getUserNotification",
  jwtHelper.verifyAccessToken,
  userController.getUserNotification
);
router.post(
  "/getLatest",
  jwtHelper.verifyAccessToken,
  roomController.getLatest
);

router.post(
  "/chatUserList",
  jwtHelper.verifyAccessToken,
  ctUserConrtoller.chatUserList
);
router.post(
  "/chatList",
  jwtHelper.verifyAccessToken,
  ctUserConrtoller.chatList
);

module.exports = router;
