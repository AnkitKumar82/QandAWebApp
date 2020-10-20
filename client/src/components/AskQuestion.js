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

class AskQuestion extends Component {
    constructor(props){
        super(props);
        this.state = {
            question : "",
            error : false,
            errorMessage : "",
            token : props.token
        }
    }
    componentWillReceiveProps(props){
        this.setState({
            token : props.token
        });
    }
    handleCloseModal = async () => {
        this.setState({
            error : false,
            question : ""
        });
        this.props.hideModal();
    }
    handleAskQuestion = async ()=>{
        if(this.state.question.length === 0){
            this.setState({
                error : true,
                errorMessage : "Question length should be greater than 0!"
            });
            return;
        }
        let response = await postCall({body:{token : this.state.token , question : this.state.question},api:"/u/r/AskQuestion"});
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
    render() {
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
                    AskQuestion
                </Typography>
                <Grid container
                    className={classes.grid}
                    direction="row"
                    justify="space-between"
                    spacing={1}>
                    <Grid item xs={12}>
                        <TextField multiline rows={4} className={classes.textfield} size="small" label="Question" onChange = {(e)=>{this.setState({question : e.target.value})}} variant="outlined"/>
                    </Grid>
                    {this.state.error && 
                    <Grid item xs={12} style={{fontSize:"70%",fontFamily: "Open Sans",color : "red"}}>{this.state.errorMessage}</Grid>}
                    <Grid item xs={8}>
                        <Button variant="contained" color="primary" onClick={(e)=>this.handleAskQuestion(e)}>
                            AskQuestion
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
AskQuestion.propTypes = {
    classes : PropTypes.object.isRequired
}
export default withStyles(styles)(AskQuestion);
