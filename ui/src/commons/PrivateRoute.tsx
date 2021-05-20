import { Redirect, Route } from 'react-router-dom';
import React from 'react';

export function PrivateRoute({
  component: Component, allowed, redirectTo, ...rest
}: {
  component: any;
  allowed: any;
  redirectTo: string;
  [prop: string]: any;
}) {
  return (
    <Route
      {...rest}
      render={(props: any) => (
        allowed ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: redirectTo,
            state: {
              from: props.location,
            },
          }}
          />
        )
      )}
    />
  );
}
