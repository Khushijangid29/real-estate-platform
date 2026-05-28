// Properties Functions

// Sample properties data (for demo - will be replaced with API calls later)
const sampleProperties = [
    {
        id: 1,
        title: 'Beautiful Modern House',
        price: 450000,
        location: 'New York, NY',
        bedrooms: 3,
        bathrooms: 2,
        area_sqft: 2500,
        image: 'https://via.placeholder.com/300x200?text=Property+1',
        featured: true
    },
    {
        id: 2,
        title: 'Cozy Apartment Downtown',
        price: 350000,
        location: 'Los Angeles, CA',
        bedrooms: 2,
        bathrooms: 1,
        area_sqft: 1200,
        image: 'https://via.placeholder.com/300x200?text=Property+2',
        featured: true
    },
    {
        id: 3,
        title: 'Luxury Penthouse',
        price: 850000,
        location: 'Chicago, IL',
        bedrooms: 4,
        bathrooms: 3,
        area_sqft: 3500,
        image: 'https://via.placeholder.com/300x200?text=Property+3',
        featured: true
    },
    {
        id: 4,
        title: 'Commercial Office Space',
        price: 500000,
        location: 'Houston, TX',
        bedrooms: 0,
        bathrooms: 2,
        area_sqft: 2000,
        image: 'https://via.placeholder.com/300x200?text=Property+4',
        featured: false
    }
];

// Load properties on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProperties();
    showOfferPopup();
});

// Load and display properties
function loadProperties() {
    const propertiesGrid = document.getElementById('propertiesGrid');
    
    if (!propertiesGrid) return;
    
    propertiesGrid.innerHTML = sampleProperties.map(property => `
        <div class="property-card">
            <img src="${property.image}" alt="${property.title}">
            <div class="property-card-body">
                <div class="property-price">$${property.price.toLocaleString()}</div>
                <div class="property-title">${property.title}</div>
                <div class="property-location">📍 ${property.location}</div>
                <div class="property-details">
                    ${property.bedrooms > 0 ? `<span>🛏️ ${property.bedrooms} BD</span>` : ''}
                    <span>🚿 ${property.bathrooms} BA</span>
                    <span>📐 ${property.area_sqft.toLocaleString()} sqft</span>
                </div>
                <div class="property-actions">
                    <button class="btn-small btn-view" onclick="viewProperty(${property.id})">View</button>
                    <button class="btn-small btn-favorite" onclick="addToFavorites(${property.id})">❤️ Save</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter properties
async function filterProperties() {
    const city = document.getElementById('city').value;
    const priceMin = parseInt(document.getElementById('priceMin').value) || 0;
    const priceMax = parseInt(document.getElementById('priceMax').value) || Infinity;
    const bedrooms = parseInt(document.getElementById('bedrooms').value) || 0;
    
    // Filter from sample data (in production, this would call the API)
    const filtered = sampleProperties.filter(property => {
        return (!city || property.location.includes(city)) &&
               property.price >= priceMin &&
               property.price <= priceMax &&
               (bedrooms === 0 || property.bedrooms >= bedrooms);
    });
    
    const propertiesGrid = document.getElementById('propertiesGrid');
    
    if (filtered.length === 0) {
        propertiesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No properties found matching your criteria.</p>';
        return;
    }
    
    propertiesGrid.innerHTML = filtered.map(property => `
        <div class="property-card">
            <img src="${property.image}" alt="${property.title}">
            <div class="property-card-body">
                <div class="property-price">$${property.price.toLocaleString()}</div>
                <div class="property-title">${property.title}</div>
                <div class="property-location">📍 ${property.location}</div>
                <div class="property-details">
                    ${property.bedrooms > 0 ? `<span>🛏️ ${property.bedrooms} BD</span>` : ''}
                    <span>🚿 ${property.bathrooms} BA</span>
                    <span>📐 ${property.area_sqft.toLocaleString()} sqft</span>
                </div>
                <div class="property-actions">
                    <button class="btn-small btn-view" onclick="viewProperty(${property.id})">View</button>
                    <button class="btn-small btn-favorite" onclick="addToFavorites(${property.id})">❤️ Save</button>
                </div>
            </div>
        </div>
    `).join('');
}

// View property details
function viewProperty(propertyId) {
    const property = sampleProperties.find(p => p.id === propertyId);
    if (property) {
        alert(`📍 ${property.title}\n💰 $${property.price.toLocaleString()}\n📍 ${property.location}\n\nMore details coming soon!`);
    }
}

// Add to favorites
function addToFavorites(propertyId) {
    const property = sampleProperties.find(p => p.id === propertyId);
    if (property) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (!favorites.find(fav => fav.id === propertyId)) {
            favorites.push(property);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert(`✅ ${property.title} added to favorites!`);
        } else {
            alert('⚠️ Already in favorites!');
        }
    }
}

// Show latest offer popup
function showOfferPopup() {
    setTimeout(() => {
        const offerPopup = document.getElementById('offerPopup');
        const offerContent = document.getElementById('offerContent');
        
        if (!offerPopup) return;
        
        // Sample offer
        const offer = {
            title: 'Summer Sale!',
            description: 'Get 15% discount on all properties',
            discount: '15% OFF',
            image: 'https://via.placeholder.com/300x200?text=Summer+Sale'
        };
        
        offerContent.innerHTML = `
            <img src="${offer.image}" alt="Offer">
            <h3>${offer.title}</h3>
            <p>${offer.description}</p>
            <div class="discount">${offer.discount}</div>
            <button class="claim-btn" onclick="claimOffer()">Claim Offer</button>
        `;
        
        offerPopup.style.display = 'flex';
    }, 2000);
}

// Close offer popup
function closeOfferPopup() {
    document.getElementById('offerPopup').style.display = 'none';
}

// Claim offer
function claimOffer() {
    alert('✅ Offer claimed! Check your email for details.');
    closeOfferPopup();
}