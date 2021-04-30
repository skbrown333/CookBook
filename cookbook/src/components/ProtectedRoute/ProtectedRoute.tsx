import React, { useContext, FunctionComponent } from "react";
import { Route, Redirect } from "react-router-dom";

/* Store */
import { Context } from "../../store/Store";

/**
 * Route wrapper to protect authenticated routes
 *
 * @example
 * <ProtectedRoute path="/" component={Component} />
 */
export const ProtectedRoute: FunctionComponent<any> = ({
  component: Component,
  ...rest
}) => {
  const [context] = useContext(Context);
  const user = context.user;

  function renderRoute(props) {
    const component = <Component {...rest} {...props} />;
    const error = (
      <Redirect
        to={{
          pathname: "/login",
          state: {
            from: props.location,
          },
        }}
      />
    );
    return user ? component : error;
  }

  return <Route {...rest} render={renderRoute} />;
};
