import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Tone from 'tone';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IconButton from '@material-ui/core/IconButton';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import Stop from '@material-ui/icons/Stop';
import Save from '@material-ui/icons/Save';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FastRewind from '@material-ui/icons/FastRewind';
import FastForward from '@material-ui/icons/FastForward';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { selectPlayer, playAudio, stopAudio } from '../../store/appReducer';
import { connect } from 'react-redux';
import { selectSavedSongs } from '../../store/savedSongs/selectors';
import { saveSong, loadSong } from '../../store/savedSongs/actions';
import { Button, ListItemIcon } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const HeaderControls = ({ player, playAudio, stopAudio, savedSongs, saveSong, loadSong  }) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [tabs, setTabs] = useState(0);
  const [songName, setSongName] = useState({ name: null });
  const [songToSave, setSongToSave] = useState(-1);
  return (
    <Toolbar>
      <IconButton onClick={() => {setModalOpen(true)}} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
        <Save />
      </IconButton>
      <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
        <FastRewind />
      </IconButton>
      <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
        {player === 'playing' ? <Stop onClick={() => {stopAudio()}} /> : <PlayCircleFilled onClick={() => {playAudio()}} />}
      </IconButton>
      <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
        <FastForward />
      </IconButton>
      <Dialog
        open={modalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {setModalOpen(false)}}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <Tabs
            value={tabs}
            onChange={(e, newValue) => setTabs(newValue)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Save"/>
            <Tab label="Load"/>
          </Tabs>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="save-load-song-information">
            Songs are currently saved in your browser. If you reset your browser they will be lost.
          </DialogContentText>
          <DialogContentText id="save-load-songs">
            <List className={classes.root} subheader={<li />}>
              <RadioGroup
                value={songToSave}
                onChange={({ target }) => {setSongToSave(target.value)}}
              >
                {tabs === 0 && <ListItem>
                  <ListItemIcon><Radio value={'-1'} /></ListItemIcon>
                  <ListItemText>
                    <TextField
                      value={songName.name || ''}
                      onChange={({ target }) => setSongName({ name: target.value, id: null })}
                      placeholder="New song name"
                    />
                  </ListItemText>
                </ListItem>}
                {savedSongs.map(({ name, id }, index) => (
                  <ListItem key={`item-${id}`}>
                    <ListItemIcon>
                      <Radio value={`${index}`} />
                    </ListItemIcon>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </RadioGroup>
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {setModalOpen(false); setSongName({ name: null })}}
          >
            Cancel
          </Button>
          <Button
            disabled={tabs === 0 && songToSave === -1 && songName.name === null}
            onClick={() => {
              setModalOpen(false);
              if (tabs === 0) {
                saveSong(songToSave === -1 ? songName : savedSongs[songToSave]);
              } else {
                loadSong(savedSongs[parseInt(songToSave)].id)
              }
              setSongName({ name: null })
            }}
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Toolbar>
  )
}

const stp = s => ({
  player: selectPlayer(s),
  savedSongs: selectSavedSongs(s),
});

const dtp = d => ({
  playAudio: () => d(playAudio()),
  stopAudio: () => d(stopAudio()),
  saveSong: (name, id) => d(saveSong(name, id)),
  loadSong: id => d(loadSong(id)),
})

export default connect(stp, dtp)(HeaderControls);