# Uni4U Lead Desk — portfolio demo

Static browser-local demo with fictional applicant records. No messages are sent and no agency database is connected.

Run any static server with `dist` as its root. Open `index.html` over HTTP. Data is stored under `uni4u-demo-v1` in this browser. JSON export is a full backup; CSV is a spreadsheet-friendly view. Import/reset show a replacement confirmation. Corrupt saved data is not silently overwritten. Keep JSON copies before changing devices or clearing browser storage.

Consultation collision checks cover the same manager and time among records in this browser only. External/shared calendars, real email automation, authentication and server persistence require separate integration work.

Verify with `node --test tests/domain.test.cjs`. Portfolio readiness updates: validated imports, Istanbul dates, CSV formula escaping, local booking collisions and cross-tab refresh. New input is validated before adding a lead.
