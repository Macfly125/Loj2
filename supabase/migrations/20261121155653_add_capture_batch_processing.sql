/*
# Add grouped capture processing

1. Modified Tables
- `coach_screenshot_imports.batch_id` groups screenshots selected in the same import action.
- `coach_screenshot_imports.batch_position` stores the automatic order inside a selected batch.
- `coach_screenshot_imports.batch_total` stores how many captures were selected in that batch.

2. Application Behavior
- Multiple screenshots can be selected together from the phone gallery.
- Each screenshot is saved as its own durable history row while retaining the shared batch reference.
- The position and total allow the mobile interface to show automatic processing progress and a complete batch history.

3. Security
- Existing Row Level Security policies and grants remain unchanged because the new fields belong to the already protected single-tenant capture table.
- No existing rows, columns, or files are deleted or altered.

4. Important Notes
- Image files remain on the device in this version; the database stores capture metadata and processing status only.
- The migration is idempotent and can be safely replayed on a fresh database or after a partial deployment.
*/

ALTER TABLE coach_screenshot_imports
  ADD COLUMN IF NOT EXISTS batch_id text;

ALTER TABLE coach_screenshot_imports
  ADD COLUMN IF NOT EXISTS batch_position integer;

ALTER TABLE coach_screenshot_imports
  ADD COLUMN IF NOT EXISTS batch_total integer;

CREATE INDEX IF NOT EXISTS coach_screenshot_imports_batch_idx
  ON coach_screenshot_imports (batch_id, batch_position ASC);
