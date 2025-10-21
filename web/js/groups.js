(function(){
  document.addEventListener('DOMContentLoaded', ()=>{
    const container = document.getElementById('contentArea');
    container.innerHTML = `
      <h2>Groups</h2>
      <button id="loadGroups">Load Groups</button>
      <ul id="groupList"></ul>
    `;

    document.getElementById('loadGroups').addEventListener('click', loadGroups);

    async function loadGroups() {
      try {
        const groups = await apiGet('/Groups?page=1&pageSize=50');
        const list = document.getElementById('groupList');
        if (groups.length === 0) {
          list.innerHTML = '<li>No groups found</li>';
        } else {
          list.innerHTML = groups.map(g => `<li>${g.groupName}</li>`).join('');
        }
      } catch (err) {
        showToast('Failed to load groups: ' + err.message);
      }
    }
  });
})();