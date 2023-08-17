const express = require('express')
const app = express()
const storage = require('mysql')
const cors = require('cors')
const nodemailer = require('nodemailer')

app.use(cors())
app.use(express.json())
app.listen('3001',() => {
    console.log('Server Start')
})

//Connect Database
const db = storage.createConnection({
    user: "adminmember",
    host: "localhost",
    password: "member999",
    database: "memberdb"
})

// Add New User
app.post('/add-user',async (req,res) => {
    const name = req.body.name
    const email = req.body.email
    const passcode = await genPassCode()
    
    var resultName = await checkName(name)
    if(resultName != ''){
        res.send("ชื่อผู้ใช้ซ้ำ")
    }else{
        var resultEmail = await checkEmail(email)
        if(resultEmail != ''){
            res.send("Email ซ้ำ")
        }else{
            var resultInsertUser = await insertUser(name,email,passcode)
            console.log(resultInsertUser)
            res.send("Code : "+passcode)
        }
    }
})

// Recovery Code
app.post('/forgot-code',async (req,res) => {
    var resultEmail = await checkEmail(req.query.email)
    if(resultEmail == ''){
        res.send('ไม่พบ Email ในระบบ')
    }else{
        var passcode = await genPassCode()
        var resultUpdatePasscode = await updatePassCode(passcode,req.query.email)
        console.log(resultUpdatePasscode)
        sendEmail(req.query.email,passcode)
        res.send("ระบบจะส่ง Code ใหม่ให้ทาง Email ที่ลงทะเบียนไว้")
        
    }
})

// Clock-in Clock-out
app.post('/save-time',async (req,res) => {
    var resultById = await findIdByPassCode(req.query.passcode)
    if(resultById == '') {
        res.send('Code ไม่ถูกต้อง')
    }else{
        var resultByUpdate = await updateClockOut(resultById[0].user_id)
        if(resultByUpdate.changedRows == 1) {
            res.send("Clock-Out เรียบร้อยครับ")
        }else{
            var resultByInsert = await insertClockIn(resultById[0].user_id)
            console.log(resultByInsert)
            res.send("Clock-In เรียบร้อยครับ")
        }
    }
})

// Insert user_info
function insertUser(name,email,passcode) {
    return new Promise( function executor(resolve) { 
        db.query("INSERT INTO user_info(name,email,passcode) VALUES( ? , ? , ? );",[name,email,passcode],function f(error, data) {
            if (error) {
                console.log(error)
            } else {
                resolve(data)
            }
        })
    })
}

// Check Passcode
function findIdByPassCode(value) {
    return new Promise( function executor(resolve) { 
        db.query("SELECT user_id FROM user_info WHERE passcode = ?;",value,function f(error, data) {
            if (error) {
                console.log(error)
            } else {
                resolve(data)
            }
        })
    })
}

// Update Clock-out
function updateClockOut(value) {
    return new Promise( function executor(resolve) { 
        db.query("UPDATE tran_backup SET clock_out = now() WHERE clock_out is null AND user_id = ?;",value,function f(error, data) {
            if (error) {
                console.log(error)
            } else {
                resolve(data)
            }
        })
    })
}

// Insert Clock-in
function insertClockIn(value) {
    return new Promise( function executor(resolve) { 
        db.query("INSERT INTO tran_backup(user_id,clock_in) VALUES( ? , now() );",value,function f(error, data) {
            if (error) {
                console.log(error)
            } else {
                resolve(data)
            }
        })
    })
}

// Check Name
function checkName(value) {
    return new Promise( function executor(resolve) { 
        db.query("SELECT name FROM user_info WHERE name = ? ;",value,function f(error, data) {
            if (error) {
                console.log(error)
            } else {
                resolve(data)
            }
        })
    })
}

// Check Email
function checkEmail(value) {
    return new Promise( function executor(resolve) { 
        db.query("SELECT email FROM user_info WHERE email = ? ;",value,function f(error, data) {
            if (error) {
                console.log(error)
            } else {
                resolve(data)
            }
        })
    })
}

// Update Passcode
function updatePassCode(passcode,email) {
    return new Promise( function executor(resolve) { 
        db.query("UPDATE user_info SET passcode = ? WHERE email = ? ;",[passcode,email],function f(error, data) {
            if (error) {
                console.log(error)
            } else {
                resolve(data)
            }
        })
    })
}

// Genarate Code
async function genPassCode(){
    var generate = Math.floor(Math.random() * 90000)+10000
    var result = await findIdByPassCode(generate)
    if(result==''){
        return ''+generate
    }else{
        return genPassCode()
    }
}

//Send NewCode BY Email
function sendEmail(email,passcode) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: ''
        }
    })
    const option = {
        from: 'suchon0026@gmail.com',
        to: email,
        subject: 'Code recovery',
        html: 'New Code : '+passcode
    }
    transporter.sendMail(option, (error,data) => {
        if(error) {
            console.log(error)
        }else{
            console.log(data)
        }
    })
}