class BeforeAfterSlider {
    constructor(container) {
        this.container = container;
        this.slider = container.querySelector('.before-after-slider');
        this.afterImage = container.querySelector('.after');
        this.sliderHandle = container.querySelector('.slider-handle');
        this.isDragging = false;
        this.hasInteracted = false;
        
        this.init();
    }
    
    init() {
        this.slider.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDrag.bind(this));
        
        this.slider.addEventListener('touchstart', this.startDrag.bind(this));
        document.addEventListener('touchmove', this.drag.bind(this));
        document.addEventListener('touchend', this.stopDrag.bind(this));
        
        this.autoSlideOnLoad();
    }
    
    startDrag(e) {
        this.isDragging = true;
        this.slider.classList.add('dragging');
        
        if (!this.hasInteracted) {
            this.hasInteracted = true;
            this.slider.classList.add('interacted');
        }
        
        if (e.type === 'touchstart') {
            e.preventDefault();
        }
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        let clientX;
        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }
        
        const rect = this.slider.getBoundingClientRect();
        let x = clientX - rect.left;
        
        x = Math.max(0, Math.min(x, rect.width));
        
        const percentage = (x / rect.width) * 100;
        
        this.updateSliderPosition(percentage);
    }
    
    stopDrag() {
        this.isDragging = false;
        this.slider.classList.remove('dragging');
    }
    
    updateSliderPosition(percentage) {
        this.afterImage.style.clipPath = `inset(0 0 0 ${percentage}%)`;
        
        this.sliderHandle.style.left = `${percentage}%`;
    }
    
    autoSlideOnLoad() {
        let position = 50;
        let direction = 1;
        let count = 0;
        const maxSlides = 2; 
        
        const animate = () => {
            position += direction * 2;
            
            if (position >= 70 || position <= 30) {
                direction *= -1;
                count++;
            }
            
            if (count < maxSlides * 2) {
                this.updateSliderPosition(position);
                requestAnimationFrame(animate);
            } else {
                this.smoothMoveTo(50, 500);
            }
        };
        
        setTimeout(() => {
            animate();
        }, 500);
    }
    
    smoothMoveTo(targetPosition, duration) {
        const startPosition = parseFloat(this.sliderHandle.style.left) || 50;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();
        
        const easeOutCubic = (t) => {
            return 1 - Math.pow(1 - t, 3);
        };
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            
            const currentPosition = startPosition + (distance * easedProgress);
            this.updateSliderPosition(currentPosition);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const bannerContainer = document.querySelector('.banner-container');
    new BeforeAfterSlider(bannerContainer);
});