import React , { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from "./components/Header.js"
import { withCookies} from "react-cookie";
import Question from "./components/Question.js";
import {postCall} from "./components/Apicalls.js";
import Login from "./components/Login.js";
import Error from "./components/Error.js";
import AskQuestion from './components/AskQuestion.js';
import AddAnswer from './components/AddAnswer.js';
import Search from './components/Search.js';
import Profile from "./components/Profile.js";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      token : props.cookies.get('jwt') || null,
      isLoggedIn : false,
      username : "FAKE ACCOUNT",
      showLoginModal : false,
      showAskQuestionModal : false,
      showAnswerModal : false
    }
    this.verifyToken = this.verifyToken.bind(this);
  }
  componentDidMount(){
    if(this.state.token && !this.state.isLoggedIn){
      this.verifyToken();
    }    
  }
  verifyToken = async () => {
    let responseTokenVerify = await postCall({body:{token : this.state.token},api:"/u/usertoken"});
    if(responseTokenVerify && responseTokenVerify.tokenValid){
      this.setState({
        isLoggedIn : responseTokenVerify.tokenValid,
        username : responseTokenVerify.username
      });
    }
  }
  hideModal = () =>{
    this.setState({
      showLoginModal : false,
      showAskQuestionModal : false,
      showAnswerModal : false
    })
  }
  showLoginModal = () => {
    this.setState({
      showLoginModal : true
    })
  }
  showAskQuestionModal = () => {
    this.setState({
      showAskQuestionModal : true
    })
  }
  showAnswerModal = () => {
    this.setState({
      showAnswerModal : true
    })
  }
  handleLogout = ()=>{
    this.setState({
      isLoggedIn : false,
      username : "FAKE ACCOUNT",
      token : null
    });
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
  }
  handleLoginData = async (data) =>{
    this.setState({
      isLoggedIn : true,
      username : data.username,
      token : data.token,
      showLoginModal : false
    });
    this.props.cookies.set('jwt',data.token,{ path: '/' });
  }
  handleAddAnswer = async ()=>{
    if(this.state.isLoggedIn){
      this.showAnswerModal();
    }else{
      this.showLoginModal();
    }
  }
  handleNewQuestion = async () =>{
    if(this.state.isLoggedIn){
      this.showAskQuestionModal();
    }else{
      this.showLoginModal();
    }
  }
  render(){
      return (
        <div>
            <Router>
            <Header hideModal = {()=>{this.hideModal()}} handleLogout={()=>{this.handleLogout()}} handleLogin={()=>{this.showLoginModal()}} userid = {this.state.userid} handleNewQuestion = {()=>{this.handleNewQuestion()}} username = {this.state.username} isLoggedIn = {this.state.isLoggedIn}/>
            <div style={{marginTop:"70px"}} >
                  <Switch>
                      {/* <Route exact path="/" render={(props)=>{
                          return(  
                            <All {...props}/>
                          )
                      }} /> */}
                      <Route exact path="/" render={(props)=>{
                          return(
                            <Search querytype={"a"}  {...props}/>
                          )
                      }} />
                      <Route exact path="/s/q/:query" render={(props)=>{
                          return(
                            <Search querytype={"q"}  {...props}/>
                          )
                      }} />
                      <Route exact path="/s/u/:query" render={(props)=>{
                          return(
                            <Search querytype={"u"}  {...props}/>
                          )
                      }} />

                      <Route exact path="/error" render={(props)=>{
                          return(  
                            <Error {...props}/>
                          )
                      }} />
                      <Route exact path="/profile" render={(props)=>{
                          return(
                            <Profile token={this.state.token} {...props}/>
                          )
                      }} />
                      <Route path="/q/:quesid"  render = {(props)=>{
                        return (
                          <div>
                            <Question answerQuestion = {(e)=>{this.handleAddAnswer(e)}} token={this.state.token} {...props} userid = {this.state.userid} username = {this.state.username} isLoggedIn = {this.state.isLoggedIn} />
                            <AddAnswer {...props} hideModal = {()=>{this.hideModal()}} token={this.state.token} showModal={this.state.showAnswerModal}/>
                          </div>
                        )
                      }}
                      />
                  </Switch> 
                  <Login hideModal = {()=>{this.hideModal()}} handleLoginData = {(e)=>{this.handleLoginData(e)}}  showModal={this.state.showLoginModal}/>
                  <AskQuestion hideModal = {()=>{this.hideModal()}} token = {this.state.token} showModal={this.state.showAskQuestionModal}/>
            </div>
          </Router>
        </div>
      )
  }
}
var AppWithCookies = withCookies(App);
ReactDOM.render(
  <React.StrictMode>
    <AppWithCookies />
  </React.StrictMode>,
  document.getElementById('root')
);