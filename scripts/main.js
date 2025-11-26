document.addEventListener("DOMContentLoaded", () => {
  loadCommon();
  loadHero();
  loadDemos();
  loadAbout();
  loadContact();
  observeSections();
});

function observeSections() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".fade-in-section").forEach((section) => {
    observer.observe(section);
  });
}

async function fetchData(file) {
  try {
    const response = await fetch(`data/${file}`);
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
    return null;
  }
}

async function loadCommon() {
  const data = await fetchData("common.json");
  if (!data) return;

  document.title = data.siteTitle;
  const brandName = document.getElementById("brand-name");
  if (brandName) brandName.textContent = data.name;

  const footerText = document.getElementById("footer-text");
  if (footerText) footerText.textContent = data.footer;

  const navContainer = document.getElementById("nav-links");
  if (navContainer) {
    navContainer.innerHTML = data.nav
      .map(
        (link) =>
          `<a class="font-display text-sm font-medium hover:text-primary transition-colors duration-300" href="${link.href}">${link.label}</a>`
      )
      .join("");
  }

  const ctaButtons = document.querySelectorAll(".nav-cta");
  ctaButtons.forEach((btn) => {
    btn.href = data.cta.href;
    const span = btn.querySelector("span");
    if (span) span.textContent = data.cta.label;
  });
}

async function loadHero() {
  const data = await fetchData("hero.json");
  if (!data) return;

  const title = document.getElementById("hero-title");
  if (title) title.textContent = data.title;

  const subtitle = document.getElementById("hero-subtitle");
  if (subtitle) subtitle.textContent = data.subtitle;

  const primaryCta = document.getElementById("hero-primary-cta");
  if (primaryCta) {
    primaryCta.href = data.primaryCta.href;
    const span = primaryCta.querySelector("span");
    if (span) span.textContent = data.primaryCta.label;
  }

  const secondaryCta = document.getElementById("hero-secondary-cta");
  if (secondaryCta) {
    secondaryCta.href = data.secondaryCta.href;
    const span = secondaryCta.querySelector("span");
    if (span) span.textContent = data.secondaryCta.label;
  }

  const profileImg = document.getElementById("hero-profile-img");
  if (profileImg) {
    profileImg.style.backgroundImage = `url('${data.profileImage}')`;
    profileImg.dataset.alt = data.profileAlt;
  }
}

async function loadDemos() {
  const data = await fetchData("demos.json");
  if (!data) return;

  const title = document.getElementById("demos-title");
  if (title) title.textContent = data.title;

  const desc = document.getElementById("demos-desc");
  if (desc) desc.textContent = data.description;

  const categoriesContainer = document.getElementById("demo-categories");
  const itemsContainer = document.getElementById("demo-items");

  let activeCategory = "Tất cả";
  const allCategories = ["Tất cả", ...data.categories];

  function renderCategories() {
    if (categoriesContainer) {
      categoriesContainer.innerHTML = allCategories
        .map(
          (cat) =>
            `<div class="demo-category flex h-9 cursor-pointer items-center justify-center gap-x-2 rounded-full ${
              cat === activeCategory
                ? "bg-primary/10 dark:bg-primary/20 text-primary"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            } px-4 transition-colors duration-300" data-category="${cat}">
                    <p class="font-display text-sm font-medium leading-normal">${cat}</p>
                </div>`
        )
        .join("");

      // Add click listeners
      categoriesContainer.querySelectorAll(".demo-category").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeCategory = btn.dataset.category;
          renderCategories();
          renderItems();
        });
      });
    }
  }

  function renderItems() {
    if (itemsContainer) {
      const filteredItems =
        activeCategory === "Tất cả"
          ? data.items
          : data.items.filter((item) => item.category === activeCategory);

      itemsContainer.innerHTML = filteredItems
        .map(
          (item) =>
            `<div class="flex flex-col gap-4 bg-background-light dark:bg-background-dark p-4 rounded-xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div class="relative w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" data-alt="Thumbnail for ${item.title}" style='background-image: url("${item.thumbnail}");'>
                        <div class="absolute inset-0 bg-black/30 flex items-center justify-center group">
                            <button class="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white/50 transition-colors duration-300">
                                <span class="material-symbols-outlined text-4xl">play_arrow</span>
                            </button>
                        </div>
                    </div>
                    <div>
                        <p class="font-display text-lg font-bold leading-normal text-text-light dark:text-text-dark">${item.title}</p>
                        <p class="font-body text-sm text-text-light/80 dark:text-text-dark/80">${item.description}</p>
                    </div>
                </div>`
        )
        .join("");
    }
  }

  renderCategories();
  renderItems();
}

async function loadAbout() {
  const data = await fetchData("about.json");
  if (!data) return;

  const title = document.getElementById("about-title");
  if (title) title.textContent = data.title;

  const desc = document.getElementById("about-desc");
  if (desc) desc.textContent = data.description;

  const img = document.getElementById("about-img");
  if (img) img.style.backgroundImage = `url('${data.image}')`;

  const featuresContainer = document.getElementById("about-features");
  if (featuresContainer) {
    featuresContainer.innerHTML = data.features
      .map(
        (feature) =>
          `<div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-secondary">${feature.icon}</span>
                <span class="font-display font-medium">${feature.text}</span>
            </div>`
      )
      .join("");
  }
}

async function loadContact() {
  const data = await fetchData("contact.json");
  if (!data) return;

  const title = document.getElementById("contact-title");
  if (title) title.textContent = data.title;

  const desc = document.getElementById("contact-desc");
  if (desc) desc.textContent = data.description;

  const emailLink = document.getElementById("contact-email");
  if (emailLink) emailLink.href = `mailto:${data.email}`;

  const emailText = document.getElementById("contact-email-text");
  if (emailText) emailText.textContent = data.email;

  const zaloLink = document.getElementById("contact-zalo");
  if (zaloLink) zaloLink.href = data.zalo;

  const fbLink = document.getElementById("contact-facebook");
  if (fbLink) fbLink.href = data.facebook;

  const location = document.getElementById("contact-location");
  if (location) location.textContent = data.location;
}
