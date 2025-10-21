const $ = (sel) => document.querySelector(sel);
const out = (id, data) => { $(id).textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2); };

// Show which API we're hitting (helpful if ports change)
console.log("🔌 API_BASE:", API_BASE);

$("#btnSeed").addEventListener("click", async () => {
  out("#seedOut", "Loading…");
  try {
    const data = await API.debug.seedInfo();
    out("#seedOut", data);
  } catch (err) {
    out("#seedOut", `Error:\n${err.message}`);
  }
});

$("#btnUsers").addEventListener("click", async () => {
  out("#usersOut", "Loading…");
  try {
    const data = await API.users.list();
    out("#usersOut", data);
  } catch (err) {
    out("#usersOut", `Error:\n${err.message}`);
  }
});

// --- Create-user form logic ---
const form = document.querySelector("#formUser");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  out("#createOut", "Submitting…");

  const user = {
    name: form.name.value,
    email: form.email.value,
    passwordHash: form.password.value, // demo only
  };

  try {
    const res = await API.users.create(user);
    out("#createOut", res);
    showToast("✅ User added!");
  } catch (err) {
    out("#createOut", `Error:\n${err.message}`);
    showToast("⚠️ Failed to add user");
  }
});

// --- Toast helper ---
function showToast(msg) {
  const toast = document.querySelector("#toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// --- Symptom Tracker ---
const sForm = document.querySelector("#formSymptom");
const btnLoad = document.querySelector("#btnLoadSymptoms");


sForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  out("#symptomOut", "Submitting…");

  const name = sForm.symptomName.value.trim();
  const pain = parseInt(sForm.painLevel.value, 10);
  const notes = sForm.notes.value.trim();

  if (!name) return out("#symptomOut", "Error: symptom name required");
  if (Number.isNaN(pain) || pain < 1 || pain > 10) return out("#symptomOut", "Error: pain level must be 1–10");

  try {
    // 1️⃣ Create the Symptom Entry
    const entry = await API.symptoms.createEntry({
      userId: 1,
      date: new Date().toISOString().split('T')[0]
    });

    // 2️⃣ Create the Detail linked to that entry
    const detail = await API.symptoms.createDetail({
      symptomEntryId: entry.id,
      name: name,
      painLevel: pain,
      notes: notes,
    });

    out("#symptomOut", { entry, detail });
    showToast("✅ Symptom added!");
    
    // 3️⃣ Refresh the displayed symptoms and chart
    btnLoad.click();
  } catch (err) {
    out("#symptomOut", `Error:\n${err.message}`);
    showToast("⚠️ Failed to add symptom");
  }
});

btnLoad.addEventListener("click", async () => {
  const cardsContainer = $("#symptomsCards");
  const preOut = $("#symptomOut");
  
  cardsContainer.innerHTML = "Loading…";
  preOut.style.display = "none";
  
  try {
    const data = await API.symptoms.list();
    
    if (!data || data.length === 0) {
      cardsContainer.innerHTML = '<div class="text-muted">No symptom records found.</div>';
      updatePainChart([]);
      return;
    }
    
    // Render symptom entries as cards
    cardsContainer.innerHTML = data.map(entry => {
      const date = new Date(entry.date).toLocaleDateString();
      const symptoms = entry.symptomDetails || [];
      
      const symptomsHtml = symptoms.length > 0 
        ? symptoms.map(detail => 
            `<div class="mb-2 p-2" style="background: #f8f9fa; border-radius: 4px;">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <strong>${detail.name}</strong>
                  <span class="badge bg-secondary ms-2">${detail.painLevel}/10</span>
                </div>
              </div>
              ${detail.notes ? `<div class="small text-muted mt-1 fst-italic">"${detail.notes}"</div>` : ''}
            </div>`
          ).join('')
        : '<div class="text-muted small">No symptoms recorded</div>';
      
      return `
        <div class="card mb-3">
          <div class="card-header bg-light">
            <h6 class="mb-0">${date}</h6>
          </div>
          <div class="card-body">
            ${symptomsHtml}
          </div>
        </div>
      `;
    }).join('');
    
    // Update the pain chart with the loaded data
    updatePainChart(data);
    
  } catch (err) {
    cardsContainer.innerHTML = `<div class="text-danger">Error: ${err.message}</div>`;
    updatePainChart([]);
  }
});

// Chart instance for pain levels
let painChart = null;

function updatePainChart(symptomData) {
  const ctx = document.getElementById('painChart');
  if (!ctx) return;
  
  // Calculate average pain levels by date
  const painByDate = {};
  
  symptomData.forEach(entry => {
    const date = entry.date;
    const symptoms = entry.symptomDetails || [];
    
    if (symptoms.length > 0) {
      const totalPain = symptoms.reduce((sum, detail) => sum + detail.painLevel, 0);
      const avgPain = totalPain / symptoms.length;
      painByDate[date] = avgPain;
    }
  });
  
  // If no pain data, hide chart
  if (Object.keys(painByDate).length === 0) {
    if (painChart) {
      painChart.destroy();
      painChart = null;
    }
    ctx.style.display = 'none';
    return;
  }
  
  // Sort dates and prepare chart data
  const sortedDates = Object.keys(painByDate).sort();
  const labels = sortedDates.map(date => new Date(date).toLocaleDateString());
  const data = sortedDates.map(date => painByDate[date]);
  
  // Show canvas
  ctx.style.display = 'block';
  
  // Destroy existing chart if it exists
  if (painChart) {
    painChart.destroy();
  }
  
  // Create new chart
  painChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Average Pain Level',
        data: data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: "Average Pain Over Time"
        }
      },
      scales: {
        y: {
          min: 0,
          max: 10
        }
      }
    }
  });
}

// ----- Group Chat -----
const selGroup = document.querySelector("#groupSelect");
const btnReloadGroups = document.querySelector("#btnReloadGroups");
const chatBox = document.querySelector("#chatBox");
const chatOut = document.querySelector("#chatOut");
const chatText = document.querySelector("#chatText");
const btnSend = document.querySelector("#btnSend");
const currentGroupDisplay = document.querySelector("#currentGroupDisplay");

let chatPoll = null;
let currentGroupId = null;
const DEMO_USER_ID = 1;

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  if (messageDate.getTime() === today.getTime()) {
    return `Today ${timeStr}`;
  } else {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.getTime() === yesterday.getTime()) {
      return `Yesterday ${timeStr}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  }
}

function renderMessages(items) {
  if (!Array.isArray(items) || items.length === 0) {
    chatBox.innerHTML = '<div class="muted">No messages yet</div>';
    return;
  }
  
  // Sort messages chronologically (oldest first)
  const sortedMessages = items
    .sort((a,b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0));
  
  let html = '';
  let lastDate = null;
  
  sortedMessages.forEach(m => {
    const messageDate = new Date(m.timestamp || Date.now());
    const currentDate = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    
    // Add day divider if this is a new day
    if (!lastDate || currentDate.getTime() !== lastDate.getTime()) {
      const dateStr = currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      html += `<div class="day-divider"><span>${dateStr}</span></div>`;
      lastDate = currentDate;
    }
    
    const timestamp = formatTimestamp(m.timestamp || Date.now());
    const who = m.username || `User ${m.userId}`;
    const text = m.messageText || m.text || "";
    const isCurrentUser = m.userId === DEMO_USER_ID;
    
    html += `
      <div class="message ${isCurrentUser ? 'user' : 'other'}">
        <div class="message-header">
          <span class="message-username">${who}</span>
          <span class="message-timestamp">${timestamp}</span>
        </div>
        <div class="message-text">${text}</div>
      </div>`;
  });
  
  chatBox.innerHTML = html;
  chatBox.scrollTop = chatBox.scrollHeight; // auto-scroll to bottom
}

async function loadGroups() {
  chatOut.textContent = "Loading groups…";
  try {
    const data = await API.groups.list();
    selGroup.innerHTML = "";
    data.forEach(g => {
      const opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = g.groupName || g.name || `Group ${g.id}`;
      selGroup.appendChild(opt);
    });
    chatOut.textContent = `Loaded ${data.length} groups`;
    if (data.length > 0) {
      selGroup.value = data[0].id;
      currentGroupId = data[0].id;
      updateGroupDisplay(data[0]);
      await loadMessages();
      startPolling();
    }
  } catch (err) {
    chatOut.textContent = "Error loading groups: " + err.message;
  }
}

async function loadMessages() {
  const gid = selGroup.value;
  if (!gid) return;
  currentGroupId = gid;
  chatOut.textContent = "Loading messages…";
  try {
    const items = await API.messages.list(gid);
    renderMessages(items);
    chatOut.textContent = `Loaded ${items.length} messages`;
    
    // Ensure scroll to bottom after loading messages
    setTimeout(() => {
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 50);
  } catch (err) {
    chatOut.textContent = "Error loading messages: " + err.message;
  }
}

async function sendMessage() {
  const gid = currentGroupId ? parseInt(currentGroupId, 10) : parseInt(selGroup.value, 10);
  const text = chatText.value.trim();
  if (!gid || !text) return;
  
  btnSend.disabled = true;
  try {
    await API.messages.create({
      groupId: gid,
      userId: DEMO_USER_ID,
      messageText: text
      // timestamp is set by the server
    });
    
    // Auto-clear the input field after sending
    chatText.value = "";
    
    // Reload messages to show the new message
    await loadMessages();
  } catch (err) {
    chatOut.textContent = "Error sending: " + err.message;
  } finally {
    btnSend.disabled = false;
  }
}

function updateGroupDisplay(group) {
  if (group && currentGroupDisplay) {
    const groupName = group.groupName || group.name || `Group ${group.id}`;
    currentGroupDisplay.textContent = `You're chatting in ${groupName}`;
  }
}

function startPolling() {
  if (chatPoll) clearInterval(chatPoll);
  chatPoll = setInterval(loadMessages, 4000);
}

// Events
btnReloadGroups.addEventListener("click", loadGroups);
selGroup.addEventListener("change", async () => {
  currentGroupId = selGroup.value;
  const selectedGroup = Array.from(selGroup.options).find(opt => opt.value === selGroup.value);
  if (selectedGroup) {
    updateGroupDisplay({ id: selGroup.value, groupName: selectedGroup.textContent });
  }
  await loadMessages();
  startPolling();
});
btnSend.addEventListener("click", sendMessage);

// Handle Enter key in textarea (Enter to send, Shift+Enter for new line)
chatText.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Auto-resize textarea based on content
chatText.addEventListener("input", () => {
  chatText.style.height = "auto";
  chatText.style.height = Math.min(chatText.scrollHeight, 120) + "px";
});

// Auto-load groups on page load
loadGroups();

// ----- Daily Check-in Modal -----
let symptomRowCount = 0;

function createSymptomRow() {
  symptomRowCount++;
  const rowId = `symptomRow${symptomRowCount}`;
  
  return `
    <div class="row mb-3" id="${rowId}">
      <div class="col-md-4">
        <label class="form-label">Symptom Name</label>
        <input type="text" class="form-control" name="symptomName" placeholder="e.g., Headache" required>
      </div>
      <div class="col-md-2">
        <label class="form-label">Pain Level</label>
        <select class="form-select" name="painLevel" required>
          <option value="">Select</option>
          ${Array.from({length: 10}, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
        </select>
      </div>
      <div class="col-md-5">
        <label class="form-label">Notes (Optional)</label>
        <textarea class="form-control" name="notes" rows="1" placeholder="Additional details..."></textarea>
      </div>
      <div class="col-md-1 d-flex align-items-end">
        <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeSymptomRow('${rowId}')">
          ×
        </button>
      </div>
    </div>
  `;
}

function removeSymptomRow(rowId) {
  const row = document.getElementById(rowId);
  if (row) {
    row.remove();
  }
}

function addSymptomRow() {
  const container = document.getElementById('symptomRows');
  container.insertAdjacentHTML('beforeend', createSymptomRow());
}

function initializeModal() {
  const container = document.getElementById('symptomRows');
  container.innerHTML = '';
  symptomRowCount = 0;
  
  // Add 3 default rows
  for (let i = 0; i < 3; i++) {
    addSymptomRow();
  }
}

async function submitDailyCheckin() {
  const rows = document.querySelectorAll('#symptomRows .row');
  const symptoms = [];
  
  // Collect all symptom data
  rows.forEach(row => {
    const nameInput = row.querySelector('input[name="symptomName"]');
    const painSelect = row.querySelector('select[name="painLevel"]');
    const notesTextarea = row.querySelector('textarea[name="notes"]');
    
    const name = nameInput.value.trim();
    const painLevel = painSelect.value;
    const notes = notesTextarea.value.trim();
    
    // Only include rows with symptom name and pain level
    if (name && painLevel) {
      symptoms.push({
        name: name,
        painLevel: parseInt(painLevel, 10),
        notes: notes
      });
    }
  });
  
  if (symptoms.length === 0) {
    showToast("⚠️ Please enter at least one symptom");
    return;
  }
  
  const submitBtn = document.getElementById('submitCheckin');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";
  
  try {
    // Create a single symptom entry for today
    const entry = await API.symptoms.createEntry({
      userId: 1,
      date: new Date().toISOString().split('T')[0]
    });
    
    // Create details for each symptom
    const promises = symptoms.map(symptom => 
      API.symptoms.createDetail({
        symptomEntryId: entry.id,
        name: symptom.name,
        painLevel: symptom.painLevel,
        notes: symptom.notes
      })
    );
    
    await Promise.all(promises);
    
    showToast(`✅ ${symptoms.length} symptoms logged successfully!`);
    
    // Close modal and refresh symptoms
    const modal = bootstrap.Modal.getInstance(document.getElementById('dailyCheckinModal'));
    modal.hide();
    
    // Refresh the symptoms list
    document.getElementById('btnLoadSymptoms').click();
    
  } catch (err) {
    showToast("⚠️ Failed to submit symptoms: " + err.message);
    console.error('Error submitting daily check-in:', err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// Event listeners for modal
document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('dailyCheckinModal');
  const addRowBtn = document.getElementById('addSymptomRow');
  const submitBtn = document.getElementById('submitCheckin');
  
  // Initialize modal when it's shown
  modal.addEventListener('show.bs.modal', initializeModal);
  
  // Add row button
  addRowBtn.addEventListener('click', addSymptomRow);
  
  // Submit button
  submitBtn.addEventListener('click', submitDailyCheckin);
});