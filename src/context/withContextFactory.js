import React from 'react';

export default function withContextFactory(Context, contextPropName) {
  return function withContext(Component) {
    function WrappedComponent(props) {
      return (
        <Context.Consumer>
          {context => <Component {...Object.assign({}, props, { [contextPropName]: context })} />}
        </Context.Consumer>
      )
    }
    WrappedComponent.displayName = `WrappedComponent(${contextPropName})`;
    return WrappedComponent;
  }
}