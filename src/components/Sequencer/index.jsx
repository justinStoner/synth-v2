import React from 'react';
import Tone from 'tone'
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import VolumeUp from '@material-ui/icons/VolumeUp';
import * as acetone from '../../assets/audio/acetone-rhythm';
import * as casio from '../../assets/audio/casio-sk1';
import * as roland from '../../assets/audio/roland-tr-33';

class Sequencer extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
    this.drums = { ...acetone, ...casio, ...roland };
    this.player = new Tone.Players(this.drums, () => this.setState({ loaded: true })).toMaster();
  }

  render() {
    const sequencerComponents = this.state.loaded && Object.keys(this.drums).map(drum => (
      <Grid key={drum} item xs={12}>
        <Card>
          <CardContent>
            <Button onClick={() => this.player.get(drum).start()} size="small">
              {drum} <VolumeUp fontSize="small"/> <span>more coming soon</span>
            </Button >
          </CardContent>
        </Card>
      </Grid>
    ))
    return this.props.render({ sequencerComponents })
  }
}

export default Sequencer