(function () {
  const trendingGrid = document.getElementById('trendingGallery');
  const trendingStatus = document.getElementById('trendingStatus');
  const accessKey = window.UNSPLASH_ACCESS_KEY || '';

  if (!trendingGrid || !trendingStatus) {
    return;
  }

  function setStatus(message, isError = false) {
    trendingStatus.classList.toggle('error', isError);
    trendingStatus.innerHTML = `
      ${isError ? '<i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>' : '<div class="spinner-border text-primary" role="status" aria-hidden="true"></div>'}
      <span class="status-text">${message}</span>
    `;
    trendingStatus.style.display = 'flex';
  }

  function clearStatus() {
    trendingStatus.style.display = 'none';
  }

  function renderTrending(photos) {
    trendingGrid.innerHTML = '';

    if (!Array.isArray(photos) || photos.length === 0) {
      setStatus('Belum ada foto trending yang bisa ditampilkan.', true);
      return;
    }

    clearStatus();

    photos.forEach(photo => {
      const photographerName = photo?.user?.name || 'Fotografer tidak diketahui';
      const profileImage = photo?.user?.profile_image?.medium || '';
      const imageSrc = photo?.urls?.regular || photo?.urls?.small || '';
      const altText = photo?.alt_description || photo?.description || 'Trending photo';

      const card = document.createElement('article');
      card.className = 'trending-card';

      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'trending-image-wrapper';

      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = altText;
      img.loading = 'lazy';

      imageWrapper.appendChild(img);

      const cardBody = document.createElement('div');
      cardBody.className = 'trending-card-body';

      const photographerMeta = document.createElement('div');
      photographerMeta.className = 'photographer-meta';

      if (profileImage) {
        const avatar = document.createElement('img');
        avatar.src = profileImage;
        avatar.alt = photographerName;
        avatar.loading = 'lazy';
        photographerMeta.appendChild(avatar);
      } else {
        const placeholder = document.createElement('div');
        placeholder.className = 'photographer-avatar-placeholder';
        placeholder.textContent = photographerName.charAt(0).toUpperCase();
        photographerMeta.appendChild(placeholder);
      }

      const photographerInfo = document.createElement('div');
      photographerInfo.innerHTML = `
        <span class="label">Photographer</span>
        <div class="name">${photographerName}</div>
      `;

      photographerMeta.appendChild(photographerInfo);

      const photoTitle = document.createElement('p');
      photoTitle.className = 'photo-title';
      photoTitle.textContent = altText;

      const actions = document.createElement('div');
      actions.className = 'photo-actions';

      const detailLink = document.createElement('a');
      detailLink.href = `detail.html?id=${photo.id}`;
      detailLink.className = 'btn-detail';
      detailLink.textContent = 'Lihat Detail';

      const unsplashLink = document.createElement('a');
      unsplashLink.href = photo?.links?.html || photo?.urls?.full || '#';
      unsplashLink.target = '_blank';
      unsplashLink.rel = 'noopener noreferrer';
      unsplashLink.className = 'btn-unsplash';
      unsplashLink.textContent = 'Buka di Unsplash';

      actions.appendChild(detailLink);
      actions.appendChild(unsplashLink);

      cardBody.appendChild(photographerMeta);
      cardBody.appendChild(photoTitle);
      cardBody.appendChild(actions);

      card.appendChild(imageWrapper);
      card.appendChild(cardBody);

      trendingGrid.appendChild(card);
    });
  }

  async function loadTrendingPhotos() {
    if (!accessKey) {
      setStatus('Access key Unsplash tidak ditemukan di config.js.', true);
      return;
    }

    setStatus('Memuat foto trending dari Unsplash...');

    try {
      const endpoint = 'https://api.unsplash.com/photos?order_by=popular&per_page=24';
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Client-ID ${accessKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Unsplash API error ${response.status}`);
      }

      const data = await response.json();
      renderTrending(data);
    } catch (error) {
      console.error('Failed to load trending photos:', error);
      setStatus('Gagal memuat foto trending. Silakan coba lagi.', true);
    }
  }

  loadTrendingPhotos();
})();

