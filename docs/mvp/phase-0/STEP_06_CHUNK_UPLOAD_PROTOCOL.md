# STEP 06: Chunked Upload Protocol PoC

Status: Draft  
Branch: `feature/poc-step-06-chunk-upload`  
Depends on: STEP 00

## Purpose

Validate the API/interface model for large file upload before implementing real object storage and processing workers.

## Candidate API

```text
POST   /upload-sessions
PUT    /upload-sessions/{session_id}/parts/{part_number}
POST   /upload-sessions/{session_id}/complete
DELETE /upload-sessions/{session_id}
```

## Implementation Scope

Prototype client-side file slicing and mock upload-session handlers.

This step validates the protocol shape, not production storage.

## Tasks

1. Define request/response schemas for upload sessions.
2. Prototype client-side file slicing.
3. Create mock route handlers for session create, part upload, complete, and cancel.
4. Track upload progress.
5. Track part numbers and byte ranges.
6. Document resumable metadata requirements.
7. Document storage assumptions for MVP-B.

## Acceptance Criteria

- A sample file can be sliced into chunks client-side.
- Upload progress can be displayed.
- Mock API receives ordered part metadata.
- Cancel behavior is represented.
- Resume behavior is documented even if not fully implemented.
- The protocol does not require real object storage in Phase 0.

## Verification

Minimum verification:

- Manual file selection.
- Manual chunk progress check.
- Mock handler response check.
- Console/network check.

Preferred verification:

- Unit tests for chunk slicing.
- Route handler tests if the framework setup supports them.

## Risks

- Browser memory usage can rise with large files if slicing is handled incorrectly.
- Resume semantics need backend storage support later.
- Upload protocol should not overfit to one object storage provider too early.

## Completion Report

Claude must create a Korean completion report under `docs/reports/` after implementation or verification is complete.
