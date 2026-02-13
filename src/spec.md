# Specification

## Summary
**Goal:** Build a healthcare + wellness consultation platform with provider directories/profiles, authenticated patient accounts, appointment requests, a personalized tracking assistant, nutrition recommendations, fitness listings, memberships/pricing, VIP tier labeling, and a restricted admin area.

**Planned changes:**
- Create core site information architecture and navigation: Providers, Consultations, My Care (records/assistant), Fitness, Memberships/Pricing, Account, and Admin.
- Implement provider directory (gynecology/psychology/nutrition) with filters and provider profile detail pages including online/offline services and contact/booking CTA.
- Add backend models + APIs for provider profiles with public read endpoints and admin-restricted CRUD.
- Add Internet Identity authentication and persist per-patient profiles (preferences/description/needs/saved items) with an account area to view/edit.
- Support consultation appointment requests and tracking (provider, modality, preferred time, status, notes) and store/display meeting links for online appointments.
- Implement a per-patient chatbot-style assistant timeline that persists across sessions and supports structured capture of prescriptions, records, nutrition surveys, habits/lifestyle notes, and appointment summaries.
- Build a Nutrition area with a patient-editable survey and deterministic, rule-based recommendations derived from profile + survey data.
- Build a Fitness area listing online/offline Zumba and Gym options, with offline filtering by user-entered location text; store listings in backend and support admin CRUD.
- Add membership/pricing configuration per fitness offering (platform fee + day/weekly/monthly/yearly options), display plans on Fitness and Pricing pages, and allow patients to select a plan (display-only).
- Add VIP tier/status in data model and UI, configurable by admins and shown in the patient account and annotated across relevant pages.
- Add a minimal admin management area restricted to an allowlist of admin principals to manage providers, fitness listings, and membership plans.
- Apply a cohesive modern healthcare/wellness visual theme (avoid blue/purple as primary colors) and integrate required static assets from `frontend/public/assets/generated`.

**User-visible outcome:** Users can sign in with Internet Identity, browse and view provider profiles, request and track online/offline consultations, maintain a personal care/assistant history (records, prescriptions, habits, surveys), see rule-based nutrition guidance, browse fitness options (including offline filtering by typed location), view/select membership plans, and see VIP status; admins can manage providers, fitness listings, and pricing via a restricted admin area.
