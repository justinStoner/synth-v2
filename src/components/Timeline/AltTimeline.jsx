import React from 'react';
import PropTypes from 'prop-types';
import scrollbarSize from 'dom-helpers/scrollbarSize';
import { Grid, AutoSizer, ScrollSync } from 'react-virtualized';
import { withStyles, withTheme } from '@material-ui/core';
const COL_WIDTH = 55;
const ROW_HEIGHT = 55;
const TIMELINE_HEIGHT = 20;
const COLS = 100;
const grid_width = COL_WIDTH * COLS;

const styles = theme => ({
  container: {
    marginTop: theme.spacing(1),
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  leftSideGridContainer: {
    flex: '0 0 75px',
    zIndex: 10,
    position: 'absolute',
    left: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  timeline: {
    zIndex: 11,
    position: 'absolute',
    left: 0,
    backgroundColor: '#fff',
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    width: '100%',
  },
  upperLeftComponent: {
    position: 'absolute',
    left: 0,
  },
  leftSideGrid: {
    overflow: 'hidden !important',
  },
  gridWrapper: {
    position: 'relative',
    overflow: 'scroll',
  },
  scroller: {
    overflow: 'hidden',
  },
  innerWrapper: {
    position: 'relative',
  },
  gridStyle: {
    overflow: 'hidden !important',
    position: 'absolute !important',
    top: TIMELINE_HEIGHT,
    left: 0,
  },
  col: {
    height: '100%',
    border: '1px solid rgb(246, 246, 246)',
  },
  measure: {
    height: '100%',
  },
  measureContainer: {
    overflow: 'hidden !important',
    width: '100%',
  },
  row: {
    height: '100%',
    padding: '0px',
    display: 'inline-block',
  },
  autosizeContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    height: '100%',
  },
})

const rowItemsRenderer = (items, isVisible, columnWidth, CellRenderer, onItemClick, classes, SPB, rowIndex, columnIndex, groups, rowHeight) => items.map((i, index) => {
  const start = (i.start -1) + ((i.stepStart -1) / SPB);
  const end = (i.end -1) + ((i.stepEnd -1) / SPB);
  const rowSpan = end - start;
  const width = (rowSpan <= 0 ? (i.stepEnd - i.start <= 0 ? 0.25 : i.stepEnd - i.stepStart ) : rowSpan) * columnWidth;
  const x = start * columnWidth
  return (
    <div
      key={`${i.key}${rowIndex}${columnIndex}${i.title}${i.time}${i.index}cell`}
      className={classes.row}
      data-item-index={i.key}
    >
      <CellRenderer
        gridWidth={columnWidth / SPB}
        groups={groups}
        start={start}
        rowIndex={rowIndex}
        end={end}
        x={x}
        SPB={SPB}
        columnWidth={columnWidth}
        stepWidth={columnWidth / SPB}
        key={i.key} item={i}
        width={width}
        height={rowHeight}
        onClick={onItemClick}
      />
    </div>
  )
})

const columnGridWith = (width, groupOffset, colWidth) => ({ index }) => {
  if (index === 0) return 0;
  return colWidth;
}

const getStepBorder = (theme, columnIndex, parentColumnIndex, BPMe, SPB) => {
  if (columnIndex === 0 && parentColumnIndex > 0 && parentColumnIndex % BPMe === 0) {
    return theme.palette.grey[400]
  }
  if (columnIndex % SPB === 0) {
    return theme.palette.grey[300];
  }
  return theme.palette.grey[200];
}

const StepsRender = ({ BPMe, SPB, parentColumnIndex, theme }) => ({ columnIndex, rowIndex, style, classes }) => (
  <div
    key={`${columnIndex}${parentColumnIndex}${rowIndex}step`}
    data-step-index={columnIndex+1}
    data-measure-index={parentColumnIndex + 1}
    data-step-row-index={rowIndex}
    data-total-index={(columnIndex + 1) + (parentColumnIndex * SPB)}
    onClick={() => console.log('step clicked')}
    style={{
      ...style,
      backgroundColor: theme.palette.grey[100],
      borderLeft: `1px solid ${getStepBorder(theme, columnIndex, parentColumnIndex, BPMe, SPB)}`,
    }}
  />
)

class Timeline extends React.PureComponent {

  static defaultProps = {
    rowHeight: ROW_HEIGHT,
    colWidth: COL_WIDTH,
    onRowClick: () => {},
  }

  static propTypes = {
    rowHeight: PropTypes.number,
    colWidth: PropTypes.number,
    onRowClick: PropTypes.func,
  }

  container = React.createRef();
  wrapper = React.createRef()
  itemRowMap = {};
  rowItemMap = {};
  position = { scrollLeft: 0, scrollTop: 0 }

  setRowItemMap = items => {
    this.itemToRowMap = {};
    this.rowToItemMap = {};
    items.forEach(item => {
      if (this.itemToRowMap[item.row] === undefined) this.itemToRowMap[item.row] = [];
      this.itemToRowMap[item.row].push(item)
    });
  }

  renderTimeline = ({ columnIndex, style }) => {
    const { classes, groupOffset, theme, BPMe, colWidth, upperLeftComponent } = this.props;
    return (
      <div
        key={`${columnIndex}measure`}
        className={classes.measure}
        style={{
          ...style,
          width: columnIndex === 0 ? 0 : colWidth,
          borderBottom: `1px solid ${this.props.theme.palette.grey[400]}`,
          color: columnIndex > 0 && columnIndex % BPMe === 1 ? theme.palette.primary[500] : theme.palette.text.primary,
        }}
      >
        {columnIndex > 0 && columnIndex}
      </div>
    )
  }

  renderCol = (rowCount, rowHeight, colWidth) => ({ columnIndex, style, parent }) => {
    const { classes, groupOffset, theme, BPMe, SPB, groups } = this.props;
    return (
      <div
        key={columnIndex}
        className={classes.col}
        data-column-index={columnIndex}
        style={{
          ...style,
          width: columnIndex > 0 ? colWidth : 0,
        }}
      >
        {columnIndex > 0 && <Grid
          className={classes.gridStyle}
          style={{ top: 0 }}
          rowCount={rowCount}
          width={colWidth}
          columnWidth={colWidth / SPB}
          columnCount={SPB}
          rowHeight={rowHeight}
          cellRenderer={StepsRender({ BPMe, SPB, parentColumnIndex: columnIndex -1, theme })}
          height={parent.props.height}
        />}
      </div>
    )
  }

  renderGroup = ({ columnIndex, rowIndex, style, isVisible }) => {
    const group = this.props.groups[rowIndex]
    const GroupRenderer = this.props.groupRenderer;
    return (
      <div key={`${columnIndex}${rowIndex}group`} style={style}>
        <GroupRenderer group={group} />
      </div>
    )
  }

  renderRow = (colWidth, onRowClick, scrollLeft) => ({ columnIndex, rowIndex, style, isVisible }) => {
    const group = this.props.groups[rowIndex]
    return (
      <div
        key={`${rowIndex}${columnIndex}row`}
        style={{ ...style, transform: `translatex(-${scrollLeft}px)`, borderBottom: `1px solid ${this.props.theme.palette.grey[400]}` }}
        data-row-index={rowIndex}
        onClick={e => {onRowClick(e.nativeEvent, rowIndex, group)}}
      >
        {rowItemsRenderer(
          this.props.items.filter(item => item.row === group.id),
          isVisible,
          colWidth,
          this.props.itemRenderer,
          this.props.onItemClick,
          this.props.classes,
          this.props.SPB,
          rowIndex,
          columnIndex,
          this.props.groups,
          style.height,
        )}
      </div>
    )
  }

  render() {
    const { classes, groups, items, groupOffset, rowHeight, colWidth, onRowClick, scrollToRow, upperLeftComponent } = this.props;
    const barSize = scrollbarSize();
    return (
      <div className={classes.container} ref={this.container}>
        <ScrollSync>
          {({ onScroll, scrollLeft, scrollTop }) => (
            <div className={classes.wrapper}>
              <div
                className={classes.timeline}
                style={{
                  height: TIMELINE_HEIGHT,
                }}
              >
                <div style={{ width: groupOffset }} className={classes.upperLeftComponent}>
                  {upperLeftComponent}
                </div>
                <Grid
                  className={classes.measureContainer}
                  rowCount={1}
                  width={(this.container.current && this.container.current.getBoundingClientRect().width) || window.innerWidth }
                  height={TIMELINE_HEIGHT}
                  columnWidth={columnGridWith(0, groupOffset, colWidth)}
                  columnCount={COLS}
                  rowHeight={TIMELINE_HEIGHT}
                  cellRenderer={this.renderTimeline}
                  scrollLeft={scrollLeft}
                  style={{ left: groupOffset }}
                />
              </div>
              <div
                className={classes.leftSideGridContainer}
                style={{ top: 0, width: groupOffset }}
              >
                <Grid
                  cellRenderer={this.renderGroup}
                  columnWidth={groupOffset}
                  columnCount={1}
                  className={classes.leftSideGrid}
                  height={(rowHeight * groups.length)}
                  rowHeight={rowHeight}
                  rowCount={groups.length}
                  scrollTop={scrollTop}
                  width={groupOffset}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: TIMELINE_HEIGHT - scrollTop,
                    bottom: 0,
                  }}
                />
              </div>
              <div className={classes.autosizeContainer} style={{ paddingLeft: groupOffset, paddingTop: TIMELINE_HEIGHT }}>
                <AutoSizer>
                  {({ height, width }) => (
                    <div
                      style={{ height, width }}
                      ref={this.wrapper}
                      onScroll={
                        event => {
                          if (event.target !== this.wrapper.current) return
                          this.position.scrollLeft = event.target.scrollLeft;
                          this.position.scrollTop = event.target.scrollTop;
                          onScroll({ scrollLeft: event.target.scrollLeft, scrollTop: event.target.scrollTop })
                        }
                      }
                      className={classes.gridWrapper}
                    >
                      <div
                        style={{ height: (groups.length * rowHeight), width: grid_width }}
                        className={classes.scroller}
                      >
                        <div
                          style={{
                            left: scrollLeft,
                            top: scrollTop - TIMELINE_HEIGHT - barSize,
                            position: 'relative',
                            paddingBottom: `${barSize}px`,
                          }}
                          className={classes.innerWrapper}
                        >
                          <Grid
                            className={classes.gridStyle}
                            rowCount={1}
                            width={width}
                            height={height + barSize}
                            columnWidth={columnGridWith(width, groupOffset, colWidth)}
                            columnCount={COLS}
                            rowHeight={height}
                            cellRenderer={this.renderCol(groups.length, rowHeight, colWidth)}
                            scrollLeft={scrollLeft}
                            scrollTop={scrollTop}
                          />
                          <Grid
                            className={classes.gridStyle}
                            rowCount={groups.length}
                            width={width}
                            height={height}
                            columnWidth={width}
                            columnCount={1}
                            rowHeight={rowHeight}
                            cellRenderer={this.renderRow(colWidth, onRowClick, scrollLeft)}
                            scrollLeft={scrollLeft}
                            scrollTop={scrollTop}
                            style={{ paddingTop: barSize }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </AutoSizer>
              </div>
            </div>
          )}
        </ScrollSync>
      </div>
    )
  }
}

export default withStyles(styles)(withTheme(Timeline))