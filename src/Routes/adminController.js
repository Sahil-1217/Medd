const adminModel = require('../Models/Admin.js');
const pharmaReqModel = require('../Models/Pharmacist_Request.js');
const medModel = require('../Models/Medicine.js');
const Patient = require('../Models/patient.js'); 

const { default: mongoose } = require('mongoose');
const viewPharmacistApp= async (req, res) => {
    const applicationId = req.params.id;
    const application = await pharmaReqModel.findById(applicationId);
    res.render('singleApplication.ejs', { application });
}

const viewAllApp= async (req, res) => {
    const applications = await pharmaReqModel.find({});
res.render('pharmacist_App.ejs',{userData:applications});
}

const PatientDetailsResults = async (req, res) => {
  const username = req.query.username;

  try {
    const patients = await Patient.find({ Username: username });

    if (!patients || patients.length === 0) {
      // If no patient is found, you can handle it here
      return res.status(404).send("Patient not found");
    }

    // Render the EJS template with the patient data
    res.render('patientDetailsResults.ejs', { patients: patients });

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};


const addAdmin = async (req, res) => {
    try {
      const admin = new adminModel({
        username: req.body.username,
        password: req.body.password,
      });
  
      console.log(req.body.username);
  
      await admin.save(); // Use await to wait for the save operation to complete
  
      console.log('Added!');
      res.status(200).send("Admin added successfully.");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error adding admin.");
    }
  };
  async function getAvailableMedicines(req, res) {
    try {
      // Use Mongoose to find medicines with quantity > 0
      const availableMedicines = await medModel.find({ Quantity: { $gt: 0 } });
      console.log(availableMedicines)
      res.render('availableMedicines.ejs', { data: availableMedicines });
    } catch (error) {
      console.error('Error fetching available medicines:', error);
      throw error;
    }
  }

  const viewPatientDet = async (req, res) => {
    res.render('PatientDetails');
  }

  // const PatientDetailsResults = async (req, res) => {
  //   const patients = await Patient.find({});
  //  res.send(patients);  
  // }




module.exports = {
    viewAllApp,viewPharmacistApp,addAdmin,getAvailableMedicines,viewPatientDet,PatientDetailsResults
};
