import React, { Component } from 'react'
import { postCall } from "./Apicalls.js";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from 'moment';
import Edit from './Edit.js';
import {
    Grid,
    Typography,
    Button,
    Paper,
    Divider,
    TextField,
    ButtonGroup
} from "@material-ui/core";
import {
    withStyles
} from "@material-ui/core/styles";

const styles = (theme)=>({
    root : {
        flexGrow : 1
    },
    title : {
        fontWeight : 800,
        fontSize : "18px",
        padding : theme.spacing(2),
        color: "#103070",
        fontFamily : "Open Sans"
    },
    question :{
        fontFamily : "Open Sans",
        color : "#103070",
        fontWeight : "600",
    },
    answer :{
        marginTop : theme.spacing(1), 
        fontFamily : "Open Sans",
        fontWeight : "600",
    },
    user : {
        fontFamily : "Open Sans",
        fontSize : "80%",
        color : "#666666",
        fontWeight : "400"
    },
    grid : {
        padding : theme.spacing(3)
    },
    questionsList :{
        border : "1px solid rgba(0,0,0,0.1)",
        borderRadius : "10px",
    },
    dividerClass : {
        color : "rgba(0,0,0,0.1)"
    },
    paper: {
        marginLeft : theme.spacing(1),
        marginTop : theme.spacing(1), 
        marginRight : theme.spacing(1),
        padding: theme.spacing(3),
        textAlign: 'left',
        fontFamily : "Open Sans",
        whiteSpace: 'nowrap',
      },
    textfield :{
        width : "100%"
    }
});

class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            token : props.token,
            username : "",
            passwordOld : "",
            passwordNew : "",
            passwordConfirm : "",
            questions : [],
            answers : [],
            errorPassword : false,
            errorMessagePassword : "",
            showEditModal : false,
            editType : "",
            editTypeLabel : "",
            editId : "",
            defaultValue : ""
        }
    }
    componentDidMount(){
        this.fetchAllData();
    }
    hideEditModal = () =>{
        this.setState({
          showEditModal : false,
        })
    }
    handlePasswordUpdate = async ()=>{
        if(this.state.passwordOld.length === 0 || this.state.passwordNew.length === 0){
            this.setState({
                errorPassword : true,
                errorMessagePassword : "Password can't be empty!"
            });
        return;
        }
        if(this.state.passwordNew.localeCompare(this.state.passwordOld)===0){
            this.setState({
                errorPassword : true,
                errorMessagePassword : "Old password and new password can't be same!"
            });
            return;
        }
        if(this.state.passwordNew.localeCompare(this.state.passwordConfirm) !== 0){
            this.setState({
                errorPassword : true,
                errorMessagePassword : "Confirmation Password not matched!"
            });
            return;
        }
        let response = await postCall({body:{token : this.state.token,passwordold:this.state.passwordOld,passwordnew:this.state.passwordNew},api:`/u/r/p`});
        if(response!==null){
            if(response.isDone){
                this.setState({
                    error : true,
                    errorMessagePassword : "Password Changed!"
                })
            }else{
                this.setState({
                    errorPassword : true,
                    errorMessagePassword : response.errorMessage
                })
            }
        }else{
            window.location.href = "/error";
        }
    }
    handleAnswerDelete = async (answer) =>{
        let response = await postCall({body:{token : this.state.token, answerid : answer.answerid},api:`/u/r/d/answer`});
        if(response.isDone){
            this.setState({
                answers : [...this.state.answers.filter((e,idx)=>{
                    return parseInt(e.answerid) !== parseInt(answer.answerid);
                })]
            });
        }else{
            window.location.href = '/error';
        }
    }
    handleQuestionDelete = async (question)=>{
        let response = await postCall({body:{token : this.state.token, questionid : question.questionid},api:`/u/r/d/question`});
        if(response.isDone){
            this.setState({
                questions : [...this.state.questions.filter((e,idx)=>{
                    return parseInt(e.questionid) !== parseInt(question.questionid);
                })],
                answers : [...this.state.answers.filter((e,idx)=>{
                    return parseInt(e.questionid) !== parseInt(question.questionid);
                })]
            });
        }else{
            window.location.href = '/error';
        }   
    }
    handleAnswerEdit = async (answer)=>{
        this.setState({
            editType : "answer",
            editTypeLabel : "Answer",
            editId: answer.answer.answerid,
            defaultValue : answer.answer.answer,
            showEditModal : true
        });
    }
    handleQuestionEdit = async (question)=>{
        this.setState({
            editType : "question",
            editTypeLabel : "Question",
            editId: question.question.questionid,
            defaultValue : question.question.question,
            showEditModal : true
        });
    }
    fetchAllData = async ()=>{
        let responseAllUserData = await postCall({body:{token:this.state.token},api:"/u/r/profile"});
        if(responseAllUserData && responseAllUserData.allFetchStatus){
            this.setState({
                username : responseAllUserData.username,
                questions : [...this.state.questions,...responseAllUserData.questions],
                answers : [...this.state.answers,...responseAllUserData.answers],
            });
        }else{
            window.location.href = "/error";
        }
    }
    render() {
        const {classes} = this.props;
        return (
            <div className = {classes.root}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12}>
                        <Paper className={classes.paper}>
                            <Typography className={classes.title}>
                                {this.state.username}
                            </Typography>
                        <Grid item xs={6} container spacing={1}>
                            <Grid item xs={12} sm={6}>
                                <TextField type="password" className={classes.textfield} size="small" label="Old Password" onChange = {(e)=>{this.setState({passwordOld : e.target.value})}} variant="outlined"/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField type="password" className={classes.textfield} size="small" label="New Password" onChange = {(e)=>{this.setState({passwordNew : e.target.value})}} variant="outlined"/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField type="password" className={classes.textfield} size="small" label="Confirm Password" onChange = {(e)=>{this.setState({passwordConfirm : e.target.value})}} variant="outlined"/>
                            </Grid>
                            <Grid item xs={12}></Grid>
                            {this.state.errorPassword && 
                            <Grid item xs={12}style={{fontSize:"70%",fontFamily: "Open Sans",color : "red"}}>{this.state.errorMessagePassword}</Grid>}
                            <Grid item xs={12}>
                                <Button style={{fontFamily : 'Open Sans'}} onClick={()=>{this.handlePasswordUpdate()}} variant="contained" color="secondary">{"Update Password"}</Button>
                            </Grid>
                        </Grid>
                        </Paper>
                    </Grid>
                    {this.state.questions.length !==0 &&
                    <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper}>
                        <Typography className={classes.title}>
                            {"ALL QUESTIONS ASKED"}
                        </Typography>
                        <div className={classes.questionsList}>
                            {this.state.questions.map((question,index)=>{
                            return (
                                <div key = {`${question.questionid}_basediv`}>
                                    <Grid container
                                        key = {question.questionid}
                                        className={classes.grid}
                                        direction="row"
                                        justify="space-between"
                                        spacing={1}>
                                        <Grid key={`${question.questionid}_questionid`} item xs={12}>
                                        <Link style={{textDecoration:"none"}} to={`/q/${question.questionid}`}>
                                            <Typography noWrap className={classes.question}>
                                                {question.question}
                                            </Typography>
                                        </Link>
                                        </Grid>
                                        <Grid key={`${question.questionid}_username`} item xs={6}>
                                            <Typography className={classes.user}>
                                                {` ${moment(question.created).fromNow()} `}
                                            </Typography>
                                        </Grid>
                                        <Grid key={`${question.questionid}_buttons`} item xs={6}>
                                            <ButtonGroup size="small">
                                                <Button color="primary" variant="outlined" onClick = {()=>{this.handleQuestionEdit({question})}}>{"Edit"}</Button>
                                                <Button variant="outlined" onClick={()=>{this.handleQuestionDelete(question)}} color="secondary">{"Delete"}</Button>
                                            </ButtonGroup>
                                        </Grid>
                                    </Grid>
                                    {index!==this.state.questions.length-1 && 
                                        <Divider className={classes.dividerClass} key={`${question.questionid}_divider`} />
                                    }
                                </div>
                            )
                        })}
                        </div>
                    </Paper>
                    </Grid>
                    }
                    {this.state.answers.length !==0 &&
                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.paper}>
                        <Typography className={classes.title}>
                                {"ALL ANSWERS"}
                            </Typography>
                                <div className={classes.questionsList}>
                                    {this.state.answers.map((answer,index)=>{
                                    return (
                                        <div key = {`${answer.answerid}_basediv`}>
                                            <Grid container
                                                key = {answer.answerid}
                                                className={classes.grid}
                                                direction="row"
                                                justify="space-between"
                                                spacing={1}>
                                                <Grid key={`${answer.answerid}_answer_answerid`} item xs={12}>
                                                <Link style={{textDecoration:"none"}} to={`/q/${answer.questionid}`}>
                                                    <Typography noWrap className={classes.question}>
                                                        {answer.answer}
                                                    </Typography>
                                                </Link>
                                                </Grid>
                                                <Grid key={`${answer.answerid}_answer_answer`} item xs={6}>
                                                    <Typography className={classes.user}>
                                                        {` ${moment(answer.created).fromNow()} `}
                                                    </Typography>
                                                </Grid>
                                                <Grid key={`${answer.answerid}_butttons`} item xs={6}>
                                                <ButtonGroup size="small">
                                                    <Button color="primary" variant="outlined" onClick = {()=>{this.handleAnswerEdit({answer})}}>{"Edit"}</Button>
                                                    <Button variant="outlined" onClick={()=>{this.handleAnswerDelete(answer)}} color="secondary">{"Delete"}</Button>
                                                </ButtonGroup>
                                                </Grid>
                                            </Grid>
                                            {index!==this.state.answers.length-1 && 
                                                <Divider className={classes.dividerClass} key={`${answer.answerid}_divider_answer`} />
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                        </Paper>
                    </Grid>
                    }
                </Grid>
                <Edit showModal={this.state.showEditModal} token={this.state.token} hideModal={()=>this.hideEditModal()} defaultValue={this.state.defaultValue} editId={this.state.editId} editType={this.state.editType} editTypeLabel={this.state.editTypeLabel}/>
            </div>
        )
    }
}
Profile.propTypes = {
    classes : PropTypes.object.isRequired
}
export default withStyles(styles)(Profile);
