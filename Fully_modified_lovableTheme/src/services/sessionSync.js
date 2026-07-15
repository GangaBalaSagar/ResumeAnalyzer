const CHANNEL_NAME = "ra_session_sync_v1";
const STORAGE_KEY = "ra_session_sync_event_v1";

const listeners = new Set();
let channel = null;
let initialized = false;

function getTabId() {
  if (typeof window === "undefined") return "server";
  if (!window.__raSessionSyncTabId) {
    window.__raSessionSyncTabId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }
  return window.__raSessionSyncTabId;
}

function createEnvelope(message) {
  return {
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    source: getTabId(),
    createdAt: Date.now(),
    ...message,
  };
}

function notify(message) {
  listeners.forEach((listener) => {
    try {
      listener(message);
    } catch (error) {
      console.error("Session sync listener error:", error);
    }
  });
}

function onBroadcastMessage(event) {
  const message = event?.data;
  if (!message || message.source === getTabId()) return;
  notify(message);
}

function onStorageMessage(event) {
  if (event.key !== STORAGE_KEY || !event.newValue) return;
  try {
    const message = JSON.parse(event.newValue);
    if (!message || message.source === getTabId()) return;
    notify(message);
  } catch {
    // Ignore malformed sync payloads.
  }
}

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  if (typeof BroadcastChannel !== "undefined") {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.addEventListener("message", onBroadcastMessage);
  }

  window.addEventListener("storage", onStorageMessage);
}

export function subscribeSessionSync(listener) {
  if (typeof window === "undefined") {
    return () => {};
  }

  ensureInitialized();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function publish(message, { notifyLocal = false } = {}) {
  if (typeof window === "undefined") return;

  ensureInitialized();
  const envelope = createEnvelope(message);

  if (notifyLocal) {
    notify(envelope);
  }

  if (channel) {
    try {
      channel.postMessage(envelope);
    } catch {
      // BroadcastChannel is best effort.
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage fallback is best effort.
  }
}

export function publishAuthSync(event, session = null, extras = {}) {
  publish(
    {
      kind: "auth",
      event,
      session: session
        ? {
            userId: session.user?.id || null,
            expiresAt: session.expires_at || null,
          }
        : null,
      ...extras,
    },
    { notifyLocal: false }
  );
}

export function publishActivitySync(timestamp = Date.now()) {
  publish(
    {
      kind: "activity",
      timestamp,
    },
    { notifyLocal: true }
  );
}

export function publishSessionMetadataSync(metadata = {}) {
  publish(
    {
      kind: "metadata",
      ...metadata,
    },
    { notifyLocal: true }
  );
}
