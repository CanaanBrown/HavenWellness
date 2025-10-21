(function(){
  document.addEventListener('DOMContentLoaded', () => {
    // Wire up all the buttons and forms
    const btnSeed = document.getElementById('btnSeed');
    const btnUsers = document.getElementById('btnUsers');
    const formUser = document.getElementById('formUser');
    const formSymptom = document.getElementById('formSymptom');
    const btnLoadSymptoms = document.getElementById('btnLoadSymptoms');
    const dailyCheckinBtn = document.getElementById('dailyCheckinBtn');
    const btnReloadGroups = document.getElementById('btnReloadGroups');
    const groupSelect = document.getElementById('groupSelect');
    const btnSend = document.getElementById('btnSend');
    const chatText = document.getElementById('chatText');

    if (btnSeed) btnSeed.addEventListener('click', loadSeedCounts);
    if (btnUsers) btnUsers.addEventListener('click', loadUsers);
    if (formUser) formUser.addEventListener('submit', createUser);
    if (formSymptom) formSymptom.addEventListener('submit', addSymptom);
    if (btnLoadSymptoms) btnLoadSymptoms.addEventListener('click', loadSymptoms);
    if (dailyCheckinBtn) dailyCheckinBtn.addEventListener('click', showDailyCheckin);
    if (btnReloadGroups) btnReloadGroups.addEventListener('click', loadGroups);
    if (btnSend) btnSend.addEventListener('click', sendMessage);
    if (chatText) chatText.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Initial loads
    loadSeedCounts();
    loadUsers();
    loadSymptoms();
    loadGroups();
  });

  async function loadSeedCounts() {
    try {
      const output = document.getElementById('seedOut');
      output.textContent = 'Loading...';
      
      const [users, symptoms, groups] = await Promise.all([
        apiGet('/Users?page=1&pageSize=1'),
        apiGet('/Symptoms?page=1&pageSize=1'),
        apiGet('/Groups?page=1&pageSize=1')
      ]);
      
      const counts = {
        users: users?.length || 0,
        symptoms: symptoms?.length || 0,
        groups: groups?.length || 0
      };
      
      output.textContent = JSON.stringify(counts, null, 2);
    } catch (err) {
      showToast('Failed to load seed counts: ' + err.message);
    }
  }

  async function loadUsers() {
    try {
      const output = document.getElementById('usersOut');
      output.textContent = 'Loading...';
      
      const users = await apiGet('/Users?page=1&pageSize=50');
      output.textContent = JSON.stringify(users, null, 2);
    } catch (err) {
      showToast('Failed to load users: ' + err.message);
    }
  }

  async function createUser(e) {
    e.preventDefault();
    try {
      const output = document.getElementById('createOut');
      output.textContent = 'Creating...';
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      const user = await apiPost('/Users', { name, email, password });
      output.textContent = JSON.stringify(user, null, 2);
      document.getElementById('formUser').reset();
    } catch (err) {
      showToast('Failed to create user: ' + err.message);
    }
  }

  async function addSymptom(e) {
    e.preventDefault();
    try {
      const symptomName = document.getElementById('symptomName').value;
      const painLevel = Number(document.getElementById('painLevel').value);
      const notes = document.getElementById('notes').value;
      
      if (!symptomName || !painLevel) {
        showToast('Please provide symptom name and pain level');
        return;
      }
      
      // Create symptom entry for today
      const today = new Date().toISOString().split('T')[0];
      const entry = await apiPost('/Symptoms', { userId: 1, date: today });
      
      // Add symptom detail
      const detail = await apiPost('/Symptoms/details', {
        symptomEntryId: entry.id,
        name: symptomName,
        painLevel,
        notes
      });
      
      document.getElementById('formSymptom').reset();
      loadSymptoms();
    } catch (err) {
      showToast('Failed to add symptom: ' + err.message);
    }
  }

  async function loadSymptoms() {
    try {
      const output = document.getElementById('symptomOut');
      output.textContent = 'Loading...';
      
      const symptoms = await apiGet('/Symptoms?userId=1&page=1&pageSize=50');
      output.textContent = JSON.stringify(symptoms, null, 2);
      output.style.display = 'block';
    } catch (err) {
      showToast('Failed to load symptoms: ' + err.message);
    }
  }

  function showDailyCheckin() {
    showToast('Daily check-in feature coming soon!');
  }

  async function loadGroups() {
    try {
      const groups = await apiGet('/Groups?page=1&pageSize=50');
      const select = document.getElementById('groupSelect');
      
      select.innerHTML = '<option value="">Select a group...</option>';
      groups.forEach(group => {
        const option = document.createElement('option');
        option.value = group.id;
        option.textContent = group.groupName;
        select.appendChild(option);
      });
      
      select.addEventListener('change', (e) => {
        if (e.target.value) {
          loadGroupMessages(e.target.value);
        } else {
          document.getElementById('chatBox').innerHTML = '<div style="color:#6b7280; font-size: 0.92rem;">Select a group to load messages…</div>';
        }
      });
    } catch (err) {
      showToast('Failed to load groups: ' + err.message);
    }
  }

  async function loadGroupMessages(groupId) {
    try {
      const messages = await apiGet(`/Groups/${groupId}/messages?page=1&pageSize=50`);
      const chatBox = document.getElementById('chatBox');
      
      if (messages.length === 0) {
        chatBox.innerHTML = '<div style="color:#6b7280; font-size: 0.92rem;">No messages yet. Be the first to start the conversation!</div>';
        return;
      }
      
      // Group messages by date
      const groupedMessages = {};
      messages.forEach(msg => {
        const date = new Date(msg.timestamp).toLocaleDateString();
        if (!groupedMessages[date]) {
          groupedMessages[date] = [];
        }
        groupedMessages[date].push(msg);
      });
      
      let html = '';
      Object.keys(groupedMessages).sort().forEach(date => {
        html += `<div class="day-divider" style="text-align: center; margin: 16px 0; color: #9ca3af; font-size: 0.8rem; position: relative;"><span style="background: #fafafa; padding: 0 12px; position: relative; z-index: 2;">${date}</span></div>`;
        
        groupedMessages[date].forEach(msg => {
          const isUser = msg.userId === 1; // Demo user
          const time = new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
          
          html += `
            <div class="message ${isUser ? 'user' : 'other'}" style="margin-bottom: 12px; padding: 8px 12px; border-radius: 12px; max-width: 80%; word-wrap: break-word; ${isUser ? 'background: #dbeafe; margin-left: auto; border-bottom-right-radius: 4px;' : 'background: #f3f4f6; margin-right: auto; border-bottom-left-radius: 4px;'}">
              <div class="message-header" style="margin-bottom: 4px;">
                <span class="message-username" style="font-weight: bold; font-size: 0.9rem;">User ${msg.userId}</span>
                <span class="message-timestamp" style="font-size: 0.75rem; color: #6b7280; margin-left: 8px;">${time}</span>
              </div>
              <div class="message-text" style="font-size: 0.9rem; line-height: 1.4;">${msg.message}</div>
            </div>
          `;
        });
      });
      
      chatBox.innerHTML = html;
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (err) {
      showToast('Failed to load messages: ' + err.message);
    }
  }

  async function sendMessage() {
    const groupSelect = document.getElementById('groupSelect');
    const chatText = document.getElementById('chatText');
    
    if (!groupSelect.value) {
      showToast('Please select a group first');
      return;
    }
    
    if (!chatText.value.trim()) {
      showToast('Please enter a message');
      return;
    }
    
    try {
      await apiPost(`/Groups/${groupSelect.value}/messages`, {
        userId: 1, // Demo user
        message: chatText.value.trim()
      });
      
      chatText.value = '';
      loadGroupMessages(groupSelect.value);
    } catch (err) {
      showToast('Failed to send message: ' + err.message);
    }
  }
})();