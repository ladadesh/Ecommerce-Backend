const router = require('express').Router();
const { isUserAuthenticated, authorizeRoles } = require('../middleware/auth')
const { updateProfile, loggedInUser, registerUser, loginUser
  , getUserByAdmin, updatePassword, logoutUser,
  forgetPassword, resetPassword, getAllUser, deleteUser, updateUser } = require('../controller/auth')

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

router.route("/password/forget").post(forgetPassword)
router.route("/reset/password/:token").put(resetPassword)

router.route("/admin/getusers").get(isUserAuthenticated, authorizeRoles('admin'), getAllUser)
router.route("/admin/user/:id").get(isUserAuthenticated, authorizeRoles('admin'), getUserByAdmin)
router.route("/admin/user/delete/:id").delete(isUserAuthenticated, authorizeRoles('admin'), deleteUser)
router.route("/admin/user/update/:id").put(isUserAuthenticated, authorizeRoles('admin'), updateUser)


router.route("/userLoggedIn").get(isUserAuthenticated, loggedInUser)
router.route("/update/password").put(isUserAuthenticated, updatePassword)
router.route("/update/profile").put(isUserAuthenticated, updateProfile)


router.route("/logout").get(logoutUser)

module.exports = router