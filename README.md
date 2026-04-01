# Family Birthday Tracker

A premium, real-time family hub to track ages, celebrations, and upcoming milestones with precision.

## 🚀 Quick Start (Supabase Setup)

To enable cloud synchronization across devices, you must set up your Supabase database:

1.  **Create Table**: Log in to your **Supabase Dashboard** -> **SQL Editor** -> **New Query**.
2.  **Paste SQL**: Use this schema to create the required table:

```sql
create table family_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  relation text not null,
  dateOfBirth text not null,
  color text not null,
  avatar text,
  family_id text not null,
  last_updated bigint not null default (extract(epoch from now()) * 1000)::bigint
);

-- Enable Realtime
alter publication supabase_realtime add table family_members;

-- Enable Row Level Security (RLS)
alter table family_members enable row level security;

-- Allow public access
create policy "Allow public access" 
on public.family_members 
for all 
using (true)
with check (true);
```

3.  **App Config**: In your app, click the **Cloud icon** and enter your Project URL and API Key.

## Features

- **Precision Age Engine**: Tracks years, months, days, hours, and minutes in real-time.
- **Comparison Lab**: Analyze and rank family age ratios.
- **Party Mode**: Full-screen confetti and birthday card designs.
- **Milestone Badges**: Highlights major age milestones.
- **Dark Mode**: Sleek theme support for night-time viewing.
- **Add-to-Calendar**: Generate `.ics` files for your personal calendar.
- **Data Export/Import**: Local JSON backups for complete control.

## Tech Stack

- **Vite** + **React 19**
- **Tailwind CSS 4**
- **Supabase** (Real-time synchronization)
- **Framer Motion** (Smooth UI animations)
- **Lucide React** (Premium icons)

Built with ❤️ for Family Unity.
