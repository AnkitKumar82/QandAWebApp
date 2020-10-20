import React, { Component } from 'react';
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import { getCall } from "./Apicalls.js";
import {
    Paper,
    Grid,
    Typography,
    Divider,
    Button
} from "@material-ui/core";
import {
    withStyles
} from "@material-ui/core/styles";
const styles = (theme)=>({
    root : {
        width: '100%',
    },
    grid :{
        padding : theme.spacing(1)
    },
    question :{
        fontFamily : "Open Sans",
        color : "#103070",
        fontWeight : "600",
    },
    paper: {
        marginLeft : theme.spacing(1),
        marginTop : theme.spacing(1), 
        marginRight : theme.spacing(1),
        padding: theme.spacing(1),
        textAlign: 'left',
        fontFamily : "Open Sans",
        whiteSpace: 'nowrap',
    },
    user : {
        fontFamily : "Open Sans",
        color : "#666",
        fontWeight : "400"
    },
    votes : {
        fontFamily : "Open Sans",
        color : "#666",
        fontWeight : "400"
    },
    textfield :{
        width : "100%",
        color : "secondary"
    },
    title : {
        fontWeight : 800,
        fontSize : "18px",
        padding : theme.spacing(2),
        color: "#103070",
        fontFamily : "Open Sans"
    },
    error : {
        color : "#cc0000"
    }
});
class All extends Component {
    constructor(props){
        super(props);
        this.state = {
            questions : [],
            currentOffset : 0,
            noMoreData : false
        }
    }
    componentDidMount = async () => {
        await this.fetchQuestions();
    }
    fetchQuestions = async () => {
        let responseAllQuestions = await getCall({api:`/q/s/a/${(this.state.currentOffset)}`});
        this.setState({
            currentOffset : this.state.currentOffset+1
        })
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
        const {classes} = this.props;
        return (
            <div className = {classes.root}>
            <Paper className={classes.paper} elevation={4}>
                {this.state.questions.length===0 &&
                    <Typography className={classes.title}>
                        {"NO RESULTS FOUND"}
                    </Typography>
                }
                {this.state.questions.length !==0 &&
                    <Typography className={classes.title}>
                        {"ALL QUESTIONS"}
                    </Typography>
                }
            <div className={classes.questionsList}>
                {this.state.questions.map((question,index)=>{
                    return (
                        <div>
                        <Grid container
                            key = {question.questionid}
                            className={classes.grid}
                            direction="row"
                            justify="space-between"
                            spacing={1}>
                            <Grid key={`${question.questionid}_questionid`} item xs={12}>
                            <Link style={{textDecoration:"none"}} to={`/q/${question.questionid}`}>
                                <Typography noWrap className={classes.question}>
                                    {/* <Box className={classes.key} component="span" my={2} whiteSpace="normal">         */}
                                    {index+1}{". "}{question.question}
                                    {/* </Box> */}
                                </Typography>
                            </Link>
                            </Grid>
                            <Grid key={`${question.questionid}_username`} item xs={3}>
                            <Link style={{textDecoration:"none"}} to={`/s/u/${question.userid}`}>
                                <Typography className={classes.user}>
                                    {question.username}
                                </Typography>
                            </Link>
                            </Grid>
                            {/* <Grid key={`${question.questionid}_votes`} item xs={3}>
                                <Typography className={classes.votes}>
                                {"votes: "}{question.votes}
                                </Typography>
                            </Grid> */}
                            <Grid key={`${question.questionid}_answers`} item xs={3}>
                                <Typography className={classes.votes}>
                                {"answers: "}{question.answers}
                                </Typography>
                            </Grid>
                        </Grid>
                        {index!==this.state.questions.length-1 && 
                                <Divider key={`${question.questionid}_divider`} />
                            }
                        </div>
                    )
                })}
                {!this.state.noMoreData &&
                <Button style= {{textAlign : "center"}} onClick={()=>{this.fetchQuestions();}} variant="contained" color="default">{"Load More"}</Button>
                }
            </div>
            </Paper>
        </div>
        )
    }
}


All.propTypes = {
    classes : PropTypes.object.isRequired
}
export default withStyles(styles)(All);
