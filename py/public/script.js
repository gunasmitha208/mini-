// API base URL
const API_URL = '';

// Fetch visitor stats on page load
async function fetchVisitorStats() {
    try {
        const response = await fetch(`${API_URL}/api/stats`);
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('visitorCount').textContent = data.visitors;
        }
    } catch (error) {
        console.error('Error fetching visitor stats:', error);
    }
}

// Handle contact form submission
async function handleContactSubmit(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const formResponse = document.getElementById('formResponse');
    
    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validate
    if (!name || !email || !message) {
        showResponse('Please fill in all fields.', 'error');
        return;
    }
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
        const response = await fetch(`${API_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, message })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showResponse(data.message, 'success');
            // Clear form
            document.getElementById('contactForm').reset();
        } else {
            showResponse(data.error || 'Something went wrong. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showResponse('Failed to send message. Please try again later.', 'error');
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
}

// Show response message
function showResponse(message, type) {
    const formResponse = document.getElementById('formResponse');
    formResponse.textContent = message;
    formResponse.className = 'form-response ' + type;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        formResponse.className = 'form-response';
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Fetch visitor stats
    fetchVisitorStats();
    
    // Add form submit listener
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});
