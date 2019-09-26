import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import IMGR from "./pages/IMGR"
import STORM from "./pages/STORM"
import FiSHProbes from "./pages/FiSHProbes"
import Chromo from "./pages/Chromo"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs(props) {
  const {c} = props
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [regions,setRegions] = React.useState([])
  const [brush,setBrush] = React.useState([])
  function handleChange(event, newValue) {
    setValue(newValue);
  }
  c.on("update.a",function(d){
    setRegions(d)
  })
  c.on("brush",function(d){
    setBrush(d)
  })

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="OligoSTORM" {...a11yProps(0)} />
          <Tab label="STORM" {...a11yProps(1)} />
          <Tab label="FiSH Probes" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
     <TabPanel value={value} index={0}>
        <IMGR regions={regions} brush={brush} c={c} classes={classes}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <STORM regions={regions} brush={brush} c={c} classes={classes}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <FiSHProbes regions={regions} brush={brush} c={c} classes={classes}/>
      </TabPanel>
    </div>
  );
}

