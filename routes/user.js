const express = require('express');
const jwt = require('../JWT.js');
const con = require("../mysql.js");
const bcrypt = require("bcrypt");
let logger = require("../Logger");
const saltRounds = 10;
const router = express.Router();
var TokenVerify = async (req,res,next)=>{
    let data = await jwt.jwtVerify(req.body.token);
    if(!data){
        logger.debug({reqBody:req.body},"Token not verified");
        res.send({
            isDone : false,
            errorMessage : "User not logged in or Token Invalid,Clear all cookies and try to login again..."
        })
    }else{
        logger.debug({reqBody:req.body},"Token verified");
        req.body.username = data.username;
        req.body.userid = data.userid;
        next();
    }
}
router.use('/r',TokenVerify);
router.post('/r/askquestion',async(req,res)=>{
    if(req.body.question.length === 0){
        logger.debug({reqBody:req.body},"Quesion length zero error, sending null");
        res.send(null);
        return;
    }
    let mysqlquery = `INSERT INTO question(userid,question,votes) VALUES (?,?,0)`;
    let inserts = [req.body.userid,req.body.question];
    mysqlquery = con.format(mysqlquery, inserts);
    console.log(mysqlquery);
    con.query(mysqlquery,(err,responseQuestionAdd)=>{
        if(err){
            logger.debug({reqBody:req.body,err:err},"Error on ask question insert query");
            res.send({
                isDone : false,
                errorMessage : "Server side issue"
            })
        }else{
            logger.debug({reqBody:req.body,err:err},"Ask question insert query success");
            res.send({
                isDone: true
            });
        }
    });
});
router.post('/r/addanswer',async(req,res)=>{
    let questionid = req.body.questionid;
    let answer =  req.body.answer;
    if(answer.length === 0){
        logger.debug({reqBody:req.body},"Error on add answer,answer length 0");
        res.send(null);
        return;
    }
    let userid = req.body.userid;
    let mysqlquery = `SELECT questionid FROM question WHERE questionid =  ? `;
    let inserts = [questionid,userid,answer];
    mysqlquery = con.format(mysqlquery, inserts);

    con.query(mysqlquery,(err,responseQuestionExist)=>{
        if(err || responseQuestionExist.length == 0){
            logger.debug({reqBody:req.body,err:err},"Error on add answers search question select query,question doesn't exist or server side issue");
            res.send({
                isDone : false,
                errorMessage : "Question doesnt exist"
            });
        }else{
            mysqlquery = `INSERT INTO answer(questionid,userid,answer,votes) VALUES (?,?,?,0)`;
            mysqlquery = con.format(mysqlquery, inserts);
            con.query(mysqlquery,(err,responseAddAnswer)=>{
                if(err){
                    logger.debug({reqBody:req.body,err:err},"Error on add answer insert query");
                    res.send({
                        isDone : false,
                        errorMessage : "Server side issue"        
                    });
                }else{
                    logger.debug({reqBody:req.body},"Add answer insert query success");
                    res.send({
                        isDone: true
                    })
                }
            });
        }
    })
});
router.post('/r/d/answer',async(req,res)=>{
    let answerid =  req.body.answerid;
    let userid = req.body.userid;
    let mysqlquery = "DELETE FROM answer WHERE answerid = ? and userid=?";
    let inserts = [answerid,userid];
    mysqlquery = con.format(mysqlquery, inserts);
    con.query(mysqlquery,(err,responseDeleteAnswer)=>{
        if(err){
            logger.debug({reqBody:req.body,err:err},"Error on delete answer query");
            res.send({
                isDone : false,
                errorMessage : "Server side issue!"
            });
        }else{
            logger.debug({reqBody:req.body},"Delete answer query success");
            res.send({
                isDone: true
            });
        }
    });
});
router.post('/r/d/question',async(req,res)=>{
    let questionid =  req.body.questionid;
    let userid = req.body.userid;
    let mysqlquery1 = "DELETE FROM question WHERE questionid = ? and userid = ?";
    let inserts = [questionid,userid];
    mysqlquery = con.format(mysqlquery1, inserts);
    con.query(mysqlquery,(err,responseDeleteQuestion)=>{
        if(err){
            logger.debug({reqBody:req.body,err:err},"Error on delete question query");
            res.send({
                isDone : false,
                errorMessage : "Server side issue!"
            });
        }else{
            logger.debug({reqBody:req.body},"Delete question query success only question delete part");
            let mysqlquery1 = "DELETE FROM answer WHERE questionid = ?";
            let inserts = [questionid];
            mysqlquery = con.format(mysqlquery1, inserts);
            con.query(mysqlquery,(err,responseDeleteAnswer)=>{
                if(err){
                    logger.debug({reqBody:req.body,err:err},"Error on delete answer query when deleting question");
                    res.send({
                        isDone : false,
                        errorMessage : "Server side issue!"
                    });
                }else{
                    logger.debug({reqBody:req.body},"Delete question query success");
                    res.send({
                        isDone: true
                    });
                }
            });

        }
    });
})
router.post('/r/e/question',async(req,res)=>{
    let value =  req.body.value;
    if(value.length === 0){
        res.send(null);
        return;
    }
    let userid = req.body.userid;
    let editid = req.body.editid;
    let mysqlquery = "UPDATE question SET question = ? WHERE questionid = ? and userid=?";
    let inserts = [value,editid,userid];
    mysqlquery = con.format(mysqlquery, inserts);
    con.query(mysqlquery,(err,responseEditQuestion)=>{
        if(err){
            logger.debug({reqBody:req.body,err:err},"Error on edit question query");
            res.send({
                isDone : false,
                errorMessage : "Server side issue!"
            });
        }else{
            logger.debug({reqBody:req.body},"Edit question query success");
            res.send({
                isDone: true
            });
        }
    });
});
router.post('/r/e/answer',async(req,res)=>{
    let value =  req.body.value;
    if(value.length === 0){
        res.send(null);
        return;
    }
    let userid = req.body.userid;
    let editid = req.body.editid;
    let mysqlquery = "UPDATE answer SET answer = ? WHERE answerid = ? and userid=?";
    let inserts = [value,editid,userid];
    mysqlquery = con.format(mysqlquery, inserts);
    con.query(mysqlquery,(err,responseEditAnswer)=>{
        if(err){
            logger.debug({reqBody:req.body,err:err},"Error on edit answer query");
            res.send({
                isDone : false,
                errorMessage : "Server side issue!"
            });
        }else{
            logger.debug({reqBody:req.body,err:err},"edit answer query success");
            res.send({
                isDone: true
            });
        }
    });
});
router.post('/r/profile',async(req,res)=>{
    let data = true;
    let userid = req.body.userid;
    if(!Number.isInteger(userid)){
        res.send({
            allFetchStatus: false,
            error: "Userid invalid"
        });
        return;
    }
    let mysqlquery =   `SELECT username FROM users WHERE userid = ${userid};
                        SELECT * FROM question WHERE question.userid = ${userid};
                        SELECT * FROM answer WHERE answer.userid = ${userid};`;

    con.query(mysqlquery, function(err, results) {
        if (err){
            logger.debug({reqBody:req.body,err:err},"Error on fetching profile query");
            res.send(null);
        }else{
            logger.debug({reqBody:req.body},"Fetching profile query success");
            res.send({
                allFetchStatus : true,
                username : results[0][0].username,
                questions : results[1],
                answers : results[2]
            });
        }
      });
});
router.post('/r/p',async(req,res)=>{
    let password = req.body.passwordold;
    let passwordnew = req.body.passwordnew;
    let userid = req.body.userid;
    if(passwordnew.localeCompare(password)===0 || passwordnew.length === 0 || password.length === 0){
        return null;
    }
    let mysqlquery = "SELECT password FROM users WHERE userid = ? LIMIT 1";
    let inserts = [userid];
    mysqlquery = con.format(mysqlquery,inserts);
    con.query(mysqlquery,async (err,responseUserAuth)=>{
        if(err){
            logger.debug({reqBody:req.body,err:err},"Error on select password query while changing password");
            return;
        }else{
            if(responseUserAuth.length === 0){
                res.send({
                    isDone : false,
                    errorMessage : "Wrong userid"
                })
            }else{
                let passwordMatch = await bcrypt.compare(password,responseUserAuth[0].password);
                if(!passwordMatch){
                    logger.debug({reqBody:req.body},"Password change fail, old password didn't match");
                    res.send({
                        isDone : false,
                        errorMessage : "Wrong old password!"
                    });
                }else{
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        bcrypt.hash(passwordnew, salt, function(err, hash) {
                            let mysqlquery = "UPDATE users SET password = ? WHERE userid = ?";
                            let inserts = [hash,userid];
                            mysqlquery = con.format(mysqlquery,inserts);
                            con.query(mysqlquery,async (err,responseUserAuth)=>{
                                if(err){
                                    logger.debug({reqBody:req.body},"Password change fail, internal issue");
                                    res.send(null);
                                    return;
                                }else{
                                    logger.debug({reqBody:req.body},"Password change success");
                                    res.send({
                                        isDone : true
                                    });
                                }
                            });
                        });
                    });
                }
            }
        }
    });
})
router.post('/login',async (req,res)=>{
    let username = req.body.username;
    let password;
    let inserts = [username];

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            password = hash;
            let mysqlquery = `SELECT username,userid,password FROM users WHERE username  = ? LIMIT 1`;
            mysqlquery = con.format(mysqlquery, inserts);
            con.query(mysqlquery,async (err,responseUserAuth)=>{
                if(err){
                    logger.debug({reqBody:req.body,err:err},"Login query fail");
                    res.send(null);
                }else{
                    if(responseUserAuth.length == 0){
                        logger.debug({reqBody:req.body},"Login fail user doesnt exist");
                        res.send({
                            isLoggedIn : false,
                            errorMessage : "User doesn't exist!"
                        });
                    }else{
                        let passwordMatch = await bcrypt.compare(req.body.password,responseUserAuth[0].password);
                        if(!passwordMatch){
                            logger.debug({reqBody:req.body},"Login failed, password didn't match");
                            res.send({
                                isLoggedIn : false,
                                errorMessage : "Incorrect password!"
                            });
                        }else{
                            let token = await jwt.getToken({username : username,userid : responseUserAuth[0].userid});
                            logger.debug({reqBody:req.body},"Login success");
                            res.send({
                                isLoggedIn : true,
                                username : username,
                                token : token               
                            });
                        }
                    }
                }
            });
        });
    });
});
router.post('/register',async (req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    if(username === '' || password===''){
        res.send(null);
        return;
    }
    let inserts = [username];
    await bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            password = hash;
            let mysqlquery = `SELECT username FROM users WHERE username=?`;
            mysqlquery = con.format(mysqlquery, inserts);
            con.query(mysqlquery,(err,responseUserAuth)=>{
                if(err){
                    logger.debug({reqBody:req.body,err:err},"User register query fail");
                    res.send(null);
                }else{
                    if(responseUserAuth.length > 0){
                        logger.debug({reqBody:req.body},"User already exist");
                        res.send({
                            isLoggedIn : false,
                            errorMessage : "User already exist!"
                        });
                    }else{
                        mysqlquery = `INSERT INTO users(username,password) VALUES(?,'${password}')`;
                        mysqlquery = con.format(mysqlquery, inserts);
                        con.query(mysqlquery,(err,responseUserAuthInsert)=>{
                            if(err){
                                logger.debug({reqBody:req.body,err:err},"User register fail, insert query");
                                res.send(null);
                            }else{
                                mysqlquery = `SELECT username,userid FROM users WHERE username  = ?`;
                                mysqlquery = con.format(mysqlquery, inserts);
                                con.query(mysqlquery,async (err,responseUserAuthSelect)=>{
                                    if(err){   
                                        logger.debug({reqBody:req.body,err:err},"Userid fetch query fail");
                                        res.send(null);
                                    }else{
                                        let token = await jwt.getToken({username : username,userid : responseUserAuthSelect[0].userid});
                                        logger.debug({reqBody:req.body},"Register success");
                                        res.send({
                                            isLoggedIn : true,
                                            username : username,
                                            token : token
                                        });        
                                    }
                                });
                        }
                    })
                }
            }
            });
        });
    });
    //will soon implement trie of usernames for faster response
});

router.post('/usertoken',async (req, res) => {
    let dataFromJwt = await jwt.jwtVerify(req.body.token);
    if(dataFromJwt!== null){
        logger.debug({reqBody:req.body},"User token verification failed");
        res.send({
            tokenValid : true,
            userid : dataFromJwt.userid,
            username : dataFromJwt.username
        });
    }else{
        logger.debug({reqBody:req.body},"User token verification success");
        res.send({
            tokenValid : false,
            username : "fakeAccount"
        });
    }
});


module.exports = router;
