import { useState, useEffect } from 'react';
import { Box, Typography, Button, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ActivityCalendar from '../components/ActivityCalendar';
import ActivityForm from '../components/ActivityForm';

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [defaultDate, setDefaultDate] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    const { data } = await api.get('/activities');
    setActivities(data);
  }

  function handleEventClick(id) {
    const activity = activities.find((a) => String(a.id) === id);
    setSelectedActivity(activity);
    setDefaultDate(null);
    setFormOpen(true);
  }

  function handleDateClick(dateStr) {
    setSelectedActivity(null);
    setDefaultDate(dateStr);
    setFormOpen(true);
  }

  function handleNewClick() {
    setSelectedActivity(null);
    setDefaultDate(null);
    setFormOpen(true);
  }

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Olá, {user?.login}</Typography>
        <Button onClick={logout}>Sair</Button>
      </Box>

      <ActivityCalendar
        activities={activities}
        onEventClick={handleEventClick}
        onDateClick={handleDateClick}
      />

      <Fab
        color="primary"
        onClick={handleNewClick}
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
      >
        <AddIcon />
      </Fab>

      <ActivityForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={loadActivities}
        activity={selectedActivity}
        defaultDate={defaultDate}
      />
    </Box>
  );
}