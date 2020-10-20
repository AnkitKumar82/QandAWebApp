import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import {
    Grid,
    Typography,
    Button,
    Paper,
    Divider
} from "@material-ui/core";
import {
    withStyles
} from "@material-ui/core/styles";
import {getCall} from "./Apicalls.js";

const styles = (theme)=>({
    appbar :{
        backgroundColor : "#103070"
    },
    root : {
        flexGrow : 1
    },
    menuButton : {
        color : "#FDFDFD",
        fontFamily : 'Open Sans',
        marginRight : theme.spacing(1)
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
});

class Question extends Component {
    constructor(props){
        super(props);
        this.state = {
            token : props.token,
            isLoggedIn : props.isLoggedIn,
            username : props.username,
            userid : props.userid,
            questionid : props.match.params.quesid,
            question : {},
            answers : []
        }
    }
    componentDidMount = async () => {
        this.fetchQuestionData(this.state.questionid);
    }
    fetchQuestionData = async (quesId) => {
        let getQuestionData = await getCall({api:`/q/${quesId}`});
        if(getQuestionData && getQuestionData.oneFetchStatus){
            this.setState({
                question: getQuestionData.question,
                answers : [...getQuestionData.answers]
            });
        }else{            
            window.location.href = "/error"
        }
    }
    componentWillReceiveProps(props){
        this.setState({
            token : props.token,
            isLoggedIn : props.isLoggedIn,
            username : props.username,
            userid : props.userid
        });
    }
    render() {
        const {classes} = this.props;        
        return (
            <div className={classes.root}>
                <Paper className = {classes.paper}>
                    <div className = {classes.questionsList}>
                    <Grid container
                            key = {this.state.question.questionid}
                            className={classes.grid}
                            direction="row"
                            justify="space-between"
                            spacing={1}>
                            <Grid item key={"questionbody"} xs={12}>
                                <Typography className={classes.title}>
                                {this.state.question.question}
                                </Typography>
                            </Grid>
                            <Grid key={`${"questionlink"}_username`} item xs={12}>
                                <Typography className={classes.user}>
                                    {this.state.answers.length}{` Answer${((this.state.question.answers===1)?"":"s")} `}{'\u2022'}
                                    <Link style={{color:"#103070",textDecoration:"none"}} to={`/s/u/${this.state.question.username}`}>
                                        {" "}{this.state.question.username}{" asked"}
                                    </Link>
                                    {` ${moment(this.state.question.created).fromNow()} `}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography className={classes.key}>
                                        <Button color = "primary" onClick = {()=>{this.props.answerQuestion(this.state.questionid)}} variant="contained">Answer</Button>
                                </Typography>
                            </Grid>
                        </Grid>
                        </div>
                    </Paper>
                    {this.state.answers.length > 0 && 
                    <Paper className={classes.paper}>
                        <Typography className={classes.title}>
                            {"ANSWERS"}
                        </Typography>
                        <div className={classes.questionsList}>
                        {this.state.answers.map((answer,index)=>{
                            return (
                            <div key = {`${answer.answerid}_basediv`} >
                            <Grid container
                                key = {`${answer.answerid}_basegrid`}
                                className={classes.grid}
                                direction="row"
                                justify="space-between"
                                spacing={1}>
                                <Grid key={`${answer.answerid}_answerid`} item xs={12}>
                                    <Typography noWrap className={classes.answer}>
                                        {answer.answer}
                                    </Typography>
                                </Grid>
                                <Grid key={`${answer.answerid}_username`} item xs={12}>
                                    <Typography className={classes.user}>
                                    <Link style={{color:"#103070",textDecoration:"none"}} to={`/s/u/${answer.username}`}>
                                        {answer.username}{" answered"}
                                    </Link>
                                    {` ${moment(answer.created).fromNow()} `}    
                                    </Typography>
                                <Typography className={classes.user}>
                                        
                                </Typography>
                                </Grid>
                            </Grid>
                            {index!==this.state.answers.length-1 && 
                                    <Divider className={classes.dividerClass} key={`${answer.answerid}_divider`} />
                                }
                            </div>    
                        )})
                        }
                        </div>
                    </Paper>
                    }
            </div>
        )
    }
}

Question.propTypes = {
    classes : PropTypes.object.isRequired
}
export default withStyles(styles)(Question);
