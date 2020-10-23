const express = require('express');
const router = express.Router();
const con = require("../mysql.js");
let logger = require("../Logger");
router.get('/s/a/:offset',async (req,res)=>{
    let offset = req.params.offset;
    let limit = 10;
    let mysqlquery = `SELECT users.userid,question.questionid, question,username,question.votes,question.created,IFNULL(count(answer.answerid),0) as answers FROM question LEFT JOIN answer ON answer.questionid = question.questionid INNER JOIN users ON users.userid = question.userid GROUP BY question.questionid LIMIT ${limit} OFFSET ${offset*limit};`;
    con.query(mysqlquery,(err,response)=>{
        if(err){
            logger.debug({reqParams:req.params,err:err},"All question fetch query fail");
            res.send(null);
        }else{
            logger.debug({reqParams:req.params},"All question fetch query success");
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
            logger.debug({reqParams:req.params,err:err},"Search question with searchstring query fail");
            res.send(null);
        }else{
            logger.debug({reqParams:req.params},"Search question with searchstring query success");
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
            logger.debug({reqParams:req.params,err:err},"All question by specific user query fail");
            res.send(null);
        }else{
            logger.debug({reqParams:req.params},"All question by specific user query success");
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
            logger.debug({reqParams:req.params,err:err},"One question question fetch query fail");
            res.send(null);
        }else{
            mysqlquery =   `SELECT users.userid,users.username, answer.answerid,answer.answer, answer.votes,answer.created FROM answer,users WHERE answer.userid=users.userid && answer.questionid= ?`;
            mysqlquery = con.format(mysqlquery, inserts);
            con.query(mysqlquery,(err,responseAnswer)=>{
                if(err){
                    logger.debug({reqParams:req.params,err:err},"One question fetch query fail");
                    res.send(null);
                }else{
                    logger.debug({reqParams:req.params},"One question fetch query success");
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
