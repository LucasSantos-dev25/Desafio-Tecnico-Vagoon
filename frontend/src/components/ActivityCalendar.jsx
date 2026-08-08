import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const statusColors = {
  pendente: '#f0ad4e',
  concluida: '#5cb85c',
  cancelada: '#d9534f',
};

export default function ActivityCalendar({ activities, onEventClick, onDateClick }) {
  // transforma o formato da sua API no formato que o FullCalendar espera
  const events = activities.map((activity) => ({
    id: String(activity.id),
    title: activity.nome,
    start: activity.data_inicio,
    end: activity.data_fim,
    backgroundColor: statusColors[activity.status],
    borderColor: statusColors[activity.status],
  }));

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      locale="pt-br"
      height="auto"
      eventClick={(info) => onEventClick(info.event.id)}
      dateClick={(info) => onDateClick(info.dateStr)}
    />
  );
}