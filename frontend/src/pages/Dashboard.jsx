import { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [activities, setActivities] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    const { data } = await api.get('/activities');
    setActivities(data);
  }

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Olá, {user?.login}</Typography>
        <Button onClick={logout}>Sair</Button>
      </Box>

      <List sx={{ mt: 3 }}>
        {activities.map((activity) => (
          <ListItem key={activity.id}>
            <ListItemText
              primary={activity.nome}
              secondary={`${activity.status} — ${new Date(activity.data_inicio).toLocaleString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}