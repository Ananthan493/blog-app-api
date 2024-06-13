const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const {blogmodel} = require("./models/blog")
const  bcryptjs = require("bcryptjs")

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

app.listen(8086,()=>{
    console.log("server started")
})