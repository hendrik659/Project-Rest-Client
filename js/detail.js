// Get photo ID from URL parameters
function getPhotoIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
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

// Load photo detail from Unsplash API
async function loadPhotoDetail() {
  const photoId = getPhotoIdFromUrl();
  
  if (!photoId) {
    showError('ID foto tidak ditemukan. Silakan kembali ke halaman utama.');
    return;
  }

  // Get access key from config.js (should be available globally)
  if (typeof accessKey === 'undefined' || !accessKey) {
    showError('Access key tidak ditemukan. Pastikan config.js sudah dimuat.');
    return;
  }

  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const detailEl = document.getElementById('photo-detail');

  try {
    loadingEl.style.display = 'flex';
    errorEl.style.display = 'none';
    detailEl.style.display = 'none';

    const endpoint = `https://api.unsplash.com/photos/${photoId}`;
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Client-ID ${accessKey}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Foto tidak ditemukan.');
      }
      const errText = await response.text();
      throw new Error(`API error ${response.status}: ${errText}`);
    }

    const photo = await response.json();

    // Populate photo detail
    displayPhotoDetail(photo);

    loadingEl.style.display = 'none';
    detailEl.style.display = 'block';

  } catch (error) {
    console.error('Error loading photo detail:', error);
    loadingEl.style.display = 'none';
    showError(error.message || 'Gagal memuat detail foto. Silakan coba lagi.');
  }
}

// Display photo detail information
function displayPhotoDetail(photo) {
  // Image
  const photoImage = document.getElementById('photo-image');
  if (photo.urls && photo.urls.regular) {
    photoImage.src = photo.urls.regular;
    photoImage.alt = photo.alt_description || photo.description || 'Photo';
  }

  // Download link
  const downloadLink = document.getElementById('download-link');
  if (photo.links && photo.links.download) {
    downloadLink.href = photo.links.download;
  } else if (photo.urls && photo.urls.full) {
    downloadLink.href = photo.urls.full;
  }

  // Title
  const photoTitle = document.getElementById('photo-title');
  photoTitle.textContent = photo.alt_description || photo.description || 'Untitled Photo';

  // Description
  const photoDescription = document.getElementById('photo-description');
  if (photo.description) {
    photoDescription.textContent = photo.description;
    photoDescription.style.display = 'block';
  } else {
    photoDescription.style.display = 'none';
  }

  // Author
  const photoAuthor = document.getElementById('photo-author');
  if (photo.user) {
    photoAuthor.textContent = photo.user.name || 'Unknown';
  }

  // Date
  const photoDate = document.getElementById('photo-date');
  photoDate.textContent = formatDate(photo.created_at);

  // Views
  const photoViews = document.getElementById('photo-views');
  photoViews.textContent = formatNumber(photo.views || 0);

  // Likes
  const photoLikes = document.getElementById('photo-likes');
  photoLikes.textContent = formatNumber(photo.likes || 0);

  // Dimensions
  const photoDimensions = document.getElementById('photo-dimensions');
  if (photo.width && photo.height) {
    photoDimensions.textContent = `${photo.width} × ${photo.height} px`;
  } else {
    photoDimensions.textContent = 'N/A';
  }

  // Tags
  const photoTags = document.getElementById('photo-tags');
  photoTags.innerHTML = '';
  if (photo.tags && Array.isArray(photo.tags) && photo.tags.length > 0) {
    photo.tags.forEach(tag => {
      const tagEl = document.createElement('span');
      tagEl.className = 'tag';
      tagEl.textContent = tag.title || tag;
      photoTags.appendChild(tagEl);
    });
  } else {
    photoTags.style.display = 'none';
  }

  // Unsplash link
  const unsplashLink = document.getElementById('unsplash-link');
  if (photo.links && photo.links.html) {
    unsplashLink.href = photo.links.html;
  } else if (photo.user && photo.user.links && photo.user.links.html) {
    unsplashLink.href = photo.user.links.html;
  }
}

// Show error message
function showError(message) {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const detailEl = document.getElementById('photo-detail');

  loadingEl.style.display = 'none';
  detailEl.style.display = 'none';
  errorEl.style.display = 'flex';
  
  const errorMessage = errorEl.querySelector('p');
  if (errorMessage) {
    errorMessage.textContent = message;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadPhotoDetail);
} else {
  loadPhotoDetail();
}

