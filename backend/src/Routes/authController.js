const patientModel = require("../Models/patient");
const adminModel = require("../Models/Admin");
const pharmaReqModel = require("../Models/Pharmacist_Request.js");
const pharmaModel = require("../Models/Pharmacist.js");

const otpModel = require("../Models/Otp");
const multer = require("multer");
const storage = multer.memoryStorage();
module.exports.upload = multer({ storage: storage });

const jwt = require("jsonwebtoken");
const sendEmail = require("../Utilities/SendEmail");

const { createSecretToken } = require("../Utilities/SecretToken");
const bcrypt = require("bcryptjs");
module.exports.PatientRegister = async (req, res, next) => {
  try {
    console.log("Checked 1 :", req.body); // Debugging

    // Check if the username exists in any collection
    const existingUserinPatient = await patientModel.findOne({
      Username: req.body.username,
    });
    const existingUserinPharma = await pharmaModel.findOne({
      Username: req.body.username,
    });
    const existingUserinAdmin = await adminModel.findOne({
      Username: req.body.username,
    });

    if (existingUserinPatient || existingUserinPharma || existingUserinAdmin) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create new user in the database
    const user = await patientModel.create({
      Username: req.body.username,
      Name: req.body.name,
      Email: req.body.email,
      Password: secPass,
      DateOfBirth: req.body.dob,
      Gender: req.body.gender,
      MobileNumber: req.body.mobile,
      EmergencyContact_Name: req.body.EmergencyContact_Name,
      EmergencyContact_MobileNumber: req.body.EmergencyContact_MobileNumber,
      EmergencyContact_Relation: req.body.EmergencyContact_Relation,
    });

    console.log("Checked 2 :", user); // Debugging

    // Generate token
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res.status(201).json({
      message: "User registered successfully!",
      success: true,
      user,
    });

    next();
  } catch (error) {
    console.error("Error in PatientRegister:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//CREATED AS AN APPLICATION NOT AN ACCOUNT
module.exports.pharmaRegister = async (req, res, next) => {
  try {
    const existingUserinPatient = await patientModel.findOne({
      Username: req.body.username,
    });
    const existingUserinPharma = await pharmaModel.findOne({
      Username: req.body.username,
    });
    const existingUserinAdmin = await adminModel.findOne({
      Username: req.body.username,
    });
    // Handle file uploads
    const IDDocument = req.files.IDDocument ? req.files.IDDocument[0] : null;
    const pharmacyDegreeDocument = req.files.pharmacyDegreeDocument
      ? req.files.pharmacyDegreeDocument[0]
      : null;
    const workingLicenseDocument = req.files.workingLicenseDocument
      ? req.files.workingLicenseDocument[0]
      : null;
    console.log(IDDocument);

    if (!IDDocument || !pharmacyDegreeDocument || !workingLicenseDocument) {
      return res
        .status(400)
        .send({ message: "Please upload all required documents." });
    }

    if (existingUserinPatient || existingUserinPharma || existingUserinAdmin) {
      return res.json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    const user = await pharmaReqModel.create({
      Username: req.body.username,
      Name: req.body.name,
      Email: req.body.email,
      Password: secPass,
      DateOfBirth: req.body.dob,
      HourlyRate: req.body.hourly_rate,
      Affiliation: req.body.affiliation,
      EducationalBackground: req.body.educational_background,
      IDDocument: {
        data: IDDocument.buffer,
        contentType: IDDocument.mimetype,
      },
      pharmacyDegreeDocument: {
        data: pharmacyDegreeDocument.buffer,
        contentType: pharmacyDegreeDocument.mimetype,
      },
      workingLicenseDocument: {
        data: workingLicenseDocument.buffer,
        contentType: workingLicenseDocument.mimetype,
      },
    });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "Doctor registered successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({ message: "All fields are required" });
    }

    const user = await patientModel.findOne({ Username: username });
    const pharma = await pharmaModel.findOne({ Username: username });
    const admin = await adminModel.findOne({ Username: username });

    if (!user && !pharma && !admin) {
      return res.json({ message: "Incorrect password or email" });
    }
    var loggedIn = null;
    var role = null;
    if (user) {
      loggedIn = user;
      role = "patient";
    } else {
      if (pharma) {
        loggedIn = pharma;
        role = "pharmacist";
      } else {
        loggedIn = admin;

        role = "admin";
      }
    }
    const auth = await bcrypt.compare(password, loggedIn.Password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }
    const token = createSecretToken(loggedIn._id, role);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    res.status(201).json({
      message: "User logged in successfully",
      success: true,
      role: role,
    });
    //  next()
  } catch (error) {
    console.error(error);
  }
};
module.exports.currentUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      var user;
      if (data.role === "patient") {
        user = await patientModel.findById(data.id);
      }
      if (data.role === "pharmacist") {
        user = await pharmaModel.findById(data.id);
      }
      if (data.role === "admin") {
        user = await adminModel.findById(data.id);
      }

      if (user) {
        res.json({ status: true, user: user.Username });
      } else {
        return res.json({ status: false });
      }
    }
  });
};
module.exports.Logout = (req, res) => {
  const username = req.user.Username;
  console.log(username);
  // Clear the token cookie by setting it to an empty string and expiring it
  res.cookie("token", "", { expires: new Date(0), httpOnly: false });
  console.log("logout is being called");
  // Optionally, you can also clear the user's session or perform other cleanup tasks here if needed.
  console.log(username);
  res
    .status(200)
    .json({ message: "User logged out successfully", success: true });
};
module.exports.ChangePassword = async (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const username = req.user.Username;
  const user = await patientModel.findOne({ Username: username });
  const pharma = await pharmaModel.findOne({ Username: username });
  const admin = await adminModel.findOne({ Username: username });

  var loggedIn = null;
  var role = null;
  if (user) {
    loggedIn = user;
    role = "patient";
  } else {
    if (pharma) {
      loggedIn = pharma;
      role = "pharmacist";
    } else {
      loggedIn = admin;

      role = "admin";
    }
  }
  const auth = await bcrypt.compare(oldPassword, loggedIn.Password);
  if (!auth) {
    return res.json({ message: "Incorrect old password" });
  }
  if (!newPassword.match(/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/)) {
    return res
      .status(400)
      .json({ message: "New password does not meet requirements" });
  }
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(newPassword, salt);
  loggedIn.Password = secPass;
  loggedIn.save();
  console.log(loggedIn.Password);

  const token = createSecretToken(loggedIn._id, role);
  res.cookie("token", token, {
    withCredentials: true,
    httpOnly: false,
  });
  res
    .status(201)
    .json({ message: "Password changed successfully", success: true });
};
module.exports.SendOTP = async (req, res) => {
  const email = req.body.email;
  console.log(email);
  const user = await patientModel.findOne({ Email: email });
  const pharma = await pharmaModel.findOne({ Email: email });
  const admin = await adminModel.findOne({ Email: email });
  var loggedIn = null;
  if (user) {
    loggedIn = user;
  } else {
    if (pharma) {
      loggedIn = pharma;
    } else {
      loggedIn = admin;
    }
  }
  if (loggedIn === null) {
    return res.send("No account linked to this email");
  }
  const OTP = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    const status = await sendEmail(email, "Password reset", OTP);
    if (status) {
      await otpModel.deleteOne({ email: email });
      const otpObject = await otpModel.create({
        email: email,
        otp: OTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 360000 * +1,
      });
      return res.send("password reset otp sent to your email account");
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports.ResetPassword = async (req, res) => {
  const OTP = req.body.otp;
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  const matchedOTP = await otpModel.findOne({ email: email });
  if (matchedOTP.expiresAt < Date.now()) {
    return res.send("OTP has expired ");
  }
  if (matchedOTP.otp !== OTP) {
    return res.send("OTP is wrong");
  }
  const user = await patientModel.findOne({ Email: email });
  const pharma = await pharmaModel.findOne({ Email: email });
  const admin = await adminModel.findOne({ Email: email });
  var loggedIn = null;
  var role = null;
  if (user) {
    loggedIn = user;
    role = "patient";
  } else {
    if (pharma) {
      loggedIn = pharma;
      role = "pharmacist";
    } else {
      loggedIn = admin;
      role = "admin";
    }
  }
  if (!newPassword.match(/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/)) {
    return res
      .status(400)
      .json({ message: "New password does not meet requirements" });
  }
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(newPassword, salt);
  loggedIn.Password = secPass;
  loggedIn.save();

  const token = createSecretToken(loggedIn._id, role);
  res.cookie("token", token, {
    withCredentials: true,
    httpOnly: false,
  });
  return res
    .status(201)
    .json({ message: "Password changed successfully", success: true });
};

module.exports.CheckOTP = async (req, res) => {
  try {
    const email = req.body.email;
    const OTP = req.body.otp;

    const matchedOTP = await otpModel.findOne({ email: email });

    if (
      !matchedOTP ||
      matchedOTP.expiresAt < Date.now() ||
      matchedOTP.otp !== OTP
    ) {
      return res.status(400).json({ message: "OTP verification failed" });
    }

    return res
      .status(200)
      .json({ message: "OTP verification successful", success: true });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ message: "An error occurred during OTP verification" });
  }
};

module.exports.ResetPass = async (req, res) => {
  try {
    const email = req.body.email;
    const newPassword = req.body.newPassword;

    if (!newPassword.match(/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/)) {
      return res
        .status(400)
        .json({ message: "New password does not meet requirements" });
    }

    const user = await patientModel.findOne({ Email: email });
    const pharma = await pharmaModel.findOne({ Email: email });
    const admin = await adminModel.findOne({ Email: email });

    let loggedIn = null;
    let role = null;

    if (user) {
      loggedIn = user;
      role = "patient";
    } else {
      if (pharma) {
        loggedIn = pharma;
        role = "pharmacist";
      } else {
        loggedIn = admin;
        role = "admin";
      }
    }
    console.log(loggedIn);
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(newPassword, salt);
    loggedIn.Password = secPass;
    loggedIn.save();

    const token = createSecretToken(loggedIn._id, role);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });

    return res
      .status(201)
      .json({ message: "Password changed successfully", success: true });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ message: "An error occurred during password reset" });
  }
};

const Admin = require("../Models/Admin");

module.exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    // Create new admin
    const newAdmin = new Admin({
      username,
      email,
      password,
    });

    await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin registered successfully", newAdmin });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};


module.exports.addAdmin1 = async (req, res, next) => {
  try {
    console.log(req.body);
    const existingUserinPatient = await patientModel.findOne({
      Username: req.body.username,
    });
    const existingUserinPharma = await pharmaModel.findOne({
      Username: req.body.username,
    });
    const existingUserinAdmin = await adminModel.findOne({
      Username: req.body.username,
    });

    if (existingUserinPatient || existingUserinPharma || existingUserinAdmin) {
      return res.json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    const user = await adminModel.create({
      Username: req.body.username,
      Password: secPass,
      Email: req.body.email,
    });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "Admin created successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};