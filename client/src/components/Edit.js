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

class Edit extends Component {
    constructor(props){
        super(props);
        this.state = {
            defaultValue : props.defaultValue,
            editType : props.editType,
            editTypeLabel : props.editTypeLabel,
            editId : props.editId,
            token : props.token,
            error : false,
            errorMessage : ""
        }
    }
    componentWillReceiveProps(props){
        this.setState({
            token : props.token,
            defaultValue : props.defaultValue,
            editType : props.editType,
            editTypeLabel : props.editTypeLabel,
            editId : props.editId,
        });
    }
    handleEditConfirm = async ()=>{
        if(this.state.defaultValue.length === 0){
            this.setState({
                error : true,
                errorMessage : `${this.state.editTypeLabel} length should be greater than 0!`
            });
            return;
        }
        let response = await postCall({body:{token : this.state.token, editid : this.state.editId,value : this.state.defaultValue},api:`/u/r/e/${this.state.editType}`});
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
                this.props.hideModal();
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
                    {"Edit "}{this.state.editTypeLabel}
                </Typography>
                <Grid container
                    className={classes.grid}
                    direction="row"
                    justify="space-between"
                    spacing={1}>
                    <Grid item xs={12}>
                        <TextField defaultValue={this.state.defaultValue} multiline rows={4} className={classes.textfield} size="small" label={this.state.editTypeLabel} onChange = {(e)=>{this.setState({defaultValue : e.target.value})}} variant="outlined"/>
                    </Grid>
                    {this.state.error && 
                    <Grid item xs={12} style={{fontSize:"70%",fontFamily: "Open Sans",color : "red"}}>{this.state.errorMessage}</Grid>}
                    <Grid item xs={8}>
                        <Button variant="contained" color="primary" onClick={(e)=>this.handleEditConfirm(e)}>
                            Edit Confirm
                        </Button>
                    </Grid>
                    <Grid item xs={4}>
                        <Button style={{leftMargin:"100px"}} onClick={()=>{this.props.hideModal()}} variant="contained" color="secondary">
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
Edit.propTypes = {
    classes : PropTypes.object.isRequired
}
export default withStyles(styles)(Edit);
