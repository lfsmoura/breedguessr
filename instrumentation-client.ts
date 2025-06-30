import posthog from "posthog-js"
import { binding } from 'cf-bindings-proxy';

const posthogKey = binding<string>('NEXT_PUBLIC_POSTHOG_KEY');

posthog.init(posthogKey, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  capture_pageview: 'history_change',
  capture_pageleave: true, // Enable pageleave capture
  capture_exceptions: true, // Enable capturing exceptions using Error Tracking
  debug: process.env.NODE_ENV === "development",
});
