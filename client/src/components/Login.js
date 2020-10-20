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

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            loginModalOpen : props.showModal,
            username : "",
            password : "",
            error : false,
            errorMessage : ""
        }
    }
    componentWillReceiveProps(props){
        this.setState({
            loginModalOpen : props.showModal
        });
    }
    handleCloseModal = async () => {
        this.setState({
            loginModalOpen : false,
            error : false
        });
        this.props.hideModal();
    }
    handleLogin = async ()=>{
        if(this.state.username.length === 0){
            this.setState({
                error : true,
                errorMessage : "Username length should be greater than 0!"
            });
            return;
        }
        //we will call to backend and get new token after verifying username and password
        let response = await postCall({body:{username: this.state.username , password : this.state.password},api:"/u/login"});
        if(response){
            if(!response.isLoggedIn){
                this.setState({
                    error : true,
                    errorMessage : response.errorMessage
                })
            }else{
                this.setState({
                    error : false
                });
                this.props.handleLoginData(response);
                this.handleCloseModal();
            }
        }else{
            this.setState({
                error : true,
                errorMessage : "Unexpected Error Occurred!"
            });
        }
    }
    handleNewUser = async ()=>{
        if(this.state.username.length === 0){
            this.setState({
                error : true,
                errorMessage : "Username length should be greater than 0!"
            });
            return;
        }
        let response = await postCall({body:{username: this.state.username , password : this.state.password},api:"/u/register"});
        if(response){
            if(!response.isLoggedIn){
                this.setState({
                    error : true,
                    errorMessage : response.errorMessage
                });
                console.log("Response error", response.errorMessage);
            }else{
                this.setState({
                    error : false
                });
                this.props.handleLoginData(response);
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
                    Login
                </Typography>
                <Grid container
                    className={classes.grid}
                    direction="row"
                    justify="space-between"
                    spacing={1}>
                    <Grid item xs={12}>
                        <TextField className={classes.textfield} size="small" label="Username" onChange = {(e)=>{this.setState({username : e.target.value})}} variant="outlined"/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField type="password" className={classes.textfield} size="small" label="Password" onChange = {(e)=>{this.setState({password : e.target.value})}} variant="outlined"/>
                    </Grid>
                    {this.state.error && 
                    <Grid item xs={12} style={{fontSize:"70%",fontFamily: "Open Sans",color : "red"}}>{this.state.errorMessage}</Grid>}
                    <Grid item xs={8}>
                        <Button variant="contained" color="primary" onClick={(e)=>this.handleLogin(e)}>
                            Login
                        </Button>
                        <Button style={{marginLeft:"2px"}} variant="contained" color="primary" onClick={(e)=>this.handleNewUser(e)}>
                            New User
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
Login.propTypes = {
    classes : PropTypes.object.isRequired
}
export default withStyles(styles)(Login);
