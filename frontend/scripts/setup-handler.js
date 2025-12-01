document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('SetupForm');
    const errorDiv = document.getElementById('loginError');
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Verhindert, dass das Formular die Seite neu lädt
        errorDiv.textContent = ''; // Alte Fehler löschen
        // Formularwerte auslesen
        const data = {
            companyName: document.getElementById('company-name').value.trim(),
            companyDesc: document.getElementById('company-desc').value.trim(),
            userAbbr: document.getElementById('user-abbr').value.trim(),
            firstname: document.getElementById('firstname').value.trim(),
            surname: document.getElementById('surname').value.trim(),
            role: document.getElementById('role').value.trim(),
            password: document.getElementById('password').value,
            passwordRepeat: document.getElementById('password-repeat').value
        };
        // Passwort-Matching prüfen
        if (data.password !== data.passwordRepeat) {
            errorDiv.textContent = "Passwords do not match!";
            return;
        }
        try {
            const response = await fetch('/api/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.success) {
                // Setup erfolgreich, Company-ID anzeigen und Hinweis geben
                try {
                    if (result.companyId) {
                        alert(`Your company has been created.\n\nCompany ID: ${result.companyId}\n\nPlease write this ID down carefully – you will need it to add users later.`);
                    } else {
                        alert('Your company has been created. Please remember the Company ID that was assigned in the system.');
                    }
                } catch (_) {}
                // Weiterleitung zum Dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Fehler vom Server anzeigen
                errorDiv.textContent = result.message || "An unknown error occurred";
            }
        } catch (err) {
            console.error('Setup request failed:', err);
            errorDiv.textContent = "Failed to send setup request. Please try again.";
        }
    });
});