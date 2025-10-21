(function(){
  document.addEventListener('DOMContentLoaded', async ()=>{
    const container = document.getElementById('contentArea');
    container.innerHTML = '<p>Loading profile...</p>';

    try {
      const user = await apiGet('/Users/1');
      container.innerHTML = `
        <h3>${user.name}</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Joined:</strong> ${new Date(user.dateJoined).toLocaleDateString()}</p>
      `;
    } catch (err) {
      showToast('Failed to load profile: ' + err.message);
    }
  });
})();