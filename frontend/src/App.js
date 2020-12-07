import {
  Redirect,
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';

import Container from 'react-bootstrap/Container';

import LoginContainer from './auth/components/LoginContainer';
import LoginRequired from './auth/components/LoginRequired';
import RegisterContainer from './auth/components/RegisterContainer';

import Profile from './dashboard/components/Profile';
import Dashboard from './dashboard/components/Dashboard';

export default function App() {
  return (
      <Container>
        <Router>
          <Switch>
            <Route exact path="/login" component={LoginContainer}/>
            <Route exact path="/register" component={RegisterContainer}/>
            <LoginRequired>
              <Switch>
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/jobs" component={Dashboard} />
                <Redirect exact from="/" to="/profile" />
              </Switch>
            </LoginRequired>
          </Switch>
        </Router>
      </Container>
  );
}
