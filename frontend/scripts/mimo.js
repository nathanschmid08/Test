document.addEventListener('DOMContentLoaded', () => {
    const askMimoBtn = document.getElementById('askMimoBtn');
    const mimoChatOverlay = document.getElementById('mimoChatOverlay');
    const mimoChatCloseBtn = document.getElementById('mimoChatCloseBtn');
    const mimoChatForm = document.getElementById('mimoChatForm');
    const mimoChatInput = document.getElementById('mimoChatInput');
    const mimoChatBody = document.getElementById('mimoChatBody');
    const mimoChatSendBtn = document.getElementById('mimoChatSendBtn');

    // Open chat popup
    if (askMimoBtn) {
        askMimoBtn.addEventListener('click', () => {
            if (mimoChatOverlay) {
                mimoChatOverlay.classList.remove('mimo-chat-hidden');
                mimoChatOverlay.setAttribute('aria-hidden', 'false');
                // Focus on input when opening
                setTimeout(() => {
                    if (mimoChatInput) {
                        mimoChatInput.focus();
                    }
                }, 100);
            }
        });
    }

    // Close chat popup
    if (mimoChatCloseBtn) {
        mimoChatCloseBtn.addEventListener('click', () => {
            closeChatPopup();
        });
    }

    // Close on overlay click (outside the modal)
    if (mimoChatOverlay) {
        mimoChatOverlay.addEventListener('click', (e) => {
            if (e.target === mimoChatOverlay) {
                closeChatPopup();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mimoChatOverlay && !mimoChatOverlay.classList.contains('mimo-chat-hidden')) {
            closeChatPopup();
        }
    });

    function closeChatPopup() {
        if (mimoChatOverlay) {
            mimoChatOverlay.classList.add('mimo-chat-hidden');
            mimoChatOverlay.setAttribute('aria-hidden', 'true');
        }
    }

    // Add user message to chat
    function addUserMessage(text) {
        if (!mimoChatBody) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'mimo-message mimo-message-user';
        messageDiv.innerHTML = `
            <div class="mimo-message-content">
                <p>${escapeHtml(text)}</p>
            </div>
            <div class="mimo-message-avatar">
                <i class="ri-user-3-fill"></i>
            </div>
        `;
        mimoChatBody.appendChild(messageDiv);
        scrollToBottom();
    }

    // Add bot message to chat
    function addBotMessage(text) {
        if (!mimoChatBody) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'mimo-message mimo-message-bot';
        messageDiv.innerHTML = `
            <div class="mimo-message-avatar">
                <i class="ri-robot-3-fill"></i>
            </div>
            <div class="mimo-message-content">
                <p>${escapeHtml(text)}</p>
            </div>
        `;
        mimoChatBody.appendChild(messageDiv);
        scrollToBottom();
    }

    // Add loading indicator
    function addLoadingIndicator() {
        if (!mimoChatBody) return;

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'mimo-message mimo-message-bot mimo-loading';
        loadingDiv.id = 'mimoLoadingIndicator';
        loadingDiv.innerHTML = `
            <div class="mimo-message-avatar">
                <i class="ri-robot-3-fill"></i>
            </div>
            <div class="mimo-message-content">
                <div class="mimo-loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        mimoChatBody.appendChild(loadingDiv);
        scrollToBottom();
    }

    // Remove loading indicator
    function removeLoadingIndicator() {
        const loadingIndicator = document.getElementById('mimoLoadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    // Scroll chat to bottom
    function scrollToBottom() {
        if (mimoChatBody) {
            mimoChatBody.scrollTop = mimoChatBody.scrollHeight;
        }
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Handle form submission
    if (mimoChatForm) {
        mimoChatForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const question = mimoChatInput.value.trim();
            if (!question) return;

            // Add user message
            addUserMessage(question);

            // Clear input
            mimoChatInput.value = '';
            mimoChatInput.disabled = true;
            if (mimoChatSendBtn) {
                mimoChatSendBtn.disabled = true;
            }

            // Add loading indicator
            addLoadingIndicator();

            try {
                const response = await fetch('/api/chatbot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ question })
                });

                const result = await response.json();

                // Remove loading indicator
                removeLoadingIndicator();

                if (result.success) {
                    addBotMessage(result.answer);
                } else {
                    addBotMessage('Sorry, I encountered an error. Please try again.');
                }
            } catch (err) {
                console.error('Chatbot request failed:', err);
                removeLoadingIndicator();
                addBotMessage('Sorry, I could not connect to the server. Please check your connection and try again.');
            } finally {
                // Re-enable input
                mimoChatInput.disabled = false;
                if (mimoChatSendBtn) {
                    mimoChatSendBtn.disabled = false;
                }
                mimoChatInput.focus();
            }
        });
    }
});

