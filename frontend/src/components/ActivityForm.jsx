import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box,
} from '@mui/material';
import api from '../api/axios';

const statusOptions = ['pendente', 'concluida', 'cancelada'];

// formata um valor ISO da API pro formato que <input type="datetime-local"> aceita
function toDatetimeLocal(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toISOString().slice(0, 16);
}

export default function ActivityForm({ open, onClose, onSaved, activity, defaultDate }) {
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    data_inicio: '',
    data_fim: '',
    status: 'pendente',
  });

  // sempre que o modal abrir com uma atividade diferente (ou vazio), reseta o form
  useEffect(() => {
    if (activity) {
      setForm({
        nome: activity.nome,
        descricao: activity.descricao || '',
        data_inicio: toDatetimeLocal(activity.data_inicio),
        data_fim: toDatetimeLocal(activity.data_fim),
        status: activity.status,
      });
    } else {
      setForm({
        nome: '',
        descricao: '',
        data_inicio: defaultDate ? `${defaultDate}T09:00` : '',
        data_fim: defaultDate ? `${defaultDate}T10:00` : '',
        status: 'pendente',
      });
    }
  }, [activity, defaultDate, open]);

  function handleChange(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (activity) {
      await api.put(`/activities/${activity.id}`, form);
    } else {
      await api.post('/activities', form);
    }
    onSaved();
    onClose();
  }

  async function handleDelete() {
    await api.delete(`/activities/${activity.id}`);
    onSaved();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{activity ? 'Editar atividade' : 'Nova atividade'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Nome" fullWidth margin="normal" required
            value={form.nome} onChange={handleChange('nome')}
          />
          <TextField
            label="Descrição" fullWidth margin="normal" multiline rows={3}
            value={form.descricao} onChange={handleChange('descricao')}
          />
          <Box display="flex" gap={2}>
            <TextField
              label="Início" type="datetime-local" fullWidth margin="normal" required
              InputLabelProps={{ shrink: true }}
              value={form.data_inicio} onChange={handleChange('data_inicio')}
            />
            <TextField
              label="Término" type="datetime-local" fullWidth margin="normal" required
              InputLabelProps={{ shrink: true }}
              value={form.data_fim} onChange={handleChange('data_fim')}
            />
          </Box>
          <TextField
            select label="Status" fullWidth margin="normal"
            value={form.status} onChange={handleChange('status')}
          >
            {statusOptions.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {activity && (
            <Button color="error" onClick={handleDelete}>Excluir</Button>
          )}
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Salvar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}