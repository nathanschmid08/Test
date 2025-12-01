const form = document.getElementById('CreateUserForm');
const msgEl = document.getElementById('createUserMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msgEl.textContent = '';
    const companyId = document.getElementById('companyId').value.trim();
    const role = document.getElementById('role').value.trim();
    const firstname = document.getElementById('firstname').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ companyId, role, firstname, surname, username, password })
        });

        const data = await res.json();
        if (res.ok && data.success) {
            msgEl.textContent = data.message || 'User created successfully.';
            msgEl.style.color = 'green';
            form.reset();
        } else {
            msgEl.textContent = data.message || 'Failed to create user.';
            msgEl.style.color = 'red';
        }
    } catch (err) {
        console.error('Create user request failed', err);
        msgEl.textContent = 'Network or server error.';
        msgEl.style.color = 'red';
    }
});
