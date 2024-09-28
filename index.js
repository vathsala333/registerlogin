const express=require('express')
const app=express()
const multer = require('multer');
const fs=require('fs')
const bcrypt=require('bcrypt')
const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))

var mongoose = require("mongoose");
const { Number } = require('twilio/lib/twiml/VoiceResponse');

mongoose.connect("mongodb://localhost:27017/marchtwentynineDemo", { useNewUrlParser: true,  useUnifiedTopology: true }  );




const nameSchema = new mongoose.Schema({
 fname: String,
 lname:String,
 cellno:Number,
 email: String,
 hashedPassword : String,
 porg:String,
 exp:Number,
 skill:String

});
const User = mongoose.model("User", nameSchema);

app.get('/',(req,res)=>{    
  console.log("app.get registred")
  res.sendFile('index.html',{root:__dirname})
})

app.get('/register',(req,res)=>{
    console.log("app.get registred")
    res.sendFile('register.html',{root:__dirname})
})

app.get('/login',(req,res)=>{
    console.log("app.get in login")
    res.sendFile('login.html',{root:__dirname})
})
app.get('/upload',(req,res)=>{
  res.sendFile('resumeupload.html',{root:__dirname})
})

//app.get('/upload',(req,res)=>{
  //res.sendFile('message.html',{root:__dirname})
//})

app.post('/register',async(req,res)=>{
 console.log('fname',req.body.fname)
 console.log('lname',req.body.lname)
 console.log('cellno',req.body.cellno)
 console.log('email',req.body.email)
 console.log('cpassword',req.body.cpassword)
 console.log('porg',req.body.porg)
 console.log('exp',req.body.exp)
 console.log('skill',req.body.skill)
 

 const {fname,lname,cellno,email,cpassword,porg,exp,skill}=req.body
 console.log("cpassword",cpassword)
 console.log("exp",exp)
    try{
const saltRounds=10
const  hashedPassword=await bcrypt.hash(cpassword, saltRounds);
//const newUser=new User({ fname,lname,email,exp, cpassword: hashedPassword });
const newUser=new User({ fname,lname,cellno,email,hashedPassword,porg, exp,skill });
await newUser.save();
console.log("User Registred")
res.sendFile('registermessage.html',{root:__dirname})
   /*res.status(201).send("User registered successfully");*/

    }
    catch(error){
        console.error(error);
        res.status(500).send('An error occurred');
    }
})



app.post('/login', async (req, res) => {
  console.log("INSIDE LOGIN POST")
    console.log('email',req.body.email)
    console.log('password',req.body.password)
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email});

  
      if (!user) {
        return res.status(404).send('User not found');
      }
  console.log(user.fname) // devk
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
  
      if (passwordMatch) {
        console.log("Login Successfully")
        res.sendFile('dashboard.html',{root:__dirname})
       // res.send('Login successful');
       
      } else {
        res.status(401).send('Invalid credentials');
      }
    } 
    catch (error) {
      console.log(error);
      res.status(500).send("error in login")
    }
  });



  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const fileFilter=(req,file,cb)=>{
    if(file.mimetype==='application/pdf'){
      cb(null,true)
    }
    else{
      cb(new Error('only PDF files are allowed'),false)
    }
  }
  
  // Create the multer instance
  const upload = multer({ storage: storage ,fileFilter:fileFilter});

  app.post('/UploadResume', upload.single('file'), (req, res) => {
    // Handle the uploaded file
    console.log(req.body)
    console.log("inside post uploadresume")
    res.json({ message: 'File uploaded successfully!' });
  });


 app.get('/updateprofile',async (req,res)=>{
  //console.log('email',req.body.email)
  //console.log('password',req.body.password)
  //const { email, password } = req.body;
  console.log("inside updateprofile devk")
  email="test88@gmail.com"
  try {
    const user = await User.findOne({email})

    if (!user) {
      return res.status(404).send('User not found');
    }
    console.log(user)
   
  
   let response= `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>REGISTER</title>
          <style>
          
            div {
      
              display: flex;
              justify-content: center;
              align-items: center;
              height:160vh;
              margin: 0;
              padding:1em;
             
            }
            form.center-form {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px; 
            }
            
            input[type="text"],
            input[type="number"],
            input[type="password"],
           
            input[type="email"] {
              padding: 10px;
              width: 200px;
             
            }
            input[type="submit"],
            input[type="reset"] {
              padding: 10px 20px;
              cursor: pointer;
             
            }
          
              
          </style>
      </head>
      
      <body>
       
          <div >
            
          <form  class="center-form" action="http://localhost:3000/register" method="POST" id="signup">
            <H4>REGISTRATION</H4>
            <p><b><font size=2px color=black></font>      <input type="text" id="fname" value="${user.fname}"   name="fname"   required></b></p>
              <span id="fname_err" class="err_name"></span>
      
              <p><b><font size=2px color=black></font>     <input type="text" id="lname" name="lname"   value="${user.lname}" required></b></p>
              <span id="lname_err" class="err_name"></span>
      
              <p><b><font size=2px color=black></font><input type="email" id="email" name="email" value="${user.email}"  required> </b></p>
              <span id="email_err" class="err_name"></span>
      
              <p><b><font size=2px color=black></font><input type="number" name="cellno" id="cellno" value="${user.cellno}" required></b></p>
              
              
         
      
      
       <p><b><font size=2px color=black></font><input type="text" name="porg" id="porg"  value="${user.porg}" required></b></p>
      
            
            <p><b><font size=2px color=black></font><input type="number" id="exp"name="exp" value="${user.exp}"  required></b></p>
            <p><b><font size=2px color=black></font><input type="text" id="skill" name="skill"  value="${user.skill}"  required></b></p>
            
          
            
            <label class=button-container>
           
              <input  type="submit" value="REGISTER">
              <input  type="reset" id="reset" value="RESET">
            
             </label>
             
      
          </form>
          
          
            
          </div>
         
         
          <script>
            let signup=document.getElementById("signup")
             signup.addEventListener('submit',(e)=>{
              e.preventDefault();
              console.log("inside eventlister")
      
              
              let fname=document.getElementById("fname").value
              let fname_err=document.getElementById("fname_err")
              fname_err.textContent='';
      
              if(fname.length==0)
              fname_err.textContent=("first name cannot be empty")
              else if(fname.length<3)
              fname_err.textContent=("user name cannot be lessthan 3")
      
              else if(fname.length>20)
              fname_err.textContent=("user name cannot be morethan 20") 
      
      
              let lname=document.getElementById("lname").value 
              let lname_err=document.getElementById("lname_err")
                lname_err.textContent='';
                if(lname.length==0){
                  lname_err.textContent=("last name cannot be empty")
                 }
                    
                 else if(lname.length>20)
                 lname_err.textContent=("last name cannot be morethan 20") 
      
      
                let email=document.getElementById("email").value 
                let  email_err=document.getElementById("email_err")
                   email_err.textContent='';
                   if(email.lenth==0)
                   email_err.textContent=("Email should not be empty")
                 else if(email.length<=14){
                     email_err.textContent=("Email should have 14 character")
                 }
      let password=document.getElementById("password").value
      let password_err=document.getElementById("password_err")
              password_err.textContent='';
              let cpassword=document.getElementById("cpassword").value
      let errpassword=document.getElementById("errpassword")
      errpassword.textContent=''
      
              if (password.length < 8) {
                console.log("inside password")
                password_err.textContent = ("Password must be at least 8 characters long.")
               
              }
              else if((/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(password))!=true){
                password_err.textContent = ("MINIMUM 1 UPPER 1 LOWER 1 DIGIT AND A SPECIAL CHARACTER REQUIRED")
      
              }
               else if(password!==cpassword){
                errpassword.textContent=("PASSWORD DONT MATCH")
            }
             else {
                console.log("PASSWORD MATCH")
                e.target.submit()
            
              } })
      
           
             
          </script>
          
      </body>
      </html>`;

      console.log("........................")
      console.log(response);
      console.log("........................")
      fs.writeFileSync('updateprofile.html',response)
      res.sendFile( 'updateprofile.html',{root:__dirname})
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
 
 })



 app.post('/updateprofile',async(req,res)=>{
  console.log("inside post UpdateProfile")
  try {
    const user = await User.findOneAndUpdate({ email});


    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send("updated")
  }
  catch(err){
    console.error(error);
    res.status(500).send('An error occurred');
  }
 })


 app.get("/deleteprofile", async(req,res)=>{
  console.log("inside deleteprofile")
  email="test91@gmail.com"
  try{
    
      const user=await User.deleteOne({email});
     

      if (!user) {
        return res.status(404).send('User not found');
      }
      res.send("Deleted")
  }
  catch(error){
      console.log(error);
      res.status(500).send("error deleting user")
  }
  });




app.get('/changepassword',(req,res)=>{
  console.log("inside changepassword get")
  res.sendFile('changepassword.html',{root:__dirname})
})


app.post('/changepassword',async(req,res)=>{
  console.log('inside changepassword')
 console.log(req.body)
  const { presentpassword,confrimpassword ,newpassword} = req.body;
  email="test152@gmail.com"
  try {
    const user = await User.findOne({ email});


    if (!user) {
      return res.status(404).send('User not found');
    }

    const passwordMatch = await bcrypt.compare(presentpassword, user.hashedPassword);

    if (passwordMatch) {
      console.log("passwordchanged Successfully")
      const saltRounds=10
      const  newhashedPassword=await bcrypt.hash(confrimpassword, saltRounds);
      console.log(newhashedPassword)
      // mongodb update needed below
      User.findOneAndUpdate({email:"demo152@gmail.com"},{hashedPassword:newhashedPassword})
      .then(docs=>{
        console.log("Updated User:",docs);
        res.send("file underconst")
    })
    .catch(err=>{
        console.log(err);
    });
      //end mongodb update
    } else {
      res.status(500).send("Password didnot match")
      
    }
  } 
  catch (error) {
    console.log(error);
    res.status(500).sendFile('login.html',{root:__dirname})
  }
 
})



  
  
console.log("server is listeing at :3000")  
app.listen(3000)
