import React from 'react';
import Tone from 'tone';
import { Rnd } from 'react-rnd';
import { withStyles } from '@material-ui/core';
import { withAudioContext } from '../../context/AudioContext';
import '../../containers/Recording/clipStyles.css';

const styles = theme => ({
  note: {
    backgroundColor: theme.palette.primary[300],
    height: '100%',
    color: theme.palette.primary.contrastText,
  },
})

class Note extends React.PureComponent {

  state = {
    grid: [this.props.gridWidth, this.props.height],
  }

  componentDidMount() {

  }

  handleStart = (e, data) => {
    console.log('Event: ', e);
    console.log('Data: ', data);
  }

  handleDrag = (e, data) => {
    // const movingBack = data.deltaX < 0
    // this.props.audioContext.setSample(this.props.item.id,
    //   this.props.item.withMutations(item => item.set('')))
  }

  onDragStop = (e, data) => {
    const { x, item, audioContext, SPB, height, rowIndex, groups } = this.props;
    const { grid } = this.state;
    const xDelta = data.x - x;
    const isXDrag = Math.abs(data.lastY) < Math.abs(xDelta);
    console.log(e, data.lastY, data.x -x);
    if (data.deltaX !== 0 && isXDrag) {
      const normalizedDelta = Math.abs(xDelta);
      const stepDelta = Math.floor((Math.max(normalizedDelta, grid[0]) + (normalizedDelta % grid[0])) / grid[0]) * (xDelta < 0 ? -1 : 1)
      const startIndex = (item.stepStart + (item.start * SPB) + stepDelta)
      const endIndex = (item.stepEnd + (item.end * SPB) + stepDelta)
      const start = Math.floor(startIndex / SPB)
      const end = Math.floor(endIndex / SPB);
      const stepStart = Math.floor(startIndex % SPB);
      const stepEnd = Math.floor(endIndex % SPB);
      const time = `${start -1}:${stepStart}`;
      const endTime = `${end -1}:${stepEnd}`;
      const stateToMerge = {
        start,
        end,
        stepStart,
        stepEnd,
        time,
        endTime,
        duration: Tone.Ticks(Tone.Time(endTime).toTicks() - Tone.Time(time).toTicks()).toNotation(),
      }
      console.log(stateToMerge)
      this.props.audioContext.setSample(item.sampleId, { notes: this.props.audioContext.samples.getIn([item.sampleId, 'notes']).mergeIn([item.index],stateToMerge) })
    } else if (!isXDrag && Math.abs(data.lastY) >= height) {
      const normalizedDelta = Math.abs(data.lastY);
      const stepDelta = Math.floor((normalizedDelta + (normalizedDelta % height)) / height) * (data.lastY < 0 ? -1 : 1)
      const newGroup = groups[stepDelta + rowIndex];
      const stateToMerge = {
        id: newGroup.id,
        row: newGroup.id,
        title: newGroup.title,
      }
      this.props.audioContext.setSample(item.sampleId, { notes: this.props.audioContext.samples.getIn([item.sampleId, 'notes']).mergeIn([item.index],stateToMerge) })
    }
  }

  onResizeStop = (e, dir, el, delta, position) => {
    const { item, SPB } = this.props;
    if (delta.width !== 0) {
      const normalizedDelta = dir === 'left' ? Math.min(delta.width) * -1 : Math.min(delta.width)
      const stepDelta = Math.floor((Math.round((Math.max(normalizedDelta / this.props.columnWidth) * 100)) / 100) * 4);
      const step = dir === 'left' ? item.stepStart : item.stepEnd;
      const measure = dir === 'left' ? item.start : item.end;
      const newTotalIndex = (step + (measure * SPB) + stepDelta)
      const newStart = Math.floor(newTotalIndex / SPB);
      const newStep = Math.floor(newTotalIndex % SPB);
      const newTime = `${newStart -1}:${newStep}`;
      const stateToMerge = {
        [dir === 'left' ? 'start' : 'end']: newStart,
        [dir === 'left' ? 'stepStart' : 'stepEnd']: newStep,
        [dir === 'left' ? 'time': 'endTime']: newTime,
        duration: Tone.Ticks(Tone.Time(dir === 'left' ? item.endTime : newTime).toTicks() - Tone.Time(dir === 'left' ? newTime : item.time).toTicks()).toNotation(),
      }
      console.log(stateToMerge)
      this.props.audioContext.setSample(item.sampleId, { notes: this.props.audioContext.samples.getIn([item.sampleId, 'notes']).mergeIn([item.index],stateToMerge) })
    }
  }
  render() {
    const { classes, item, audioContext, width, height, x, style, rowIndex } = this.props;
    return (
      <Rnd
        position={{ x, y: 0 }}
        size={{ width, height }}
        maxHeight={height}
        minHeight={height}
        resizeGrid={this.state.grid}
        dragGrid={this.state.grid}
        scale={1}
        onDragStop={this.onDragStop}
        onResizeStop={this.onResizeStop}
        style={style}
        enableResizing={{ top: false, right: true, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
      >

        <div className={classes.note} style={{ height }} />
      </Rnd>
    )
  }
}

export default withStyles(styles)(withAudioContext(Note));