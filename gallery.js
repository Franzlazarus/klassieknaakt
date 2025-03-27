document.addEventListener('DOMContentLoaded', function() {
    // Select gallery elements
    const galleryGrid = document.querySelector('.gallery-grid');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    
    // Exit if elements don't exist
    if (!galleryGrid || !galleryItems.length) {
        console.error('Gallery elements not found');
        return;
    }
    
    // Create fullscreen viewer
    const fullscreen = document.createElement('div');
    fullscreen.className = 'gallery-fullscreen';
    fullscreen.innerHTML = `
        <button class="gallery-fullscreen-close">&times;</button>
        <img class="gallery-fullscreen-image" src="" alt="Full-size image">
    `;
    document.body.appendChild(fullscreen);
    
    const fullscreenImage = fullscreen.querySelector('.gallery-fullscreen-image');
    const closeBtn = fullscreen.querySelector('.gallery-fullscreen-close');
    
    // Add click event to each gallery item for fullscreen view
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        
        item.addEventListener('click', () => {
            if (img) {
                fullscreenImage.src = img.src;
                fullscreen.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close fullscreen view
    closeBtn.addEventListener('click', () => {
        fullscreen.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    // Also close on click outside the image
    fullscreen.addEventListener('click', (e) => {
        if (e.target === fullscreen) {
            fullscreen.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Set up pagination/navigation
    if (prevBtn && nextBtn) {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Mobile slideshow functionality
            let currentIndex = 0;
            let isNavigating = false; // Flag to prevent rapid consecutive clicks
            
            // Initially show only the first item on mobile
            galleryItems.forEach((item, index) => {
                if (index !== 0) {
                    item.style.display = 'none';
                }
            });
            
            // Navigation function
            function navigate(direction) {
                // If already in transition, return early
                if (isNavigating) return;
                
                isNavigating = true;
                
                // Hide current item immediately
                galleryItems[currentIndex].style.display = 'none';
                
                // Update index
                currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
                
                // Show new item immediately
                galleryItems[currentIndex].style.display = 'block';
                
                // Reset navigation flag immediately
                isNavigating = false;
            }
            
            // Simple direct click handlers
            prevBtn.addEventListener('click', function(e) {
                navigate(-1);
            });
            
            nextBtn.addEventListener('click', function(e) {
                navigate(1);
            });
        } else {
            // Desktop navigation - simplified for better performance
            const scrollAmount = 300; // Adjust based on your item width
            
            prevBtn.addEventListener('click', function(e) {
                // Direct action without state variables
                galleryGrid.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            });
            
            nextBtn.addEventListener('click', function(e) {
                // Direct action without state variables
                galleryGrid.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // Handle touch events for mobile
    let touchStartX;
    const isMobile = window.innerWidth < 768;
    
    galleryGrid.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    galleryGrid.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchStartX - touchEndX;
        
        // Swipe detection
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swiped left - go forward
                if (isMobile) {
                    navigate(1);
                } else {
                    nextBtn.click();
                }
            } else {
                // Swiped right - go back
                if (isMobile) {
                    navigate(-1);
                } else {
                    prevBtn.click();
                }
            }
        }
    }, { passive: true });
    
    // Add some basic styles for the fullscreen view
    // These are minimal and necessary for functionality
    fullscreen.style.display = 'none';
    fullscreen.style.position = 'fixed';
    fullscreen.style.top = '0';
    fullscreen.style.left = '0';
    fullscreen.style.width = '100%';
    fullscreen.style.height = '100%';
    fullscreen.style.backgroundColor = 'rgba(0,0,0,0.9)';
    fullscreen.style.zIndex = '9999';
    fullscreen.style.alignItems = 'center';
    fullscreen.style.justifyContent = 'center';
    
    // Style the close button and fullscreen image
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '30px';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    
    fullscreenImage.style.maxWidth = '90%';
    fullscreenImage.style.maxHeight = '90%';
    fullscreenImage.style.objectFit = 'contain';
});