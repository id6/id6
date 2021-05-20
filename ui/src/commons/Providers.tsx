import React, { ComponentClass, FunctionComponent } from "react";

type Component =
  ComponentClass
  | FunctionComponent;
type ComponentWithProps = [Component, any?];

export function Providers({ providers, children }: {
  providers: (Component | ComponentWithProps)[],
  children: any,
}) {
  return providers
    .reverse()
    .reduce(
      (child, item) => {
        const [Provider, props] = Array.isArray(item) ? item : [item, {}];
        return (
          <Provider {...props}>
            {child}
          </Provider>
        );
      },
      children,
    );
}
