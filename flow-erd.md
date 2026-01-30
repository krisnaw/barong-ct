# High-level structure and flows

## Entity Relationship Diagrams (ERD)

**Text-based ERD Example:**

## Event

- **id**: serial (primary key)
- **name**: text (not null)
- **description**: text (not null)
- **feature_image**: text (nullable)
- **maxParticipants**: integer (default: 50, null = unlimited)
- **startDate**: timestamp (not null, default: now)
- **eventDate**: date (nullable)
- **eventTime**: time with timezone (nullable)
- **locationName**: text (nullable)
- **locationLink**: text (nullable)
- **createdAt**: timestamp (not null, default: now)
- **updatedAt**: timestamp (not null, default: now, auto-updated on row change)

## Event Category
- **id**: serial (primary key)
- **name**: text (not null)
- **eventId**: integer (not null, foreign key → event.id, on delete: cascade)

## Event Participant

- **id**: serial (primary key)
- **userId**: text (not null, foreign key → user.id, on delete: cascade)
- **eventId**: integer (not null, foreign key → event.id, on delete: cascade)
- **bibNumber**: integer (nullable, unique per event)
- **status**: text (default: "registered")
- **createdAt**: timestamp (not null, default: now)
- **updatedAt**: timestamp (not null, default: now, auto-updated on row change)

### Constraints
- **unique(userId, eventId)** — a user can only register once per event
- **unique(eventId, bibNumber)** — bib number must be unique within the same event

## Sequence Diagrams

## State Diagrams