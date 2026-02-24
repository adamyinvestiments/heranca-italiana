document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.background = 'rgba(3, 10, 24, 0.9)'; // Darker on scroll
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.background = 'var(--color-glass-bg)';
        }
    });

    // Mobile Menu Toggle (Basic implementation)
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    mobileBtn.addEventListener('click', () => {
        // Toggle active class on nav-links
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'var(--color-primary-dark)';
        navLinks.style.padding = '1rem';
        navLinks.style.borderBottom = '1px solid var(--color-glass-border)';
    });

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // If mobile menu is open, close it
                if (window.innerWidth <= 900 && navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    // Surname Tooltip Logic
    const tooltip = document.getElementById('surname-tooltip');
    const tooltipTitle = tooltip.querySelector('.tooltip-title');
    const tooltipDesc = tooltip.querySelector('.tooltip-desc');
    const surnameBtns = document.querySelectorAll('.surname-btn');

    // Track if device primarily uses touch (to differentiate click vs hover behavior)
    let isTouchDevice = false;
    window.addEventListener('touchstart', () => { isTouchDevice = true; }, { once: true });

    let activeTooltipBtn = null; // Track the button that currently opened the tooltip (for mobile toggle)

    function showTooltip(btn, x, y) {
        tooltipTitle.textContent = btn.getAttribute('data-title');
        tooltipDesc.textContent = btn.getAttribute('data-desc');
        tooltip.classList.add('active');
        tooltip.setAttribute('aria-hidden', 'false');
        positionTooltip(x, y);
    }

    function hideTooltip() {
        tooltip.classList.remove('active');
        tooltip.setAttribute('aria-hidden', 'true');
        activeTooltipBtn = null;
    }

    function positionTooltip(mouseX, mouseY) {
        // Offset from cursor/element
        const offset = 15;
        let finalX = mouseX + offset;
        let finalY = mouseY + offset;

        const tooltipRect = tooltip.getBoundingClientRect();

        // Prevent overflowing right edge
        if (finalX + tooltipRect.width > window.innerWidth) {
            finalX = window.innerWidth - tooltipRect.width - offset;
        }

        // Prevent overflowing bottom edge
        if (finalY + tooltipRect.height > window.innerHeight) {
            finalY = mouseY - tooltipRect.height - offset;
        }

        tooltip.style.left = `${finalX}px`;
        tooltip.style.top = `${finalY}px`;
    }

    surnameBtns.forEach(btn => {
        // Desktop Hover (follows mouse)
        btn.addEventListener('mouseenter', (e) => {
            if (isTouchDevice) return;
            showTooltip(btn, e.clientX, e.clientY);
        });

        btn.addEventListener('mousemove', (e) => {
            if (isTouchDevice) return;
            positionTooltip(e.clientX, e.clientY);
        });

        btn.addEventListener('mouseleave', () => {
            if (isTouchDevice) return;
            hideTooltip();
        });

        // Accessibility (Keyboard Focus)
        btn.addEventListener('focus', (e) => {
            const rect = btn.getBoundingClientRect();
            // Position slightly below and right of the button for keyboard users
            showTooltip(btn, rect.left + (rect.width / 2), rect.bottom);
        });

        btn.addEventListener('blur', () => {
            // Only hide if we aren't clicking it (avoids conflict with click toggle)
            if (!isTouchDevice) hideTooltip();
        });

        // Mobile / Touch Click Toggle
        btn.addEventListener('click', (e) => {
            if (!isTouchDevice) return; // Desktop uses hover
            e.stopPropagation(); // Prevent document click from immediately closing it

            if (activeTooltipBtn === btn) {
                // Tapping the same button twice closes it
                hideTooltip();
            } else {
                // Tapping a new button opens it
                const rect = btn.getBoundingClientRect();
                showTooltip(btn, rect.left + (rect.width / 2), rect.bottom);
                activeTooltipBtn = btn;
            }
        });
    });

    // Close tooltip when touching outside (Mobile)
    document.addEventListener('click', (e) => {
        if (isTouchDevice && tooltip.classList.contains('active')) {
            hideTooltip();
        }
    });

});
