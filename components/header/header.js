// Menu elements
const menuToggle = document.getElementById("menu-toggle");
const menuWrapper = document.getElementById("menu-wrapper");
const menuClose = document.getElementById("menu-close");
const overlay = document.getElementById("overlay");

// Open menu
function openMenu() {
  menuWrapper.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close menu
function closeMenu() {
  menuWrapper.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Menu toggle events
menuToggle.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

// Close menu on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuWrapper.classList.contains("active")) {
    closeMenu();
  }
});

// Header scroll behavior
let lastScrollY = window.scrollY;
const header = document.querySelector(".site-header");
const navbar = document.querySelector(".navbar");
const lightSections = document.querySelectorAll(".light-navbar-section");

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  // Hide/show header on scroll
  if (Math.abs(currentScrollY - lastScrollY) > 100) {
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.classList.add("hide-header");
    } else {
      header.classList.remove("hide-header");
    }
    lastScrollY = currentScrollY;
  }

  // At top of page, remove background
  if (navbar) {
    if (window.scrollY === 0) {
      navbar.classList.remove("scrolled");
    } else {
      navbar.classList.add("scrolled");
    }
  }

  // Change navbar color if inside .light-navbar-section
  let shouldApplyLight = false;
  lightSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 0 && rect.bottom > 0) {
      shouldApplyLight = true;
    }
  });

  if (navbar) {
    if (shouldApplyLight) {
      navbar.classList.add("light");
    } else {
      navbar.classList.remove("light");
    }
  }
});

window.dispatchEvent(new Event("scroll"));

// Bold current page anchor in header and menu wrapper
const pageMap = {
  '/WhyOura/WhyOura.html': 'why-oura',
  '/WhyOura2/ScienceAndResearch.html': 'why-oura2',
  '/HowItWorks/HowItWorks.html': 'how-it-works',
  '/HowItWorks2/Integrations.html': 'how-it-works2',
  '/ShopPage/ShopPage.html': 'shop',
  '/ShopPage2/OuraRing4.html': 'shop2',
  '/ForBusiness/ForBusiness.html': 'for-business'
};

const linkPageMap = {
  '../WhyOura/WhyOura.html': 'why-oura',
  '../HowItWorks/HowItWorks.html': 'how-it-works',
  '../ForBusiness/ForBusiness.html': 'for-business',
  '../ShopPage/ShopPage.html': 'shop',
  '../WhyOura2/ScienceAndResearch.html': 'why-oura2',
  '../HowItWorks2/Integrations.html': 'how-it-works2',
  '../ShopPage2/OuraRing4.html': 'shop2',
};

function getCurrentPageIdentifier() {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  const fullPath = currentPath;
  
  if (pageMap[fullPath]) {
    return pageMap[fullPath];
  }
  
  for (const path in pageMap) {
    if (path.includes(currentPage) && currentPage !== '') {
      return pageMap[path];
    }
  }
  
  if (currentPage === '' || currentPage === 'index.html') {
    return 'home';
  }
  
  return null;
}

function highlightActiveLinks() {
  const allLinks = document.querySelectorAll('.navbar a, .menu-wrapper a');
  allLinks.forEach(link => {
    link.classList.remove('active', 'disabled');
    link.style.pointerEvents = '';
    link.style.cursor = '';
    const newLink = link.cloneNode(true);
    link.parentNode.replaceChild(newLink, link);
  });
  
  const currentPageId = getCurrentPageIdentifier();
  
  if (!currentPageId) {
    return;
  }
  
  const updatedLinks = document.querySelectorAll('.navbar a, .menu-wrapper a');
  
  updatedLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && linkPageMap[href] === currentPageId) {
      link.classList.add('active');
      link.classList.add('disabled');
      
      link.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
      
      link.style.pointerEvents = 'none';
      link.style.cursor = 'default';
    }
  });

  
}

document.addEventListener('DOMContentLoaded', function() {
  highlightActiveLinks();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', highlightActiveLinks);
} else {
  highlightActiveLinks();
}