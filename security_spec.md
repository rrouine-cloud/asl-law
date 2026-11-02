# Security Specification - Ask Law

## 1. Data Invariants

1. **Deadlines Ownership**: A deadline document can only be created by an authenticated user and must belong to them (userId == request.auth.uid).
2. **Deadlines Immutability**: The `userId` of a deadline cannot be changed once created.
3. **Court Sessions Ownership**: A session can only be created by an authenticated user and must belong to them.
4. **User Preferences Isolation**: User preferences can only be read or written by the owner (document ID == auth.uid).
5. **Saved Articles / Search History Integrity**: These records must belong to the logged-in user.
6. **No Self-Assigned Privileges**: Users cannot set `role` or `isAdmin` fields on any document.
7. **Size Limits**: All strings and arrays must have strict size limits to prevent resource exhaustion attacks.
8. **Identity Poisoning Guard**: Document IDs must match `isValidId` pattern (alphanumeric, -, _, max 128 chars).

## 2. The "Dirty Dozen" Payloads (Identity, Integrity, and State)

1. **Identity Spoofing**: Create a deadline document for another user's UID.
2. **ID Poisoning**: Create a document using a 1MB junk string as the document ID.
3. **Privilege Escalation**: Attempt to set `isAdmin: true` on `user_preferences`.
4. **Immutable Field Tampering**: Attempt to update `userId` on an existing deadline.
5. **State Shortcut**: Update a deadline status directly to `EXPIRED` from `SAFE` without following intended app logic (though rules should allow valid transitions if defined).
6. **Boundary Violation**: Create a document with a 1MB string title.
7. **Shadow Field Injection**: Inject an unofficial field `debug_access: true` into a `court_sessions` document.
8. **Relational Wipe**: Delete a deadline belonging to another user.
9. **PII Leak**: Attempt to list all `user_preferences` (unbound read).
10. **Query Scrape**: Attempt to `list` deadlines without a `where` clause filtering by `userId` (if rules don't enforce it).
11. **Type Poisoning**: Update `deadlineDate` with a boolean instead of a string.
12. **Orphaned Record**: Create a `court_session` with an invalid `sessionId`.

## 3. Hardened Status

| Feature | Identity Guarded | Type Safe | Size Restricted | Immutable Keys |
| :--- | :---: | :---: | :---: | :---: |
| user_preferences | ✅ | ✅ | ✅ | ✅ |
| saved_articles | ✅ | ✅ | ✅ | ✅ |
| search_history | ✅ | ✅ | ✅ | ✅ |
| personalized_plans | ✅ | ✅ | ✅ | ✅ |
| deadlines | ✅ | ✅ | ✅ | ✅ |
| court_sessions | ✅ | ✅ | ✅ | ✅ |
