const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = "blood_secret_key";

/* ===============================
   🔹 CONNECT MONGODB
================================= */

mongoose.connect("mongodb://127.0.0.1:27017/bloodDB")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));


/* ===============================
   🔹 DONOR SCHEMA
================================= */

const donorSchema = new mongoose.Schema({
  name: String,
  bloodGroup: String,
  phone: String,
  city: String,
  lastDonationDate: Date
});

// Virtual eligibility
donorSchema.virtual("isEligible").get(function(){

  const today = new Date();
  const lastDonation = new Date(this.lastDonationDate);

  const diffTime = today - lastDonation;
  const diffDays = diffTime/(1000*60*60*24);

  return diffDays >= 90;
});

donorSchema.set("toJSON",{virtuals:true});
donorSchema.set("toObject",{virtuals:true});

const Donor = mongoose.model("Donor",donorSchema);


/* ===============================
   🔹 BLOOD REQUEST SCHEMA
================================= */

const requestSchema = new mongoose.Schema({

  patientName:{
    type:String,
    required:true
  },

  bloodGroup:{
    type:String,
    required:true
  },

  hospital:{
    type:String,
    required:true
  },

  city:{
    type:String,
    required:true
  },

  contactNumber:{
    type:String,
    required:true
  },

  requiredDate:{
    type:Date,
    required:true
  }

});

const BloodRequest = mongoose.model("BloodRequest",requestSchema);


/* ===============================
   🔹 ADMIN SCHEMA
================================= */

const adminSchema = new mongoose.Schema({
  username:String,
  password:String
});

const Admin = mongoose.model("Admin",adminSchema);


/* ===============================
   🔹 AUTH MIDDLEWARE
================================= */

function verifyToken(req,res,next){

  const authHeader = req.headers["authorization"];

  if(!authHeader){
    return res.status(403).json({message:"No token provided"});
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token,JWT_SECRET,(err,decoded)=>{

    if(err){
      return res.status(401).json({message:"Invalid token"});
    }

    req.adminId = decoded.id;
    next();

  });

}


/* ===============================
   🔹 TEST ROUTE
================================= */

app.get("/",(req,res)=>{
  res.send("Blood Donation API Running");
});


/* ===============================
   🔹 ADMIN LOGIN
================================= */

app.post("/api/admin/login",async(req,res)=>{

  const {username,password} = req.body;

  const admin = await Admin.findOne({username});

  if(!admin){
    return res.status(404).json({message:"Admin not found"});
  }

  const valid = await bcrypt.compare(password,admin.password);

  if(!valid){
    return res.status(401).json({message:"Invalid password"});
  }

  const token = jwt.sign({id:admin._id},JWT_SECRET,{expiresIn:"1d"});

  res.json({token});

});


/* ===============================
   🔹 CREATE ADMIN (Run Once)
================================= */

app.post("/create-admin",async(req,res)=>{

  const hashed = await bcrypt.hash("admin123",10);

  const admin = new Admin({
    username:"admin",
    password:hashed
  });

  await admin.save();

  res.json({message:"Admin created"});
});


/* ===============================
   🔹 ADD DONOR
================================= */

app.post("/api/donors",async(req,res)=>{

  try{

    const donor = new Donor(req.body);
    await donor.save();

    res.json({message:"Donor added successfully"});

  }catch(err){
    res.status(500).json({message:"Error adding donor"});
  }

});


/* ===============================
   🔹 GET DONORS (Pagination)
================================= */

app.get("/api/donors",async(req,res)=>{

  try{

    const {page=1,limit=5,bloodGroup,city} = req.query;

    const query={};

    if(bloodGroup){
      query.bloodGroup=bloodGroup;
    }

    if(city){
      query.city=city;
    }

    const donors = await Donor.find(query)
      .skip((page-1)*limit)
      .limit(parseInt(limit));

    const total = await Donor.countDocuments(query);

    res.json({
      totalDonors:total,
      currentPage:page,
      totalPages:Math.ceil(total/limit),
      donors
    });

  }catch(err){
    res.status(500).json({message:"Error fetching donors"});
  }

});


/* ===============================
   🔹 ELIGIBLE DONORS
================================= */

app.get("/api/donors/eligible",async(req,res)=>{

  try{

    const date = new Date();
    date.setDate(date.getDate()-90);

    const donors = await Donor.find({
      lastDonationDate:{$lte:date}
    });

    res.json(donors);

  }catch(err){
    res.status(500).json({message:"Error"});
  }

});


/* ===============================
   🔹 SEARCH DONOR
================================= */

app.get("/api/donors/search",async(req,res)=>{

  const {bloodGroup} = req.query;

  const donors = await Donor.find({
    bloodGroup:{$regex:bloodGroup,$options:"i"}
  });

  res.json(donors);

});


/* ===============================
   🔹 FILTER DONOR
================================= */

app.get("/api/donors/filter",async(req,res)=>{

  const {bloodGroup,city} = req.query;

  const donors = await Donor.find({
    bloodGroup:{$regex:bloodGroup,$options:"i"},
    city:{$regex:city,$options:"i"}
  });

  res.json(donors);

});


/* ===============================
   🔹 UPDATE DONOR (PROTECTED)
================================= */

app.put("/api/donors/:id",verifyToken,async(req,res)=>{

  const donor = await Donor.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new:true}
  );

  res.json(donor);

});


/* ===============================
   🔹 DELETE DONOR (PROTECTED)
================================= */

app.delete("/api/donors/:id",verifyToken,async(req,res)=>{

  await Donor.findByIdAndDelete(req.params.id);

  res.json({message:"Donor deleted"});

});


/* ===============================
   🔹 CREATE BLOOD REQUEST
================================= */

app.post("/api/requests",async(req,res)=>{

  try{

    const request = new BloodRequest(req.body);

    await request.save();

    res.json({message:"Blood request created"});

  }catch(err){
    res.status(500).json({message:"Error creating request"});
  }

});


/* ===============================
   🔹 GET ALL REQUESTS
================================= */

app.get("/api/requests",async(req,res)=>{

  const requests = await BloodRequest.find();

  res.json(requests);

});


/* ===============================
   🔹 FIND DONORS FOR REQUEST
================================= */

app.get("/api/requests/:id/donors",async(req,res)=>{

  const request = await BloodRequest.findById(req.params.id);

  if(!request){
    return res.status(404).json({message:"Request not found"});
  }

  const donors = await Donor.find({
    bloodGroup:request.bloodGroup,
    city:request.city
  });

  res.json(donors);

});


/* ===============================
   🔹 SERVER START
================================= */

const PORT = 5000;

app.listen(PORT,()=>{
  console.log(`Server running on http://localhost:${PORT}`);
});