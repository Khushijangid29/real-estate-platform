// Visitor Counter

document.addEventListener('DOMContentLoaded', () => {
    trackVisitor();
});

function trackVisitor() {
    // Get or initialize visitor count from localStorage
    let visitCount = localStorage.getItem('visitCount') || 0;
    visitCount = parseInt(visitCount) + 1;
    localStorage.setItem('visitCount', visitCount);
    
    // Update display
    const visitorCountElement = document.getElementById('visitorCount');
    if (visitorCountElement) {
        visitorCountElement.textContent = visitCount;
    }
    
    // Send to server for analytics (optional)
    fetch('http://localhost:3000/api/stats/visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }).catch(err => console.log('Analytics tracking skipped'));
}