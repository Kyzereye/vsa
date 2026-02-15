import MeetingsPage from "./MeetingsPage";

function Meetings() {
  return (
    <MeetingsPage
      eventType="orgNY"
      title="Organizational Meetings"
      subtitle="VSA board and general member meetings — NY, PA, and combined"
      backTo="/"
      backLabel="Back to VSA Home"
    />
  );
}

export default Meetings;
