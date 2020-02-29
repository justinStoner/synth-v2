import React from 'react';
import { Rnd } from 'react-rnd';
import { withStyles } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import './clipStyles.css';
import { addClip, updateClip, deleteClip } from '../../store/clips/actions';
import { connect } from 'react-redux';
import { selectBPM, selectBPMe, selectSPB } from '../../store/appReducer';
import { withRecordingContext } from '../../context/RecordingContext';
import clsx from 'clsx';
import { withTheme, mergeClasses } from '@material-ui/styles';

const styles = theme => ({
  clip: {
    backgroundColor: fade(theme.palette.primary[500], 0.25),
    border: `1px solid ${theme.palette.primary[500]}`,
    height: '100%',
    color: theme.palette.primary.contrastText,
    borderRadius: theme.shape.borderRadius / 2,
    boxSizing: 'border-box',
    overflow: 'hidden',
    '&$isSelected': {
      border: `1px solid ${theme.palette.secondary['A400']}`,
    },
  },
  isSelected: {
  },
  label: {
    top: -2,
    position: 'relative',
    fontSize: 10,
    width: '100%',
    backgroundColor: theme.palette.primary[500],
    display: 'inline-block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    minHeight: 14,
    padding: '0px 1px',
    '&$isSelected': {
      backgroundColor: theme.palette.secondary['A400'],
    },
  },
})

class Clip extends React.PureComponent {

  labelRef = React.createRef();

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
    const { x, item, SPB, updateClip } = this.props;
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
      updateClip([item.key], stateToMerge)
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
      this.props.updateClip([this.props.item.key], stateToMerge)
    }
  }

  onContextMenu = e => {
    e.preventDefault();
    const { item, deleteClip } = this.props
    deleteClip(item.key);
  }

  render() {
    const { classes, item, width, height, x, style, rowIndex, SPB, stepWidth, onClick, recordingContext, theme, groups } = this.props;
    const filteredNotes = item.notes.valueSeq().filter(note => note.start * SPB + note.stepStart <= item.end * SPB + item.stepEnd &&
      note.end * SPB + note.stepEnd >= item.start -1 * SPB + item.stepStart)
    const maxValue = Math.max(...filteredNotes.map(i => i.id))
    const minValue = Math.min(...filteredNotes.map(i => i.id))
    const isSelected = recordingContext.selectedSample === item.key;
    const labelOffset = (this.labelRef.current && this.labelRef.current.getBoundingClientRect().height) || 4;
    return (
      <Rnd
        position={{ x: x + 1, y: 0 }}
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
        onContextMenu={this.onContextMenu}
        enableResizing={{ top: false, right: true, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
      >
        <div className={clsx(classes.clip, isSelected && classes.isSelected)} onClick={e => {onClick(e, item, rowIndex)}}>
          <span ref={this.labelRef} className={clsx(classes.label, isSelected && classes.isSelected)}>{`${groups[item.row].title} ${item.row + 1}`}</span>
          <svg height={`${height - labelOffset}px`} width={`${width}px`} xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', top: -6 }}>
            {filteredNotes.map(note => {
              const start = (note.start -1) + ((note.stepStart -1) / SPB);
              const end = (note.end -1) + ((note.stepEnd -1) / SPB);
              const rowSpan = end - start;
              const w = (rowSpan <= 0 ? 0.25 : rowSpan) * stepWidth * 4;
              const x = (start * (stepWidth * 4))
              const sizeRange = maxValue - minValue;
              return (
                <rect
                  key={`${note.key}${note.time}${note.endTime}`}
                  x={`${x}`}
                  width={`${w}px`}
                  height={`${Math.min((height - labelOffset) / sizeRange, 4)}`}
                  y={Math.scale(note.id,minValue, maxValue, height - (labelOffset + 4), 1) + 'px'}
                  rx="1"
                  fill={theme.palette.secondary.A400}
                />
              )
            })}
          </svg>
        </div>
      </Rnd>
    )
  }
}

const mapStateToProps = state => ({
  BPM: selectBPM(state),
  BPMe: selectBPMe(state),
  SPB: selectSPB(state),
});

const mapDispatchToProps = dispatch => ({
  addClip: payload => dispatch(addClip(payload)),
  updateClip: (key, payload) => dispatch(updateClip(key, payload)),
  deleteClip: key => dispatch(deleteClip(key)),
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(withRecordingContext(withTheme(Clip))));