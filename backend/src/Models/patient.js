const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const medicalDocumentSchema = new mongoose.Schema({
  name: String,
  path: String,
});
const chatSchema = new mongoose.Schema({
  room: {
    type: String,
  },
  doctorUsername: String,
  username: String,
  messages: [
    {
      sender: String,
      recipient: String,
      message: String,
      timestamp: {
        type: String,
        default: `${new Date(Date.now()).getHours()}:${new Date(
          Date.now()
        ).getMinutes()}`,
      },
    },
  ],
});

const patientSchema = new Schema(
  {
    Username: {
      type: String,
      required: true,
      unique: true,
    },
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    DateOfBirth: {
      type: Date,
      required: true,
    },
    Gender: {
      type: String,
      required: true,
    },
    MobileNumber: {
      type: String,
      required: true,
    },
    EmergencyContact_Name: {
      type: String,
      required: true,
    },
    EmergencyContact_MobileNumber: {
      type: String,
      required: true,
    },
    EmergencyContact_Relation: {
      type: String,
      required: true,
    },
    WalletBalance: {
      type: Number,
      default: 0,
    },
    chatRooms: [chatSchema],
    DeliveryAddress: [
      {
        type: String,
      },
    ],
    Notifications: [
      {
        type: String,
      },
    ],
    LinkedPatientFam: [
      new Schema({
        memberID: mongoose.Schema.Types.ObjectId, // ID of the linked user
        username: String, // Username of the linked user
        relation: String, // Relation (wife, husband, child, etc.)
      }),
    ],
    healthPackage: [
      new Schema({
        _id: mongoose.Schema.Types.ObjectId,
        Package_Name: {
          type: String,
          required: false,
        },
        Price: {
          type: Number,
          required: false,
        },
        Session_Discount: {
          type: Number,
          required: false,
        },
        Pharmacy_Discount: {
          type: Number,
          required: false,
        },
        Family_Discount: {
          type: Number,
          required: false,
        },
        Status: {
          type: String,
          enum: ["Subscribed", "Unsubscribed", "Cancelled"],
          default: "Unsubscribed",
        },
        Renewl_Date: {
          type: Date,
          required: false,
        },
        End_Date: {
          type: Date,
          required: false,
        },
        Owner: {
          type: Boolean,
          required: false,
        },
      }),
    ],
    medicalHistory: [medicalDocumentSchema],
    Prescriptions: [
      new Schema({
        Medicine: [
          new Schema({
            MedicineID: String,
            MedicineName: String,
            Onboard: Boolean,
            Dose: String,
            Quantity: Number,
            Instructions: String,
          }),
        ],
        DocUsername: String,
        PrecriptionDate: Date,
        Status: {
          type: String,
          enum: ["Filled", "Unfilled"],
        },
      }),
    ],
    BookedAppointments: [
      new Schema({
        _id: mongoose.Schema.Types.ObjectId,

        DoctorUsername: String,
        DoctorName: String,
        StartDate: Date,
        EndDate: Date,
        Price: Number,
        Status: {
          type: String,
          enum: ["upcoming", "completed", "cancelled", "rescheduled"],
        },
      }),
    ],
    FamilyBookedAppointments: [
      new Schema({
        _id: mongoose.Schema.Types.ObjectId,
        PatientName: String,
        DoctorUsername: String,
        DoctorName: String,
        StartDate: Date,
        EndDate: Date,
        Price: Number,
        Status: {
          type: String,
          enum: ["upcoming", "completed", "cancelled", "rescheduled"],
        },
      }),
    ],
    familyMembers: [
      new Schema({
        MemberName: {
          type: String,
          required: true,
          default: "null", // You can set a default value here
        },
        NationalID: {
          type: Number,
          required: true,
          default: 0, // Default value for NationalID
        },
        Age: {
          type: Number,
          required: true,
          default: 0, // Default value for Age
        },
        Gender: {
          type: String,
          required: true,
          default: "Unknown", // Default value for Gender
        },
        Relation: {
          type: String,
          required: true,
          default: "Unknown", // Default value for Relation
        },
      }),
    ],
    HealthRecords: [
      {
        PatientName: { type: String, required: true },
        DoctorName: { type: String, required: true },
        RecordDetails: { type: String, required: true },
        RecordDate: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);
// patientSchema.pre("save", function (next) {
//   const user = this;
//   if (!user.isModified("Password")) return next();

//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) return next(err);
//     bcrypt.hash(user.Password, salt, (error, hash) => {
//       // Fixed bcrypt usage
//       if (error) return next(error);
//       user.Password = hash;
//       next();
//     });
//   });
// });

// 🔹 Export Model with Explicit Collection Name
const Patient = mongoose.model("Patient", patientSchema, "patients");
module.exports = Patient;
