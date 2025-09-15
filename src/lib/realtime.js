// Simple cross-tab realtime bus using BroadcastChannel with a localStorage fallback.
// All messages have shape: { senderId, type, data, ts }

const CHANNEL_NAME = 'inventory-demo';
const STORAGE_KEY = 'inventory-demo:message';

const hasBroadcast = typeof BroadcastChannel !== 'undefined';

class RealtimeBus {
  constructor() {
    this.senderId = crypto?.randomUUID?.() || String(Math.random());
    this.listeners = new Set();

    if (hasBroadcast) {
      this.bc = new BroadcastChannel(CHANNEL_NAME);
      this.bc.onmessage = (e) => this._emit(e.data);
    } else {
      // Fallback: listen for localStorage events
      window.addEventListener('storage', (e) => {
        if (e.key !== STORAGE_KEY || !e.newValue) return;
        try {
          const msg = JSON.parse(e.newValue);
          this._emit(msg);
        } catch {}
      });
    }
  }

  on(handler) {
    this.listeners.add(handler);
    return () => this.listeners.delete(handler);
  }

  send(type, data) {
    const msg = { senderId: this.senderId, type, data, ts: Date.now() };
    if (hasBroadcast) {
      this.bc.postMessage(msg);
    } else {
      // Write-through to localStorage to trigger 'storage' on other tabs
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msg));
      // Optional cleanup to avoid clutter
      setTimeout(() => localStorage.removeItem(STORAGE_KEY), 0);
    }
    // Return the message in case caller wants to optimistically apply
    return msg;
  }

  _emit(msg) {
    // Don’t rebroadcast our own messages
    if (!msg || msg.senderId === this.senderId) return;
    for (const fn of this.listeners) fn(msg);
  }
}

export const realtimeBus = new RealtimeBus();