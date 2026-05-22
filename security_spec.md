# Security Specification: Booking Collection Security

This document outlines the security specifications and test-driven design constraints for securing the Firestore `/bookings` collection.

## 1. Data Invariants

- **Ownership & Privacy**: Consultation details contain Personally Identifiable Information (PII) including full name, mobile number, and notes. Only authenticated users can access their own bookings, and the public has write-only (creation) permission after basic form validations to allow anonymous or guest appointment bookings, or a secure guest write model. Wait, if standard guest booking is supported, writes can be made by anyone as long as they follow schema constraints, but read access should be completely locked to admins or the authenticated creator of that request.
- **Temporality**: Bookings must contain a `createdAt` timestamp verified strictly against the server-side `request.time`.
- **Identity & Fraud**: A non-admin user must never be allowed to overwrite or tamper with other users' bookings, and cannot alter crucial metadata such as `googleEventId`.

---

## 2. The "Dirty Dozen" Malicious Payloads

The following payloads are designed to challenge the access control matrix and must be mathematically blocked.

### Payload 1: Privilege Escalation (Shadow Admin Creation)
Attempting to create a booking with a system admin or role-override field.
```json
{
  "fullName": "Malicious Attacker",
  "mobileNumber": "0545698905",
  "clientType": "individual",
  "serviceType": "أخرى",
  "appointmentDate": "2026-06-01",
  "appointmentTime": "11:00",
  "isAdmin": true,
  "role": "manager"
}
```

### Payload 2: Timestamp Spoofing (Backdated Booking)
Attempting to set `createdAt` in the past.
```json
{
  "fullName": "Backdated User",
  "mobileNumber": "0545698905",
  "clientType": "individual",
  "serviceType": "أخرى",
  "appointmentDate": "2026-06-01",
  "appointmentTime": "11:00",
  "createdAt": "2020-01-01T00:00:00Z"
}
```

### Payload 3: Missing Required Fields (Schema Bypass)
Attempting to post a document without crucial fields like `mobileNumber`.
```json
{
  "fullName": "Incomplete User",
  "clientType": "individual",
  "serviceType": "أخرى",
  "appointmentDate": "2026-06-01",
  "appointmentTime": "11:00"
}
```

### Payload 4: ID Poisoning (DOS Attack via excessive ID length)
Injecting a massive string as the collection document ID.
- Targets: ID of 5KB size to cause high indexing latency.

### Payload 5: Deny-of-Wallet String Bloat (Data Injection)
Submitting a `fullName` or `notes` containing 50MB of garbage characters.

### Payload 6: Invalid Mobile Number Format
Submitting an invalid Saudi mobile number format.
```json
{
  "fullName": "Saudi User",
  "mobileNumber": "+1-800-MALICIOUS-FAKE",
  "clientType": "individual",
  "serviceType": "أخرى",
  "appointmentDate": "2026-06-01",
  "appointmentTime": "11:00"
}
```

### Payload 7: Client Type Enum Spoofing
Submitting custom strings instead of individual/company.
```json
{
  "fullName": "Sucker",
  "mobileNumber": "0545698905",
  "clientType": "hacker_superuser",
  "serviceType": "أخرى"
}
```

### Payload 8: Time Slot Poisoning (Outside Business Hours)
Attempting to book at `02:00` AM (working hours are 10:00 AM to 10:00 PM).
```json
{
  "fullName": "Late Night Hacker",
  "mobileNumber": "0545698905",
  "clientType": "individual",
  "serviceType": "أخرى",
  "appointmentDate": "2026-06-01",
  "appointmentTime": "02:00"
}
```

### Payload 9: Hijacking Sibling googleEventId
Setting or altering the event ID post-creation.

### Payload 10: Read scrapings (PII Leak)
An unauthorized guest or user reading the detailed list of bookings they do not own.

### Payload 11: Deletion by standard users
A standard user deleting the system log or appointment booking record.

### Payload 12: Invalid Date Range
Attempting to book a date in the distant past (e.g., YYYY-MM-DD that is older than the current date).

---

## 3. The Test Runner Specification (`firestore.rules.test.ts`)

```typescript
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';

describe('Firestore Security Rules Testing', () => {
  let testEnv: any;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'gen-lang-client-0357225786',
      firestore: {
        host: 'localhost',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  it('prohibits unauthorized public read of bookings', async () => {
    const context = testEnv.unauthenticatedContext();
    const db = context.firestore();
    await assertFails(db.collection('bookings').get());
  });

  it('strictly validates Saudi mobile phone formatting inside booking schema', async () => {
    const context = testEnv.unauthenticatedContext();
    const db = context.firestore();
    await assertFails(
      db.collection('bookings').add({
        fullName: "Attacker",
        mobileNumber: "12345", // invalid
        clientType: "individual",
        serviceType: "أخرى",
        appointmentDate: "2026-06-01",
        appointmentTime: "11:00",
        createdAt: new Date(),
      })
    );
  });
});
```
