import React, { Component } from 'react';
import PropTypes from "prop-types";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    InputBase,
    ButtonGroup
} from "@material-ui/core";
import {
    withStyles,
    fade
} from "@material-ui/core/styles";
import SearchIcon from '@material-ui/icons/Search';
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
        color : "#FDFDFD",
        fontWeight : 500,
        fontFamily : 'Open Sans',
        flexGrow : 1
    },
    link : {        
        color : "#FDFDFD",
        fontWeight : 500,
        marginLeft : "10px",
        fontFamily : 'Open Sans',
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: '20ch',
        },
    },
});

class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn : props.isLoggedIn,
            username : props.username,
            userid : props.userid,
            searchText : ""
        }
    }
    onSearchTextChange(e){
        this.setState({
            searchText : e.target.value.trim()
        })
    }
    searchQuery(){
        if(this.state.searchText.length === 0) {
            return;
        }
        window.location.href = `/s/q/${this.state.searchText}`;
    }
    componentWillReceiveProps(props){
        this.setState({
            isLoggedIn : props.isLoggedIn,
            username : props.username,
            userid : props.userid
        });
    }
    render() {
        const {classes} = this.props;
        const isLoggedIn = this.state.isLoggedIn;
        let button;
        if (!isLoggedIn){
            button = (<Button className={classes.menuButton} onClick={()=>{this.props.handleLogin()}} color="primary">{"Login"}</Button>);  
        } else {
        button = (
            <ButtonGroup color="primary">
                <Button color="inherit" onClick = {()=>{window.location.href=`/profile`}}>{"Profile"}</Button>
                <Button className={classes.menuButton} onClick={()=>{this.props.handleLogout()}} color="inherit">{this.state.username}{this.state.userid}</Button>
            </ButtonGroup>
        );
        }
        return (
            <div className={classes.root}>
                <AppBar style={{position:"fixed",top: "0"}} className={classes.appbar} >
                    <Toolbar>
                        {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                        </IconButton> */}
                            <Typography variant="h6" className={classes.title}>
                                <a className={classes.title} style={{textDecoration:"none"}} href={"/"}>
                                    {"askAnything"}
                                </a>
                            </Typography>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                onChange = {(e)=>{this.onSearchTextChange(e)}}
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                            />
                            <Button onClick={()=>{this.searchQuery()}}>
                                Search
                            </Button>
                        </div>
                        <Button className={classes.menuButton} onClick={()=>{this.props.handleNewQuestion()}} variant="contained" color="secondary">{"Ask Question"}</Button>
                        {button}
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

Header.propTypes = {
    classes : PropTypes.object.isRequired
}
export default withStyles(styles)(Header);
