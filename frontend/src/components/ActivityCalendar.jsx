import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const statusColors = {
  pendente: '#f59e0b',
  concluida: '#10b981',
  cancelada: '#f87171',
};

export default function ActivityCalendar({ activities, onEventClick, onDateClick }) {
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
