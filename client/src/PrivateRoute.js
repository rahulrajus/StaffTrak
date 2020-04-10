import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./context/auth";

function PrivateRoute({ component: Component, ...rest }) {
  const { authTokens } = useAuth();
  console.log('new one', authTokens);
  return (
    <Route
      {...rest}
      render={props =>
        authTokens && Object.keys(authTokens).length !== 0 ? (
          <Component {...props} />
        ) : (
            <Redirect to="/" />
          )
      }
    />
  );
}

export default PrivateRoute;