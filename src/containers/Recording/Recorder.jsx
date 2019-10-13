import { Component } from 'react';
import PropTypes from 'prop-types';
import Tone from 'tone';

const workerOptions = {
  encoderWorkerFactory () {
    return new Worker(process.env.PUBLIC_URL + '/opus-media-recorder/encoderWorker.umd.js')
  },
  OggOpusEncoderWasmPath: process.env.PUBLIC_URL + '/opus-media-recorder/OggOpusEncoder.wasm',
  WebMOpusEncoderWasmPath: process.env.PUBLIC_URL + '/opus-media-recorder/WebMOpusEncoder.wasm',
};

class Recorder extends Component {
  static propTypes = {
    mimeType: PropTypes.string,
    onDataAvailable: PropTypes.func.isRequired,
    render: PropTypes.func.isRequired,
  }

  static defaultProps = {
    mimeType: '',
  }

  constructor(props) {
    super(props);
    this.state = { state: 'notInitialized' };
    this.destination = Tone.context.createMediaStreamDestination();
    this.recorder = new MediaRecorder(this.destination.stream);
  }

  start = () => {
    console.log('start recording called');
    console.log(this.recorder, this.props.stream)
    this.setState({ state: 'recording' });
    this.props.stream.connect(this.destination);
    this.recorder.start(this.props.stream);

    this.recorder.ondataavailable = e => {
      console.log('Recording stopped, data available');
      console.log(e)
      this.onDataAvailable(e);
    };
    this.recorder.onstart = e => {
      console.log('start');
      this.setState({ state: 'recording' });
    };
    this.recorder.onstop = e => {
      console.log('stop');
      this.setState({ state: 'inactive' });
      this.props.onStop(e);
    };
    this.recorder.onpause = e => {
      console.log('pause');
      this.setState({ state: 'paused' });
    }
    this.recorder.onresume =e => {
      console.log('resume');
      this.setState({ state: 'recording' });
    }
  }

  stop = () => {
    console.log('stop recording called');
    this.recorder.stop();
  }

  pause = () => {
    console.log('pause recording called');
    this.recorder.pause();
  }

  onDataAvailable = e => {
    this.props.onDataAvailable(e);
  }

  render = () =>
    this.props.render({
      state: this.state.state,
      start: this.start,
      stop: this.stop,
      pause: this.pause,
      resume: this.resume,
    });
}

export default Recorder;