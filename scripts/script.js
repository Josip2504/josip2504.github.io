// scripts/script.js

// Floating particles in HTML
const particleContainer = document.querySelector('.floating-particles');
for(let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
    particleContainer.appendChild(particle);
}

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Highlight active section on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navHeight = document.querySelector('nav').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const id = section.getAttribute('id');
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Animate skill rings when scrolled into view
function animateSkillRings() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const skillLevel = item.getAttribute('data-skill');
        const progressRing = item.querySelector('.skill-ring-progress');
        
        if (!progressRing) return;
        
        // Calculate stroke-dashoffset based on skill level
        const circumference = 2 * Math.PI * 45; // radius is 45
        const percentage = skillLevel / 100;
        const offset = circumference * (1 - percentage);
        
        // Set initial state (fully hidden)
        progressRing.style.strokeDashoffset = circumference;
        
        // Animate when in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger animation by setting the final offset
                    setTimeout(() => {
                        progressRing.style.strokeDashoffset = offset;
                    }, 100);
                    observer.unobserve(item);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(item);
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', animateSkillRings);

// Code typing animation
function initCodeTyping() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const codeSnippets = [
        { text: '    pthread_t thread;', html: '    <span class="keyword">pthread_t</span> thread;' },
        { text: '    pthread_create(&thread, NULL, handle_request, &client_fd);', html: '    <span class="function">pthread_create</span>(&thread, <span class="constant">NULL</span>, handle_request, &client_fd);' },
        { text: '    // Non-blocking I/O server', html: '    <span class="comment">// Non-blocking I/O server</span>' },
        { text: '    struct epoll_event event;', html: '    <span class="keyword">struct</span> <span class="type">epoll_event</span> event;' },
        { text: '    event.events = EPOLLIN | EPOLLET;', html: '    event.events = <span class="constant">EPOLLIN</span> | <span class="constant">EPOLLET</span>;' },
        { text: '    epoll_ctl(epfd, EPOLL_CTL_ADD, fd, &event);', html: '    <span class="function">epoll_ctl</span>(epfd, <span class="constant">EPOLL_CTL_ADD</span>, fd, &event);' },
        { text: '    while (true) {', html: '    <span class="keyword">while</span> (<span class="constant">true</span>) {' },
        { text: '        handle_connection();', html: '        <span class="function">handle_connection</span>();' },
        { text: '    }', html: '    }' }
    ];

    let currentSnippet = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 50;

    function typeCode() {
        const currentCode = codeSnippets[currentSnippet];
        const plainText = currentCode.text;
        
        if (isDeleting) {
            charIndex--;
            if (charIndex < 0) {
                charIndex = 0;
            }
            typingSpeed = 30; // Faster when deleting
        } else {
            charIndex++;
            typingSpeed = 50; // Normal typing speed
        }

        // Calculate how much of the HTML to show based on plain text position
        if (charIndex > 0 && charIndex <= plainText.length) {
            // Find the corresponding position in HTML
            let htmlPos = 0;
            let textPos = 0;
            let html = '';
            
            for (let i = 0; i < currentCode.html.length && textPos < charIndex; i++) {
                const char = currentCode.html[i];
                html += char;
                
                // Count text characters (not HTML tags)
                if (char === '<') {
                    // Skip until closing >
                    while (i < currentCode.html.length && currentCode.html[i] !== '>') {
                        i++;
                        if (i < currentCode.html.length) html += currentCode.html[i];
                    }
                } else if (char !== '>') {
                    textPos++;
                }
            }
            
            typingText.innerHTML = html;
        } else {
            typingText.innerHTML = '';
        }

        if (!isDeleting && charIndex >= plainText.length) {
            // Pause at end of snippet
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex <= 0) {
            // Move to next snippet
            isDeleting = false;
            currentSnippet = (currentSnippet + 1) % codeSnippets.length;
            charIndex = 0;
            typingSpeed = 500;
        }

        setTimeout(typeCode, typingSpeed);
    }

    // Start typing after a short delay
    setTimeout(typeCode, 1000);
}

// Initialize code typing when page loads
document.addEventListener('DOMContentLoaded', initCodeTyping);