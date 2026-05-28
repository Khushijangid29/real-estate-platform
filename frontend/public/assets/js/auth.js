// Authentication Functions

// Show Login Modal
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'flex';
}

// Close Login Modal
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

// Show Register Modal
function showRegisterModal() {
    document.getElementById('registerModal').style.display = 'flex';
}

// Close Register Modal
function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            alert('✅ Login successful!');
            closeLoginModal();
            window.location.reload();
        } else {
            alert('❌ ' + data.error);
        }
    } catch (error) {
        alert('❌ Error: ' + error.message);
    }
}

// Handle Register
async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const phone = document.getElementById('registerPhone').value;
    
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phone, userType: 'buyer' })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('✅ Registration successful! Please login.');
            closeRegisterModal();
            showLoginModal();
        } else {
            alert('❌ ' + data.error);
        }
    } catch (error) {
        alert('❌ Error: ' + error.message);
    }
}

// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('✅ Logged out successfully!');
    window.location.reload();
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === registerModal) {
        closeRegisterModal();
    }
});