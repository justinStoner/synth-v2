import React from 'react';
import { Rnd } from 'react-rnd';
import { withStyles } from '@material-ui/core';
import { withAudioContext } from '../../context/AudioContext';
import './clipStyles.css';

const styles = theme => ({
  clip: {
    backgroundColor: theme.palette.primary[500],
    height: '100%',
    color: theme.palette.primary.contrastText,
    borderRadius: theme.shape.borderRadius,
  },
})

class Clip extends React.PureComponent {

  state = {
    grid: [13.75, 1]  }

  componentDidMount() {
    const { width } = document.querySelector("div[data-column-index='1'] div[data-step-index='1'][data-step-row-index='1']").getBoundingClientRect()
    this.setState({ grid: [width, 1] })
  }

  handleStart = (e, data) => {
  }

  handleDrag = (e, data) => {
    // const movingBack = data.deltaX < 0
    // this.props.audioContext.setSample(this.props.item.id,
    //   this.props.item.withMutations(item => item.set('')))
  }

  onDragStop = (e, data) => {
    const { x, item, audioContext, SPB } = this.props;
    const { grid } = this.state;
    if (data.deltaX !== 0) {
      const xDelta = data.x - x;
      const normalizedDelta = Math.abs(xDelta);
      const stepDelta = Math.floor((Math.max(normalizedDelta, grid[0]) + (normalizedDelta % grid[0])) / grid[0]) * (xDelta < 0 ? -1 : 1)
      const startIndex = (item.stepStart + (item.start * SPB) + stepDelta)
      const endIndex = (item.stepEnd + (item.end * SPB) + stepDelta)
      const start = Math.floor(startIndex / SPB)
      const end = Math.floor(endIndex / SPB);
      const stepStart = Math.floor(startIndex % SPB);
      const stepEnd = Math.floor(endIndex % SPB);
      const stateToMerge = {
        start,
        end,
        stepStart,
        stepEnd,
        time: `${start -1}:${stepStart -1}`,
        endTime: `${end -1}:${stepEnd}`,
      }
      audioContext.setSample(item.index, stateToMerge)
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
      const stateToMerge = {
        [dir === 'left' ? 'start' : 'end']: newStart,
        [dir === 'left' ? 'stepStart' : 'stepEnd']: newStep,
        [dir === 'left' ? 'time': 'endTime']: `${newStart -1}:${dir === 'left' ? newStep -1 : newStep}`,
      }
      this.props.audioContext.setSample(this.props.item.index, stateToMerge)
    }
  }
  render() {
    const { classes, item, audioContext, width, height, x, style, rowIndex, SPB, stepWidth, onClick } = this.props;
    return (
      <Rnd
        position={{ x, y: 0 }}
        bounds={`div[data-row-index='${rowIndex}'`}
        size={{ width, height }}
        dragAxis="x"
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

        <div className={classes.clip} onClick={e => {onClick(e, item, rowIndex)}}>
          <svg height={`${height - 16}px`} width={`${width}px`} xmlns="http://www.w3.org/2000/svg">
            {item.notes.map(note => {
              const start = (note.start -1) + ((note.stepStart -1) / SPB);
              const end = (note.end -1) + ((note.stepEnd -1) / SPB);
              const rowSpan = end - start;
              const w = (rowSpan <= 0 ? 0.25 : rowSpan) * stepWidth * 4;
              const x = (start * (stepWidth * 4))
              const maxValue = Math.max(...item.notes.map(i => i.id))
              const minValue = Math.min(...item.notes.map(i => i.id))
              const sizeRange = maxValue - minValue;
              return (
                <rect key={`${note.key}${note.time}${note.endTime}`} x={`${x}`} width={`${w}px`} height={`${(height -16) / sizeRange}`} y={Math.scale(note.id,minValue, maxValue, height -20, 1) + 'px'} rx="1" fill="#fff" />
              )
            })}
          </svg>
        </div>
      </Rnd>
    )
  }
}

export default withStyles(styles)(withAudioContext(Clip));