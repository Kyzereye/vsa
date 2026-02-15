import EventsPage from "./EventsPage";

function Events() {
  return (
    <EventsPage
      eventType="vsa"
      title="Events"
      subtitle="Upcoming VSA events — NY, ShredVets, and more"
      backTo="/"
      backLabel="Back to VSA Home"
      pastEventsLink="/past-events"
      pastEventsLabel="View past VSA events"
    />
  );
}

export default Events;
