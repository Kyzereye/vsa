import EventsPage from "./EventsPage";

function VsaPAEvents() {
  return (
    <EventsPage
      eventType="vsaPA"
      title="VSA-PA Events"
      subtitle="Upcoming VSA Pennsylvania chapter events"
      backTo="/vsa-pa"
      backLabel="Back to VSA-PA"
      pastEventsLink="/vsa-pa-past-events"
      pastEventsLabel="View past VSA-PA events"
    />
  );
}

export default VsaPAEvents;
