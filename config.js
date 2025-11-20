const categories = document.querySelectorAll('.category-btn');
    categories.forEach(btn => {
      btn.addEventListener('click', () => {
        categories.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Top nav click handling: toggle active class
    const navItems = document.querySelectorAll('.top-nav .nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        if (item.dataset && item.dataset.nav === 'home') {
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

        const galleryContainer = document.getElementById('gallery');
        galleryContainer.innerHTML = '';

        if (!Array.isArray(data) || data.length === 0) {
          galleryContainer.innerHTML = '<div class="gallery-empty">No photos returned from Unsplash.</div>';
          return;
        }

        data.forEach(photo => {
          const item = document.createElement('div');
          item.className = 'gallery-item';

          const img = document.createElement('img');
          img.src = photo.urls && photo.urls.small ? photo.urls.small : '';
          img.alt = photo.alt_description || photo.description || 'Unsplash photo';

          item.appendChild(img);
          galleryContainer.appendChild(item);
        });
      } catch (error) {
        console.error('Error loading photos:', error);
        const galleryContainer = document.getElementById('gallery');
        if (galleryContainer) galleryContainer.innerHTML = `<div class="gallery-empty text-danger">Failed to load photos. Check console for details.</div>`;
      }
    }

    loadPhotos();