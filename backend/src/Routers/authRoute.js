const router = require("express").Router();

const {
  Login,
  PatientRegister,
  upload,
  pharmaRegister,
  currentUser,
  Logout,
  ChangePassword,
  SendOTP,
  ResetPassword,
  ResetPass,
  CheckOTP,
  addAdmin1,
  registerAdmin,
} = require("../Routes/authController.js"); // ✅ Ensure authController is correctly imported

const { userVerification } = require("../Middleware/AuthMiddleware");

// Routes
router.post("/", currentUser);
router.post("/login", Login);
router.post("/Patientregister", PatientRegister);
router.post("/administration", addAdmin1); // ✅ This was probably what you meant
// router.post("/administration", registerAdmin); // ✅ This was probably what you meant
router.post("/logout", userVerification, Logout);
router.post("/changePassword", userVerification, ChangePassword);
router.post("/sendOTP", SendOTP);
router.post("/resetPassword", ResetPassword);
router.post("/resetPass", ResetPass);
router.post("/checkOTP", CheckOTP);

// Route for Pharmacist Registration with File Upload
router.post(
  "/doc_register",
  upload.fields([
    { name: "IDDocument", maxCount: 1 },
    { name: "pharmacyDegreeDocument", maxCount: 1 },
    { name: "workingLicenseDocument", maxCount: 1 },
  ]),
  pharmaRegister
);

module.exports = router; // ✅ Ensure the correct module is exported
