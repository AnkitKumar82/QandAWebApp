import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from 'moment';
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
});

class Search extends Component {
    constructor(props){
        super(props);
        this.state ={
            query : props.match.params.query || "",
            querytype : props.querytype, // query type will be q/s/ ==> a/  /s/q   /s/u/
            questions : [],
            currentOffset : 0,
            noMoreData : false
        }
    }
    componentDidMount = async () => {
        await this.fetchQuestions();
    }
    fetchQuestions = async () => {
        let apiCallUrl;
        if( this.state.querytype.localeCompare("a") === 0){
            apiCallUrl = `/q/s/${this.state.querytype}/${this.state.currentOffset}`;
        }else{
            apiCallUrl = `/q/s/${this.state.querytype}/${this.state.currentOffset}/${this.state.query}`;
        }
        let responseAllQuestions = await getCall({api:apiCallUrl});
        this.setState({
            currentOffset : this.state.currentOffset+1
        });
        if(responseAllQuestions && responseAllQuestions.allFetchStatus){
            this.setState({
                questions : [...this.state.questions,...responseAllQuestions.questions]
            });
            if(responseAllQuestions.questions.length < 10){
                this.setState({
                    noMoreData : true
                })
            }
        }else{
            window.location.href = "/error"
        }
    }
    render() {
        const {classes } = this.props;
        let headingDynamic;
        if(this.state.querytype.localeCompare("a")===0){
            headingDynamic = "ALL RESULTS";
        }else if(this.state.querytype.localeCompare("q")===0){
            headingDynamic = "ALL RESULTS FOR QUERY '"+this.state.query+"'";
        }else{
            headingDynamic = "ALL QUESTIONS BY USER '"+this.state.query+"'";
        }         
        return (
            <div className = {classes.root}>
            <Paper className={classes.paper}>
            {this.state.questions.length===0 &&
                <Typography className={classes.title}>
                    {"No Results Found!"}
                </Typography>
            }
            {this.state.questions.length !==0 &&
                <Typography className={classes.title}>
                    {headingDynamic}
                </Typography>
            }
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
                            <Grid key={`${question.questionid}_username`} item xs={12}>
                                <Typography className={classes.user}>
                                    {question.answers}{` Answer${((question.answers===1)?"":"s")} `}{'\u2022'}
                                    <a style={{color:"#103070",textDecoration:"none"}} href={`/s/u/${question.username}`}>
                                        {" "}{question.username}{" asked"}
                                    </a>
                                    {` ${moment(question.created).fromNow()} `}
                                </Typography>
                            </Grid> 
                        </Grid>
                        {index!==this.state.questions.length-1 && 
                                <Divider className={classes.dividerClass} key={`${question.questionid}_divider`} />
                            }
                        </div>
                    )
                })}
                </div>
                {!this.state.noMoreData &&
                <Button style={{margin:"0 auto",display:"block"}} onClick={()=>{this.fetchQuestions();}} variant="contained" color="default">{"Load More"}</Button>
                }
            </Paper>
        </div>
        )
    }
}
Search.propTypes = {
    classes : PropTypes.object.isRequired
}
export default withStyles(styles)(Search);