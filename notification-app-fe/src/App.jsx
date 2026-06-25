import { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button
} from '@mui/material';
import axios from 'axios';
import { log } from './utils/logger';
import { getTopPriorityNotifications } from './utils/priorityNotifications';

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM3BhMWE0NWI2QHZpc2hudS5lZHUuaW4iLCJleHAiOjE3ODIzODExMTAsImlhdCI6MTc4MjM4MDIxMCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjBkYTAzODk5LTZlMGUtNGZjNS1hZmNhLThlMDM1MzU1YTBlMiIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InRhbm5pcnUgamFpc3VyeWEiLCJzdWIiOiI1NjgxMGVjMS0zYTJiLTQzZWMtOGFjMy1kMDNiNDBjMDZhZjkifSwiZW1haWwiOiIyM3BhMWE0NWI2QHZpc2hudS5lZHUuaW4iLCJuYW1lIjoidGFubmlydSBqYWlzdXJ5YSIsInJvbGxObyI6IjIzcGExYTQ1YjYiLCJhY2Nlc3NDb2RlIjoiYWhYanZwIiwiY2xpZW50SUQiOiI1NjgxMGVjMS0zYTJiLTQzZWMtOGFjMy1kMDNiNDBjMDZhZjkiLCJjbGllbnRTZWNyZXQiOiJKSkF1QVpRSEh5YWVSYWFxIn0.lqAF71Z8l7RqmE1hskELpfUhC96Xi6BYl6SF-39BHzA';

function App() {
  const [notifications, setNotifications] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(0);
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState('all');
  const [viewedIds, setViewedIds] = useState(new Set());

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      log('frontend', 'info', 'api', 'Fetching notifications');
      const response = await axios.get(
        'http://4.224.186.213/evaluation-service/notifications',
        { headers: { 'Authorization': 'Bearer ' + AUTH_TOKEN } }
      );
      const data = response.data.notifications || [];
      setNotifications(data);
      log('frontend', 'info', 'api', 'Fetched ' + data.length + ' notifications');
    } catch (err) {
      setError('Failed to load notifications');
      log('frontend', 'error', 'api', err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayed = () => {
    let filtered = [...notifications];
    if (filterType !== 'all') {
      filtered = filtered.filter(function(n) {
        return n.Type === filterType;
      });
    }
    filtered = filtered.map(function(n) {
      return { ...n, isViewed: viewedIds.has(n.ID) };
    });
    if (tab === 0) {
      setDisplayed(filtered);
    } else {
      setDisplayed(getTopPriorityNotifications(filtered, topN));
    }
  };

  useEffect(() => {
    log('frontend', 'info', 'page', 'App initialized');
    fetchNotifications();
  }, []);

  useEffect(() => {
    updateDisplayed();
  }, [notifications, tab, topN, filterType]);

  const handleNotificationClick = (id) => {
    const newViewed = new Set(viewedIds);
    newViewed.add(id);
    setViewedIds(newViewed);
    log('frontend', 'info', 'component', 'Notification ' + id + ' marked viewed');
  };

  const getChipColor = (type) => {
    if (type === 'Placement') return '#1976d2';
    if (type === 'Result') return '#d32f2f';
    if (type === 'Event') return '#2e7d32';
    return '#757575';
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={fetchNotifications} sx={{ mt: 2 }}>Try Again</Button>
      </Container>
    );
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Campus Notifications</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ borderRadius: 2 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)}>
            <Tab label="All Notifications" />
            <Tab label="Priority Inbox" />
          </Tabs>
          {tab === 1 && (
            <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Top N</InputLabel>
                <Select value={topN} onChange={(e) => setTopN(e.target.value)}>
                  <MenuItem value={5}>Top 5</MenuItem>
                  <MenuItem value={10}>Top 10</MenuItem>
                  <MenuItem value={15}>Top 15</MenuItem>
                  <MenuItem value={20}>Top 20</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Filter</InputLabel>
                <Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="Placement">Placement</MenuItem>
                  <MenuItem value="Result">Result</MenuItem>
                  <MenuItem value="Event">Event</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          <List>
            {displayed.length === 0 ? (
              <ListItem>
                <ListItemText primary="No notifications" />
              </ListItem>
            ) : (
              displayed.map((notif) => (
                <ListItem
                  key={notif.ID}
                  button
                  onClick={() => handleNotificationClick(notif.ID)}
                  sx={{
                    bgcolor: notif.isViewed ? '#f5f5f5' : 'white',
                    borderBottom: '1px solid #e0e0e0'
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="body1" sx={{ fontWeight: notif.isViewed ? 400 : 600 }}>
                          {notif.Message}
                        </Typography>
                        <Chip
                          label={notif.Type}
                          size="small"
                          sx={{ bgcolor: getChipColor(notif.Type), color: 'white' }}
                        />
                        {notif.isViewed && <Chip label="Viewed" size="small" variant="outlined" />}
                      </Box>
                    }
                    secondary={new Date(notif.Timestamp).toLocaleString()}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      </Container>
    </div>
  );
}

export default App;