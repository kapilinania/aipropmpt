document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(element => {
        observer.observe(element);
    });

    // 2. Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / height) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + '%';
        }
        
        // Navbar transparency change on scroll
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(9, 9, 11, 0.95)';
            navbar.style.padding = '0.75rem 0';
        } else {
            navbar.style.background = 'rgba(9, 9, 11, 0.8)';
            navbar.style.padding = '1rem 0';
        }
    });

    // 3. Animated Counters
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // lower is faster

    const startCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    
                    const inc = target / speed;
                    
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter); // Only animate once
            }
        });
    };

    const counterObserver = new IntersectionObserver(startCounters, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));

    // 3. FAQ Accordion
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            // Close all other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });


    // 5. Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. Terminal Typing Effect
    const typedPrompt = document.getElementById('typed-prompt');
    const terminalOutput = document.getElementById('terminal-output');
    const prompts = [
        "Write a viral Instagram reel script for a new AI tool...",
        "Create a pas-framework email sequence for a SaaS product...",
        "Generate 10 business ideas for a side hustle in 2024...",
        "Act as a senior copywriter and audit this landing page...",
        "Create a 30-day content calendar for a fitness coach..."
    ];
    let promptIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        if (!typedPrompt) return;
        const currentPrompt = prompts[promptIndex];
        
        if (isDeleting) {
            typedPrompt.innerText = currentPrompt.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedPrompt.innerText = currentPrompt.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 30 : 70;

        if (!isDeleting && charIndex === currentPrompt.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
            terminalOutput.classList.add('visible');
            terminalOutput.innerHTML = `<div class="ai-response" style="color: #94a3b8; font-style: italic; border-left: 2px solid var(--color-primary); padding-left: 10px; margin-top: 10px;">AI: Generating high-quality response based on 500+ premium prompt frameworks... Done!</div>`;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            promptIndex = (promptIndex + 1) % prompts.length;
            typeSpeed = 500;
            terminalOutput.classList.remove('visible');
        }

        setTimeout(typeEffect, typeSpeed);
    }
    
    if (typedPrompt) typeEffect();

    // 7. Parallax Effect for Floating Elements
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        document.querySelectorAll('.float-item').forEach((item, index) => {
            const speed = (index + 1) * 0.5; 
            item.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px) rotate(${moveX * 0.2}deg)`;
        });
    });

    // 8. Testimonial Slider
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('slider-dots');
    const cards = document.querySelectorAll('.review-card');
    
    if (track && cards.length > 0) {
        let currentIndex = 0;
        const cardCount = cards.length;
        
        const getVisibleCards = () => window.innerWidth > 992 ? 3 : (window.innerWidth > 600 ? 2 : 1);
        let cardsVisible = getVisibleCards();
        let totalSteps = Math.max(1, cardCount - cardsVisible + 1);

        const createDots = () => {
            dotsContainer.innerHTML = '';
            totalSteps = Math.max(1, cardCount - cardsVisible + 1);
            for (let i = 0; i < totalSteps; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        };

        const updateSlider = () => {
            const cardWidth = cards[0].offsetWidth + 32; // card + gap
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateSlider();
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSteps;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSteps) % totalSteps;
            updateSlider();
        });

        window.addEventListener('resize', () => {
            cardsVisible = getVisibleCards();
            createDots();
            if (currentIndex >= totalSteps) currentIndex = totalSteps - 1;
            updateSlider();
        });

        createDots();
        
        // Auto-slide every 5 seconds
        let autoSlide = setInterval(() => nextBtn.click(), 5000);
        
        // Stop auto-slide on hover
        const sliderContainer = document.querySelector('.testimonial-slider-container');
        sliderContainer.addEventListener('mouseenter', () => clearInterval(autoSlide));
        sliderContainer.addEventListener('mouseleave', () => autoSlide = setInterval(() => nextBtn.click(), 5000));
    }
});
