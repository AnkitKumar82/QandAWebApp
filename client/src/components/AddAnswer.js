import React, { Component } from 'react'
import {
    Button,
    Modal,
    Typography,
    TextField,
    Grid
} from "@material-ui/core";
import PropTypes from "prop-types";
import {
    withStyles
} from "@material-ui/core/styles";
import {postCall} from "./Apicalls.js"; 
const styles = (theme)=>({
    modal: {
        display: 'flex',
        marginBottom : "200px",
        justifyContent: 'center'
      },
    root :{
        padding : theme.spacing(4),
        backgroundColor : "#FDFDFD"
    },
    grid :{
        padding : theme.spacing(1)
    },
    title : {
        fontWeight : 600,
        fontFamily : "Open Sans"
    },
    textfield :{
        width : "100%"
    }
});

class AddAnswer extends Component {
    constructor(props){
        super(props);
        this.state = {
            answer : "",
            questionid : props.match.params.quesid,
            token : props.token,
            error : false,
            errorMessage : ""
        }
    }
    componentWillReceiveProps(props){
        this.setState({
            token : props.token,
            questionid : props.match.params.quesid
        });
    }
    handleCloseModal = async () => {
        this.setState({
            error : false,
            questionid : null,
            answer : ""
        });
        this.props.hideModal();
    }
    handleAddAnswer = async ()=>{
        if(this.state.answer.length === 0){
            this.setState({
                error : true,
                errorMessage : "Answer length should be greater than 0!"
            });
            return;
        }
        let response = await postCall({body:{token : this.state.token,questionid : this.state.questionid,answer : this.state.answer},api:"/u/r/addanswer"});
        if(response){
            if(!response.isDone){
                this.setState({
                    error : true,
                    errorMessage : response.errorMessage
                })
            }else{
                this.setState({
                    error : false
                });
                this.handleCloseModal();
            }
        }else{
            this.setState({
                error : true,
                errorMessage : "Unexpected Error Occurred!"
            });
        }
    }
    render(){
        const {classes} = this.props;
        return (
            <div>
                <Modal
                open={this.props.showModal}
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                closeAfterTransition
                >
                <div className = {classes.root} style={{borderRadius: "10px",margin:'auto',width:'60%', backgroundColor:"white"}}>
                <Typography className={classes.title}>
                    AddAnswer
                </Typography>
                <Grid container
                    className={classes.grid}
                    direction="row"
                    justify="space-between"
                    spacing={1}>
                    <Grid item xs={12}>
                        <TextField multiline rows={4} className={classes.textfield} size="small" label="Answer" onChange = {(e)=>{this.setState({answer : e.target.value})}} variant="outlined"/>
                    </Grid>
                    {this.state.error && 
                    <Grid item xs={12} style={{fontSize:"70%",fontFamily: "Open Sans",color : "red"}}>{this.state.errorMessage}</Grid>}
                    <Grid item xs={8}>
                        <Button variant="contained" color="primary" onClick={(e)=>this.handleAddAnswer(e)}>
                            Add Answer
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button style={{leftMargin:"100px"}} onClick={()=>{this.handleCloseModal()}} variant="contained" color="secondary">
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
                </div>
                </Modal>
            </div>
        )
    }
}
AddAnswer.propTypes = {
    classes : PropTypes.object.isRequired
}
export default withStyles(styles)(AddAnswer);
