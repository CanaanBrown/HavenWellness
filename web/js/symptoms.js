// web/js/symptoms.js
(function () {
  // Hardcode demo userId=1 for now (same as dashboard demo)
  const DEMO_USER_ID = 1;

  document.addEventListener('DOMContentLoaded', () => {
    // wire up form + initial load
    const form = document.getElementById('symptomForm');
    const reloadBtn = document.getElementById('reloadBtn');

    if (form) form.addEventListener('submit', onSubmit);
    if (reloadBtn) reloadBtn.addEventListener('click', loadSymptoms);

    loadSymptoms();
  });

  async function onSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('symptomName').value.trim();
    const painLevel = Number(document.getElementById('painLevel').value);
    const notes = document.getElementById('notes').value.trim();

    if (!name || !painLevel || isNaN(painLevel)) {
      showToast('Please provide a symptom and a pain level (1-10).');
      return;
    }

    try {
      // 1) find (or create) today's SymptomEntry for the demo user
      const entryId = await findOrCreateTodayEntry(DEMO_USER_ID);

      // 2) add the detail to that entry
      await apiPost('/Symptoms/details', {
        symptomEntryId: entryId,
        name,
        painLevel,
        notes
      });

      // 3) clear form + reload
      document.getElementById('symptomForm').reset();
      await loadSymptoms();
    } catch (err) {
      showToast(`Failed to add symptom: ${err.message}`);
    }
  }

  function todayISO() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`; // yyyy-MM-dd
  }

  async function findOrCreateTodayEntry(userId) {
    const today = todayISO();

    // try to find an entry for today
    const existing = await apiGet(`/Symptoms?userId=${userId}&from=${today}&to=${today}&page=1&pageSize=1`);
    const hit = Array.isArray(existing) ? existing.find(e => e.date === today) : null;
    if (hit) return hit.id;

    // none? create one
    const created = await apiPost('/Symptoms', {
      userId,
      date: today
    });
    return created.id;
  }

  async function loadSymptoms() {
    try {
      // last 7 days, newest first
      const end = todayISO();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const start = startDate.toISOString().slice(0, 10);

      const items = await apiGet(`/Symptoms?userId=1&from=${start}&to=${end}&page=1&pageSize=50`);

      const pretty = JSON.stringify(items, null, 2);
      document.getElementById('symptomList').textContent = pretty;
    } catch (err) {
      showToast(`Failed to load symptoms: ${err.message}`);
    }
  }
})();
