import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class AudioErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo, stack: error.stack })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Dialog
          open={this.state.hasError}
          onClose={() => {this.setState({ hasError: false })}}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            An audio error occurred in {this.props.name}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.error.toString()}
              {this.state.errorInfo.toString()}
              {this.state.stack.toString()}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {this.setState({ hasError: false })}} color="primary" autoFocus>
            Agree
            </Button>
          </DialogActions>
        </Dialog>
      )
    }
    return this.props.children;
  }
}

export const withAudioErrorBoundary = (
  Component,
  displayName,
  FallbackComponent,
  onError,
) => {
  const Wrapped = props => (
    <AudioErrorBoundary name={displayName} FallbackComponent={FallbackComponent} onError={onError}>
      <Component {...props} />
    </AudioErrorBoundary>
  );

  // Format for display in DevTools
  const name = Component.displayName || Component.name;
  Wrapped.displayName = name
    ? `WithErrorBoundary(${name})`
    : 'WithErrorBoundary';

  return Wrapped;
};