-- Add instructor_id to events (run once on existing DB)
ALTER TABLE events
  ADD COLUMN instructor_id INT NULL,
  ADD CONSTRAINT fk_events_instructor FOREIGN KEY (instructor_id) REFERENCES team_profiles(id) ON DELETE SET NULL;

CREATE INDEX idx_events_instructor ON events(instructor_id);
