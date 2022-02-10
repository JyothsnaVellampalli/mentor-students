var express = require('express');
var router = express.Router();

const {mongodb,MongoClient,dburl}= require('../Schema');

/* GET users listing. */
router.get('/', function(req, res, next) {
 
});

//1.add mentor
router.post('/addmentor',async (req, res,)=>{
  const client= await MongoClient.connect(dburl);
  try {
    const db= await client.db('MentorsAndStudents');
    const mentors= await db.collection('Mentors').find({MentorEmail:req.body.MentorEmail}).toArray();
    if(mentors.length > 0) {
      res.json({
        statuscode:400,
        message:"Mentor already present"
      })
    }
    else{
      let MentorDetails= await db.collection('Mentors').insertOne(req.body);
      res.json({
        statuscode:200,
        message:"Mentor Added Successfylly",
        Details : MentorDetails
      })
    }
    
  } catch (error) {
    res.json({
      statuscode:500,
      message:"Internal Server Error"
    })
    
  }
})

//2.add students 
router.post('/addstudent',async (req, res,)=>{
  const client= await MongoClient.connect(dburl);
  try {
    const db= await client.db('MentorsAndStudents');
    const students= await db.collection('Students').find({StudentEmail:req.body.StudentEmail}).toArray();
    if(students.length > 0) {
      res.json({
        statuscode:400,
        message:"Student already registered"
      })
    }
    else{
      let StudentDetails= await db.collection('Students').insertOne(req.body);
      res.json({
        statuscode:200,
        message:"Student Added Successfully",
        Details : StudentDetails
      })
    }
    
  } catch (error) {
    res.json({
      statuscode:500,
      message:"Internal Server Error"
    })
    
  }
})

// 3.assign students to mentor
router.post('/assignstudents',async (req, res,)=>{
  const client= await MongoClient.connect(dburl);
  try{
    const db= await client.db('MentorsAndStudents');

   //check mentor
    const mentors= await db.collection('Mentors').find({MentorEmail:req.body.MentorEmail}).toArray();
    if(mentors.length===0){
      res.json({
        statuscode:400,
        message:"Invalid Mentor Details"
      })
    }
    //student details as objects in array
    req.body.Students.map(async (stu,i)=>{
      // console.log(stu);
      const students= await db.collection('Students').find({StudentEmail:stu.StudentEmail}).toArray();
      //check student existance
      if(students.length===0){
        res.json({
          statuscode:400,
          message:"Invalid Student Details"
        })
      }
      //assign each student to mentor
      else{
        let assigned= await db.collection('Mentor+Student').insertOne({StudentName:stu.StudentName,StudentEmail:stu.StudentEmail,MentorName:req.body.MentorName,MentorEmail:req.body.MentorEmail});
        res.json({
          statuscode:200,
          message:" students are assigned to mentor sucessfully",
          data: assigned
        })
      }
      })
    }catch(error) {
      res.json({
        statuscode:500,
        message:"Internal Server Error"
      })
    }
})

//4.assign mentor to student
router.post('/assignmentor',async (req, res,)=>{
  const client= await MongoClient.connect(dburl);
  try{
    const db= await client.db('MentorsAndStudents');
    const students= await db.collection('Students').find({StudentEmail:req.body.StudentEmail}).toArray();
    const mentors= await db.collection('Mentors').find({MentorEmail:req.body.MentorEmail}).toArray();
    if(students.length===0){
      res.json({
        statuscode:400,
        message:"Invalid Student Details"
      })
    }

    else if(mentors.length===0){
    res.json({
      statuscode:400,
      message:"Invalid Mentor Details"
    })
  }
  else{
    let assigned= await db.collection('Mentor+Student').insertOne(req.body);
    res.json({
      
      statuscode:200,
      message:"Mentor is assigned to student sucessfully",
      data: assigned
    })
  }

}catch(error){
  res.json({
    statuscode:500,
    message:"Internal Server Error"
  })
}
})


//4.change mentor
router.put('/changementor',async (req, res,)=>{
  const client= await MongoClient.connect(dburl);
  try{
    const db= await client.db('MentorsAndStudents');
    const students= await db.collection('Students').find({StudentEmail:req.body.StudentEmail}).toArray();
    const stu_exist=await db.collection('Mentor+Student').find({StudentEmail:req.body.StudentEmail}).toArray();
    const mentors= await db.collection('Mentors').find({MentorEmail:req.body.MentorEmail}).toArray();
    
    if(students.length===0 || stu_exist.length===0){
      res.json({
        statuscode:400,
        message:"Invalid Student Details"
      })
    }

    else if(mentors.length===0){
    res.json({
      statuscode:400,
      message:"Invalid Mentor Details"
    })
  }
  
  else{
    let Delete= await db.collection('Mentor+Student').deleteOne({StudentName:req.body.StudentName,StudentEmail:req.body.StudentEmail,MentorName:req.body.oldMentorName,MentorEmail:req.body.oldMentorEmail});
    let update= await db.collection('Mentor+Student').insertOne({StudentName:req.body.StudentName,StudentEmail:req.body.StudentEmail,MentorName:req.body.MentorName,MentorEmail:req.body.MentorEmail});
   
    res.json({
      statuscode:200,
      message:"Mentor is updated sucessfully",
      data: update
    })
  }
  }catch(error){
  res.json({
    statuscode:500,
    message:"Internal Server Error"
  })
}
})


//5.show students of a mentor
router.get('/studentsofmentor',async (req, res,)=>{
  const client= await MongoClient.connect(dburl);
  try{
  const db= await client.db('MentorsAndStudents');
  const mentors= await db.collection('Mentors').find({MentorEmail:req.body.MentorEmail}).toArray();
   if(mentors.length===0){
    res.json({
      statuscode:400,
      message:"Invalid Mentor Details"
    })
  }
  else{
    let students=[];
    let studentsarray=await db.collection('Mentor+Student').find({MentorEmail:req.body.MentorEmail}).toArray();
    console.log(studentsarray);
    studentsarray.map((stu)=>{
      students.push({StudentName:stu.StudentName,StudentEmail:stu.StudentEmail});
    })
    res.json({
      statuscode:200,
      message:"Students of a mentor",
      studentsdata:students
    })
  }
 }catch(error){
   res.json({statuscode:500,
              message:"Internal Server Error"})
 }
})

module.exports = router;
