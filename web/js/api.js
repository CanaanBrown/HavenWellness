// js/api.js
const API_BASE = "http://localhost:5135/api";

const API = {
  debug: {
    async seedInfo() {
      const res = await fetch(`${API_BASE}/Debug/seed-info`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  },
  users: {
    async list() {
      const res = await fetch(`${API_BASE}/Users`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    async create(user) {
      const res = await fetch(`${API_BASE}/Users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  },
  symptoms: {
    async list() {
      const res = await fetch(`${API_BASE}/Symptoms`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    async createEntry(entry) {
      const res = await fetch(`${API_BASE}/Symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    async createDetail(detail) {
      const res = await fetch(`${API_BASE}/Symptoms/details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(detail),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  },
  groups: {
    async list() {
      const res = await fetch(`${API_BASE}/Groups`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  },
  messages: {
    async list(groupId) {
      const res = await fetch(`${API_BASE}/Messages?groupId=${groupId}`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    async create(msg) {
      const res = await fetch(`${API_BASE}/Messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  },
};

// Make it globally available
window.API = API;
window.API_BASE = API_BASE;

console.log("✅ API loaded at", API_BASE);
