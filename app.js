const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const {blogmodel} = require("./models/blog")
const  bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://ananthan123:ananthan123@cluster0.4r0z6.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword = async (password)=>{
    const salt = await bcryptjs.genSalt(10)
    return bcryptjs.hash(password,salt)
}



app.post("/signup",async (req,res)=>{
    let input = req.body
    let hashedPassword = await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password = hashedPassword//for correct entry to db
    let blog = new blogmodel(input)
    blog.save()
    res.json({"status":"success"})
})

//api for signin
app.post("/signin",(req,res)=>{
    //res.json("status":"success")
    let input = req.body
    blogmodel.find({"email":req.body.email}).then(
        (response)=>{
            //console.log(response)
            if (response.length>0) {
                let dbPassword = response[0].password
                console.log(dbPassword)
                bcryptjs.compare(input.password,dbPassword,(error,isMatch)=>{
                    if (isMatch) {
                        res.json({"status":"success","userId":response[0]._id})
                    } else {
                        res.json({"status":"incorrect Password"})
                    }
                })
                
            } else {
                res.json({"status":"user not found"})
                
            }
        }
    ).catch()

})

app.post("/viewusers",(req,res)=>{
    let token = req.headers["token"]
    jwt.verify(token,"blogapp",(error,decoded)=>{
        if (error) {
            res.json({"status":"Unauthorized access"})
            
        } else {
            if (decoded) {
                blogmodel.find().then(
                    (response)=>{
                        res.json(response)
                    }
                ).catch()
            }
            
        }
    })
})

app.listen(8086,()=>{
    console.log("server started")
})