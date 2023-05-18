import { NextResponse } from 'next/server';

const quotes = [
  '"Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort." - Paul J. Meyer',
  '"The key is not to prioritize what\'s on your schedule but to schedule your priorities." - Stephen Covey',
  '"The only way to do great work is to love what you do." - Steve Jobs',
  '"Amateurs sit and wait for inspiration, the rest of us just get up and go to work." - Stephen King',
  '"Productivity is being able to do things that you were never able to do before." - Franz Kafka',
  '"The way to get started is to quit talking and begin doing." - Walt Disney',
  '"Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work." - Steve Jobs',
  '"The most important thing about getting somewhere is starting right where we are." - Bruce Barton',
  '"Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful." - Albert Schweitzer',
  '"You don\'t have to see the whole staircase, just take the first step." - Martin Luther King Jr.',
  '"Action is the foundational key to all success." - Pablo Picasso',
  '"The successful warrior is the average man, with laser-like focus." - Bruce Lee',
  '"Don\'t count the days; make the days count." - Muhammad Ali',
  '"Success is not in what you have, but who you are." - Bo Bennett',
  '"The path to success is to take massive, determined action." - Tony Robbins',
  '"The best way to predict the future is to create it." - Peter Drucker',
  '"Productivity is the deliberate, strategic investment of your time, talent, intelligence, energy, resources, and opportunities in a manner calculated to move you measurably closer to meaningful goals." - Dan S. Kennedy',
  '"Do not wait; the time will never be \'just right.\' Start where you stand, and work with whatever tools you may have at your command, and better tools will be found as you go along." - Napoleon Hill',
]
const token = process.env.GITHUB_TOKEN
const repo = process.env.GITHUB_REPO
const owner = process.env.GITHUB_OWNER
const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-Github-Api-Version": "2022-11-28"
}

type Event = {
  id: string
  type: string
  payload: {
    action: string
    commits: unknown[]
    ref_type?: string
  }
  created_at: string
}

const isIssueCreateEvent = (event: Event): boolean => {
  return event.type === "IssuesEvent" && event.payload.action === "opened"
}

const isRepoPushEvent = (event: Event): boolean => {
  return event.type === "PushEvent" && event.payload.commits.length > 0
}

const isRepoCreateEvent = (event: Event): boolean => {
  return event.type === "CreateEvent" && event.payload.ref_type === "repository"
}

async function commitEventHappenedInTheLastDay(): Promise<boolean> {
  const today = new Date()
  const events: Event[] = await fetch(`https://api.github.com/users/${owner}/events/public?per_page=50`, {
    headers
  }).then((res) => res.json())

  const commitEventsToday = events.filter((event) => {
    const eventDate = new Date(event.created_at)
    return eventDate.getDate() === today.getDate() && (isIssueCreateEvent(event) || isRepoPushEvent(event) || isRepoCreateEvent(event))
  })

  return commitEventsToday.length > 0
}

export async function GET() {
  const date = new Date()

  const commitInTheLastDay = await commitEventHappenedInTheLastDay()

  if (!commitInTheLastDay) {
    await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
      headers,
      method: "POST",
      body: JSON.stringify({
        title: `${date.toLocaleDateString()} - Another day missed :(`,
        body: quotes[Math.floor(Math.random() * quotes.length)]
      })
    })
  }

  return NextResponse.json({ message: "done", commitInTheLastDay })
}

export const runtime = 'edge';
