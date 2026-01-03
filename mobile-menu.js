// Mobile Menu Toggle
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".mobile-menu-toggle");
    const header = document.querySelector(".header");
    const navLinks = document.querySelectorAll(".nav-links a");

    if (!menuToggle || !header) return;

    menuToggle.addEventListener("click", function () {
      header.classList.toggle("menu-open");
      menuToggle.classList.toggle("active");
    });

    // Close menu when clicking on a nav link (on mobile)
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 768) {
          header.classList.remove("menu-open");
          menuToggle.classList.remove("active");
        }
      });
    });

    // Close menu when clicking outside (on mobile)
    document.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        if (
          !header.contains(e.target) &&
          header.classList.contains("menu-open")
        ) {
          header.classList.remove("menu-open");
          menuToggle.classList.remove("active");
        }
      }
    });
  });
})();

// Mark active page in navigation
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach((link) => {
      const linkHref = link.getAttribute("href");
      // Skip external links (those starting with http)
      if (linkHref.startsWith("http")) {
        return;
      }

      // Normalize paths for comparison
      const linkPage = linkHref.split("/").pop();
      const isHomePage =
        currentPage === "" ||
        currentPage === "index.html" ||
        currentPath.endsWith("/");
      const isHomeLink = linkPage === "index.html" || linkPage === "";

      // Check if the link matches the current page
      if (
        (isHomePage && isHomeLink) ||
        (!isHomePage && linkPage === currentPage)
      ) {
        link.classList.add("active");
      }
    });
  });
})();
