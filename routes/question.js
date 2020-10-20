const { response } = require('express');
const express = require('express');
const router = express.Router();
const con = require("../mysql.js");
router.get('/s/a/:offset',async (req,res)=>{
    let offset = req.params.offset;
    let limit = 10;
    let mysqlquery = `SELECT users.userid,question.questionid, question,username,question.votes,question.created,IFNULL(count(answer.answerid),0) as answers FROM question LEFT JOIN answer ON answer.questionid = question.questionid INNER JOIN users ON users.userid = question.userid GROUP BY question.questionid LIMIT ${limit} OFFSET ${offset*limit};`;
    con.query(mysqlquery,(err,response)=>{
        if(err){
            console.log(err);
            res.send(null);
        }else{
            res.send({
                allFetchStatus : true,
                questions : response
            });
        }
    });
});
router.get('/s/q/:offset/:searchquery',(req,res)=>{
    let offset = req.params.offset;
    let searchquery = req.params.searchquery;
    let limit = 10;
    let mysqlquery = `SELECT users.userid,question.questionid, question,username,question.votes,question.created,IFNULL(count(answer.answerid),0) as answers FROM question LEFT JOIN answer ON answer.questionid = question.questionid INNER JOIN users ON users.userid = question.userid WHERE question.question LIKE ? GROUP BY question.questionid LIMIT ${limit} OFFSET ${offset*limit};`;
    let inserts = ["%"+searchquery+"%"];
    mysqlquery = con.format(mysqlquery, inserts);
    con.query(mysqlquery,(err,response)=>{
        if(err){
            console.log(err);
            res.send(null);
        }else{
            res.send({
                allFetchStatus : true,
                questions : response
            });
        }
    });
});


router.get('/s/u/:offset/:username',(req,res)=>{
    let offset = req.params.offset;
    let searchquery = req.params.username;
    let limit = 10;
    let mysqlquery = `SELECT users.userid,question.questionid, question,username,question.votes,question.created,IFNULL(count(answer.answerid),0) as answers FROM question LEFT JOIN answer ON answer.questionid = question.questionid INNER JOIN users ON users.userid = question.userid WHERE users.username = ? GROUP BY question.questionid LIMIT ${limit} OFFSET ${offset*limit};`;
    let inserts = [searchquery];
    mysqlquery = con.format(mysqlquery, inserts);
    con.query(mysqlquery,(err,response)=>{
        if(err){
            console.log(err);
            res.send(null);
        }else{
            res.send({
                allFetchStatus : true,
                questions : response
            });
        }
    });

});


//For fetching a single question
router.get('/:id',(req,res)=>{
    let questionid = req.params.id;
    let mysqlquery = `SELECT users.userid,question.questionid,question,username,question.votes,question.created FROM question,users WHERE question.questionid = ? AND question.userid = users.userid`;
    let inserts = [questionid];
    mysqlquery = con.format(mysqlquery, inserts);
    con.query(mysqlquery,(err,responseQuestion)=>{
        if(err || responseQuestion.length!=1){
            console.log(err);
            res.send(null);
        }else{
            mysqlquery =   `SELECT users.userid,users.username, answer.answerid,answer.answer, answer.votes,answer.created FROM answer,users WHERE answer.userid=users.userid && answer.questionid= ?`;
            mysqlquery = con.format(mysqlquery, inserts);
            con.query(mysqlquery,(err,responseAnswer)=>{
                if(err){
                    console.log(err);
                    res.send(null);
                }else{
                    res.send({
                        oneFetchStatus : true,
                        question : responseQuestion[0],
                        answers : responseAnswer
                    });
                }
            });
        }
    });
});
module.exports = router;
