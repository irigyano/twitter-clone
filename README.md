# Webber

Webber is a social app inspired by Twitter, built with Vue 3 Composition API written in TypeScript, styled with Tailwind CSS, and uses Supabase as BaaS to handle authentication and database management.

<a style='font-size:large;font-weight:700;' href="https://webber-nine.vercel.app/">Live Demo</a>

## Features

- Users can post articles and upload up to 4 images per post.
- Typography for YouTube iframes, mentions, tags, and hyperlinks.
- Users can like and retweet posts.
- Users can follow/unfollow other users.
- Toggle tweets feed between recommendations and follow-only.
- Supports drag-and-drop & clipboard images uploading.
- Preview images in buffer before uploading.
- Notification system.
- Search post content using PG textsearch.
- Show Trending Keywords using PG textsearch.
- RWD supporting devices from mobile to 4K desktop monitor.
- Update views after HTTP requests and auto refetch using Vue Query.

## Diagram

<img alt="schema" src="./.github/diagram.png" />

## Database Schema

<img alt="schema" src="./.github/db_schema.png" />

## Tech Stack

- **[Vue.js](https://vuejs.org/)**: Frontend client-side rendering using Composition API.
- **[Tailwind CSS](https://tailwindcss.com)**: Styling, RWD.
- **[Supabase](https://supabase.com/)**: BaaS handling auth, S3 upload and PostgreSQL.
- **[Pinia](https://pinia.vuejs.org/)**: User metadata state management.
- **[TanStack Query](https://tanstack.com/query)**: Caching and revalidating HTTP requests.

## Local Setup

### 1. Create a `.env` file

Provide your values as needed in `.env.example`.

### 2. Make sure Bun is installed and then run

```
bun install
```

### 3. Setup Supabase project and link with local client

TBA
