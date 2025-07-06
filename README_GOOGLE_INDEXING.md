# Google Indexing & Search Console Integration Plan

This document tracks the implementation of a Google Indexing/Search Console dashboard for this project, inspired by the `request-indexing-main-example` Nuxt app.

## Goals
- Integrate `@googleapis/indexing` and `@googleapis/searchconsole` into the Next.js app
- Show Google Search Console data for connected sites
- Allow quick/manual/auto indexing of pages
- Ensure compatibility with Vercel hosting

---

## Implementation Checklist

### 1. Install Dependencies
- [] Add `@googleapis/indexing` and `@googleapis/searchconsole` to `package.json`

### 2. API Routes
- [ ] Create `/pages/api/indexing.ts` for submitting URLs to Google Indexing API
- [ ] Create `/pages/api/searchconsole.ts` for fetching Search Console data
- [ ] Implement Google OAuth2 authentication and token storage

### 3. UI Components/Pages
- [ ] Add dashboard page (`/app/dashboard/page.tsx`) to:
  - [ ] List connected sites
  - [ ] Show analytics (clicks, impressions, indexed/non-indexed pages)
  - [ ] Provide UI for submitting URLs for indexing (manual/auto)

### 4. Utility Functions
- [ ] Add `/lib/google.ts` for Google OAuth, token management, and API helpers

### 5. (Optional) Auto-Indexing
- [ ] Add background job or endpoint for auto-indexing new pages

### 6. Vercel Hosting
- [ ] Use Vercel environment variables for Google credentials/secrets

### 7. Tests
- [ ] Unit tests for API endpoints (mock Google APIs)
- [ ] Integration test: fetch GSC data, submit URL for indexing, check response
- [ ] UI test: dashboard renders site data and indexing actions

---

## Expected Outcome
- Connect Google account, see Search Console data, submit URLs for indexing from dashboard
- Secure handling of credentials
- Works on Vercel
- Tests pass, error handling in place

---

**Progress will be updated as each step is completed.**
