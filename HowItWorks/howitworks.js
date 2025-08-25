// Traditional scrolling animation observer
const observerOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const content = entry.target.querySelector(".section-content");
            const visual = entry.target.querySelector(".section-visual");

            if (content) content.classList.add("animate");
            if (visual) visual.classList.add("animate");
        }
    });
}, observerOptions);

// Observe traditional sections
document.querySelectorAll(".traditional-section").forEach((section) => {
    observer.observe(section);
});

// Hero scroll indicator click
const scrollIndicator = document.querySelector(".scroll-indicator");
if (scrollIndicator) {
    scrollIndicator.addEventListener("click", () => {
        const firstSection = document.querySelector(".traditional-section");
        if (firstSection) {
            firstSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
}
