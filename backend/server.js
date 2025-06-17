const express = require("express")

const app = express()

app.get("/" , (req,res)=>{
    res.send("Server is working")
})
app.get("/teacher" , (req,res)=>{
    res.send("Teacher is working")
})
app.get("/student" , (req,res)=>{
    res.send("Student is working")
})

const PORT = 6667; 
app.listen(PORT, () => {
    console.log(`App is working on port ${PORT}`);
});
