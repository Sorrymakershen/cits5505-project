// 拖拽排序功能
function initDraggable() {
    const containers = document.querySelectorAll('.draggable-container');
    
    containers.forEach(container => {
        new Sortable(container, {
            animation: 150,
            ghostClass: 'dragging',
            dragClass: 'dragging',
            onEnd: function(evt) {
                saveOrder(container);
            }
        });
    });
}

// 展开/折叠功能
function initCollapsible() {
    document.querySelectorAll('.collapsible-trigger').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isExpanded = content.classList.contains('expanded');
            
            content.classList.toggle('expanded');
            trigger.setAttribute('aria-expanded', !isExpanded);
        });
    });
}

// 滑动解锁功能
function initSliderUnlock() {
    const slider = document.querySelector('.slider-unlock');
    const handle = slider.querySelector('.slider-handle');
    let isDragging = false;
    let startX;
    let sliderLeft;

    handle.addEventListener('touchstart', initDrag);
    handle.addEventListener('mousedown', initDrag);

    function initDrag(e) {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
        sliderLeft = handle.offsetLeft;
    }

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);

    function drag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
        const walk = x - startX;
        const newLeft = Math.max(0, Math.min(sliderLeft + walk, slider.offsetWidth - handle.offsetWidth));
        
        handle.style.left = `${newLeft}px`;
        
        if (newLeft > slider.offsetWidth * 0.8) {
            unlockSuccessful();
        }
    }
}

// 图片懒加载
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// 鼠标跟随效果
function initCursorFollower() {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-follower');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', e => {
        cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
    });
}

// 视差滚动效果
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    initDraggable();
    initCollapsible();
    initSliderUnlock();
    initLazyLoading();
    initCursorFollower();
    initParallax();
    
    // 平滑滚动
    document.documentElement.style.scrollBehavior = 'smooth';
});
