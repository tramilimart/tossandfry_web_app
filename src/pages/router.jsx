import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './home';
import SignInPage from './signIn';
import { auth } from '../component/firebase';

const AppRouter = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <HomePage /> : <Redirect to="/signIn" />}
        </Route>
        <Route path="/signIn">
          {user ? <Redirect to="/" /> : <SignInPage />}
        </Route>
      </Switch>
    </Router>
  );
};

export default AppRouter;
