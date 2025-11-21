const categories = document.querySelectorAll('.category-btn');
categories.forEach(btn => {
  btn.addEventListener('click', () => {
    categories.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Store photos data globally
let photosData = [];

// Top nav click handling: toggle active class
const navItems = document.querySelectorAll('.top-nav .nav-item');
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    
    if (item.dataset && item.dataset.nav === 'home') {
      showGalleryView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item.dataset && item.dataset.nav === 'details') {
      showDetailsView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});
const accessKey = "AQkp7ZUAmpXfH6jXBZ8CbShV8_kmNXLSNL-FweguXzw";

async function loadPhotos() {
  if (!accessKey) {
    console.error('Unsplash access key is missing. Set the `accessKey` variable.');
    return;
  }

  try {
    const endpoint = 'https://api.unsplash.com/photos?per_page=30';
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Client-ID ${accessKey}`
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Unsplash API error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    
    // Store photos data globally
    photosData = data;

    const galleryContainer = document.getElementById('gallery');
    if (!galleryContainer) return; // only render when gallery exists
    
    // Check current view mode
    const activeNav = document.querySelector('.nav-item.active');
    if (activeNav && activeNav.dataset.nav === 'details') {
      showDetailsView();
    } else {
      showGalleryView();
    }
  } catch (error) {
    console.error('Error loading photos:', error);
    const galleryContainer = document.getElementById('gallery');
    if (galleryContainer) galleryContainer.innerHTML = `<div class="gallery-empty text-danger">Failed to load photos. Check console for details.</div>`;
  }
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format number with thousand separator
function formatNumber(num) {
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Show gallery view (thumbnail grid)
function showGalleryView() {
  const galleryContainer = document.getElementById('gallery');
  if (!galleryContainer || !photosData || photosData.length === 0) return;
  
  galleryContainer.className = 'gallery-grid mb-5';
  galleryContainer.innerHTML = '';

  if (!Array.isArray(photosData) || photosData.length === 0) {
    galleryContainer.innerHTML = '<div class="gallery-empty">No photos returned from Unsplash.</div>';
    return;
  }

  photosData.forEach(photo => {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = photo.urls && photo.urls.small ? photo.urls.small : '';
    img.alt = photo.alt_description || photo.description || 'Unsplash photo';
    img.loading = 'lazy';

    item.appendChild(img);

    // wrap each gallery item with a link to detail page
    const link = document.createElement('a');
    link.href = `detail.html?id=${photo.id}`;
    link.title = photo.description || photo.alt_description || 'View details';
    link.appendChild(item);

    galleryContainer.appendChild(link);
  });
}

// Show details view (detailed cards)
function showDetailsView() {
  const galleryContainer = document.getElementById('gallery');
  if (!galleryContainer || !photosData || photosData.length === 0) return;
  
  galleryContainer.className = 'details-grid mb-5';
  galleryContainer.innerHTML = '';

  if (!Array.isArray(photosData) || photosData.length === 0) {
    galleryContainer.innerHTML = '<div class="gallery-empty">No photos returned from Unsplash.</div>';
    return;
  }

  photosData.forEach(photo => {
    const detailCard = document.createElement('div');
    detailCard.className = 'detail-card';

    // Image section
    const imageSection = document.createElement('div');
    imageSection.className = 'detail-card-image';
    const img = document.createElement('img');
    img.src = photo.urls && photo.urls.regular ? photo.urls.regular : (photo.urls && photo.urls.small ? photo.urls.small : '');
    img.alt = photo.alt_description || photo.description || 'Unsplash photo';
    img.loading = 'lazy';
    imageSection.appendChild(img);
    
    // Link wrapper for image
    const imageLink = document.createElement('a');
    imageLink.href = `detail.html?id=${photo.id}`;
    imageLink.appendChild(imageSection);

    // Info section
    const infoSection = document.createElement('div');
    infoSection.className = 'detail-card-info';

    // Title
    const title = document.createElement('h3');
    title.className = 'detail-card-title';
    title.textContent = photo.alt_description || photo.description || 'Untitled Photo';
    infoSection.appendChild(title);

    // Description
    if (photo.description) {
      const description = document.createElement('p');
      description.className = 'detail-card-description';
      description.textContent = photo.description.length > 150 
        ? photo.description.substring(0, 150) + '...' 
        : photo.description;
      infoSection.appendChild(description);
    }

    // Meta information
    const metaSection = document.createElement('div');
    metaSection.className = 'detail-card-meta';

    // Photographer
    if (photo.user) {
      const photographer = document.createElement('div');
      photographer.className = 'detail-meta-item';
      photographer.innerHTML = `<i class="bi bi-person-circle"></i> <span>${photo.user.name || 'Unknown'}</span>`;
      metaSection.appendChild(photographer);
    }

    // Date
    const date = document.createElement('div');
    date.className = 'detail-meta-item';
    date.innerHTML = `<i class="bi bi-calendar3"></i> <span>${formatDate(photo.created_at)}</span>`;
    metaSection.appendChild(date);

    // Likes
    const likes = document.createElement('div');
    likes.className = 'detail-meta-item';
    likes.innerHTML = `<i class="bi bi-heart"></i> <span>${formatNumber(photo.likes || 0)}</span>`;
    metaSection.appendChild(likes);

    // Views
    if (photo.views) {
      const views = document.createElement('div');
      views.className = 'detail-meta-item';
      views.innerHTML = `<i class="bi bi-eye"></i> <span>${formatNumber(photo.views)}</span>`;
      metaSection.appendChild(views);
    }

    infoSection.appendChild(metaSection);

    // View detail button
    const viewButton = document.createElement('a');
    viewButton.href = `detail.html?id=${photo.id}`;
    viewButton.className = 'btn btn-detail-view';
    viewButton.innerHTML = '<i class="bi bi-arrow-right-circle"></i> Lihat Detail';
    infoSection.appendChild(viewButton);

    detailCard.appendChild(imageLink);
    detailCard.appendChild(infoSection);

    galleryContainer.appendChild(detailCard);
  });
}

// Only load gallery on pages that have #gallery
if (document.getElementById('gallery')) {
  loadPhotos();
}