This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The objective of this repo is to implement [this](https://github.com/dash0hq/take-home-assignments/tree/main/otlp-log-viewer) coding challenge for Dash0.

## Testing the solution

You can access the final version of this challenge on this vercel [deployment url](https://dash0-challenge.vercel.app/visualize) or download the repo and run it with the steps below.

## Getting Started Locally

First, run the development server:

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

This code challenge implemented the following features:
1. Retrieve a list of log records from the OTLP logs HTTP endpoint.
2. Render a table with the log records with the following columns [Severity, Time, Body].
3. Add capability to expand a log record of the table and see all its related information.
4. Render a histogram visualizing the distribution of log records.

## Extra features
1. Basic i18n.
2. Add capability to select bucket size and time period on the histogram viz.

## Libraries used

### @nivo
React library for charting that is a direct wrapper on top of d3. I

### swr
Vercel fetching solution. Provides out of the box caching, and refetching.
