import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "./context/auth";

function PrivateRoute({ component: Component, loading, ...rest }) {
  const { authTokens } = useAuth();

  return (
    <Route
      {...rest}
      render={props =>
        authTokens && !loading ? (
          <Component {...props} />
        ) : (
            <Redirect to="/" />
          )
      }
    />
  );
}

export default PrivateRoute;