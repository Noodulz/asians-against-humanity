import React from 'react';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';

import Landing from './Landing/Landing';
import UserAuthContainer from './UserAuthContainer';
import Navbar from './Navbar';
import Dashboard from './Dashboard/Dashboard';
import Lobby from './Lobby/Lobby';
import GameRoom from './GameRoom/GameRoom';
import DeckBuilder from './DeckBuilder/DeckBuilder';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      isLoggedIn: false
    };

    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  signup() {
    axios.post('/api/users/signup', {
      username: document.getElementById('username-signup').value,
      password: document.getElementById('password-signup').value
    })
      .then((res) => {
        console.log('signup success', res);
        this.setState({
          username: document.getElementById('username-signup').value,
          isLoggedIn: true
        });
        // redirect to dashboard...
        this.props.history.push('/dashboard');
      })
      .catch((res) => {
        console.log('signup error', res);
      });
  }

  login() {
    axios.post('/api/users/login', {
      username: document.getElementById('username-login').value,
      password: document.getElementById('password-login').value
    })
      .then((res) => {
        console.log('login success', res);
        this.setState({
          username: document.getElementById('username-login').value,
          isLoggedIn: true
        });
        this.props.history.push('/dashboard');
      })
      .catch((res) => {
        console.log('login error', res);
      });
  }

  logout() {
    axios.post('/api/users/logout')
      .then((res) => {
        console.log('logged out', res);
        this.setState({
          username: '',
          isLoggedIn: false
        });
        this.props.history.push('/');
      })
      .catch((err) => {
        console.log('logout error', err);
      });
  }

  render() {
    return (
      <div className='App'>
        <Switch>
          <Route exact path='/' render={(props) => (
            <Landing signup={this.signup} login={this.login} />
          )} />
          <Route render={(props) => (
            <UserAuthContainer {...props} isLoggedIn={this.state.isLoggedIn}>
              <Navbar username={this.state.username} logout={this.logout} />
              <Route path='/dashboard' component={Dashboard} />
              <Route path='/lobby' render={(props) => (
                <Lobby {...props} username={this.state.username} />
              )} />
              <Route path='/game/:room' render={(props) => (
                <GameRoom {...props} username={this.state.username} />
              )} />
              <Route path='/deckbuilder' component={DeckBuilder} />
            </UserAuthContainer>
          )} />
        </Switch>
      </div>
    );
  }
}

export default App;