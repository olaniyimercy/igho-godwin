// 1. Category Definitions & Custom Headers
const categoryDefinitions = [
  {
    id: "haircuts",
    title: "Haircuts",
    headerHtml: `
        <div class="category-intro-banner">
          <h3>Haircuts</h3>
          <div class="tagline">We do not destroy. We maintain.</div>
          <p>Hair washing and relaxing head massage are included with every haircut. No colouring services.</p>
        </div>
      `,
  },
  {
    id: "treatments",
    title: "Hair & Scalp Treatments",
    headerHtml: `
        <div class="category-intro-banner">
          <h3>Hair &amp; Scalp Treatments</h3>
          <div class="tagline">We do not destroy. We maintain.</div>
          <p>Specialist rituals designed to nourish from the root up. Using a sustainable, Organic approach. Restore scalp health, balance, and natural hair shine.</p>
          <p>Hair washing, relaxing head &amp; neck massage, blow-drying are included with every treatment.</p>
        </div>
      `,
  },
  // {
  //   id: "colour",
  //   title: "Colour",
  //   headerHtml: `
  //       <h3 class="default-category-header">Colour Services</h3>
  //     `,
  // },
];

// 2. Service Items Database
const salonServices = [
  {
    id: "srv_Haircut_Machine",
    name: "Haircut Machine",
    duration: "45 mins",
    price: 599,
    description: "A precise clipper cut for a clean, well-maintained finish.",
    category: "haircuts",
  },
  {
    id: "srv_Scissor_Haircut",
    name: "Scissor Haircut",
    duration: "60 mins",
    price: 650,
    description:
      "A tailored cut shaped with scissors for a natural, balanced finish.",
    category: "haircuts",
  },
  {
    id: "srv_Long_Haircut",
    name: "Long Haircut",
    duration: "60 mins",
    price: 799,
    description:
      "A personalised cut that maintains shape, movement and healthy-looking lengths.",
    category: "haircuts",
  },
  {
    id: "srv_Haircut_Beard_Trim",
    name: "Haircut & Beard Trim",
    duration: "60 mins",
    price: 850,
    description:
      "A precision haircut and beard trim for a clean, balanced look.",
    category: "haircuts",
  },
  {
    id: "srv_Wash_Blow-dry",
    name: "Wash & Blow-dry",
    duration: "30 mins",
    price: 499,
    description:
      "A refreshing wash and professional blow-dry for smooth, beautifully styled hair.",
    category: "haircuts",
  },
  {
    id: "srv_Hydration_Conditioning_Treatment",
    name: "Hydration & Conditioning Treatment",
    duration: "60 mins",
    price: 899,
    description:
      "Improves softness, smoothness and manageability while reducing tangling and friction.",
    category: "treatments",
  },
  {
    id: "srv_Protein_Strengthening_Treatment",
    name: "Hydration & Conditioning Treatment",
    duration: "60 mins",
    price: 999,
    description:
      "Helps improve the feel, resilience and manageability of damaged hair, including hair prone to breakage.",
    category: "treatments",
  },
  {
    id: "srv_Scalp Detox & Cleansing_Treatment",
    name: "Scalp Detox & Cleansing Treatment",
    duration: "75 mins",
    price: 1299,
    description:
      "Removes excess oil, sweat and products buildup, helping maintain a clean, comfortable scalp.",
    category: "treatments",
  },
];

// State
let selectedCategory = "all"; // 'all' by default
const cart = new Set();

// Elements
const sectionsContainer = document.getElementById("serviceSectionsContainer");
const cartItemsList = document.getElementById("cartItemsList");
const cartTotalPrice = document.getElementById("cartTotalPrice");
const continueBtn = document.getElementById("continueBtn");
const pills = document.querySelectorAll(".pill-btn");

function formatPrice(val) {
  return val === 0 ? "Free" : val.toFixed(2) + "kr";
}

// Renders the services grouped by category
function renderView() {
  sectionsContainer.innerHTML = "";

  // Determine which categories to display: all or single selection
  const categoriesToRender =
    selectedCategory === "all"
      ? categoryDefinitions
      : categoryDefinitions.filter((cat) => cat.id === selectedCategory);

  categoriesToRender.forEach((category) => {
    const items = salonServices.filter((srv) => srv.category === category.id);
    if (items.length === 0) return;

    const groupDiv = document.createElement("div");
    groupDiv.className = "category-group-block";

    // Insert the custom banner / header for this category
    let html = category.headerHtml;

    // Append cards
    items.forEach((service) => {
      const isAdded = cart.has(service.id);
      html += `
          <div class="service-card">
            <div class="service-card-top">
              <div class="service-card-info">
                <h4>${service.name}</h4>
                <div class="service-card-duration">${service.duration}</div>
                <div class="service-card-desc">${service.description}</div>
              </div>
            </div>
            <div class="service-card-bottom">
              <div class="service-card-price">${formatPrice(service.price)}</div>
              <button class="add-service-btn ${isAdded ? "added" : ""}" data-id="${service.id}" title="${isAdded ? "Remove" : "Add"}">
                ${isAdded ? "✓" : "+"}
              </button>
            </div>
          </div>
        `;
    });

    groupDiv.innerHTML = html;
    sectionsContainer.appendChild(groupDiv);
  });

  // Attach event listeners to all '+' buttons
  sectionsContainer.querySelectorAll(".add-service-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleCart(btn.getAttribute("data-id"));
    });
  });
}

// Renders sticky checkout panel
function renderCart() {
  if (cart.size === 0) {
    cartItemsList.innerHTML = `<div class="empty-cart-message">No services selected yet</div>`;
    cartTotalPrice.textContent = "0.00kr";
    continueBtn.disabled = true;
    continueBtn.classList.remove("ready");
    return;
  }

  let total = 0;
  cartItemsList.innerHTML = "";

  cart.forEach((serviceId) => {
    const service = salonServices.find((s) => s.id === serviceId);
    if (!service) return;

    total += service.price;

    const itemRow = document.createElement("div");
    itemRow.className = "cart-item";
    itemRow.innerHTML = `
        <div class="cart-item-info">
          <h5>${service.name}</h5>
          <span>${service.duration}</span>
        </div>
        <div class="cart-item-price-wrap">
          <span class="cart-item-price">${formatPrice(service.price)}</span>
          <button class="remove-item-btn" data-id="${service.id}" title="Remove">✕</button>
        </div>
      `;
    cartItemsList.appendChild(itemRow);
  });

  cartItemsList.querySelectorAll(".remove-item-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleCart(btn.getAttribute("data-id"));
    });
  });

  cartTotalPrice.textContent = `${total.toFixed(2)}kr`;
  continueBtn.disabled = false;
  continueBtn.classList.add("ready");
}

function toggleCart(serviceId) {
  if (cart.has(serviceId)) {
    cart.delete(serviceId);
  } else {
    cart.add(serviceId);
  }
  renderView();
  renderCart();
}

// Tab Pill Listeners (Filters view to one category or back to all)
pills.forEach((pill) => {
  pill.addEventListener("click", () => {
    pills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    selectedCategory = pill.getAttribute("data-category");
    renderView();
  });
});

// Initial Load: Renders all categories together with their respective headers
renderView();
renderCart();

// Helper to read query parameters from the URL
function getUrlCategory() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}

// Handle category activation & smooth scrolling
function handleUrlRouting() {
  const targetCategory = getUrlCategory();
  if (!targetCategory) {
    // Default to "all" or your preferred initial view
    selectedCategory = "all";
    renderView();
    renderCart();
    return;
  }

  // Check if a pill matches the URL parameter
  const targetPill = document.querySelector(
    `.pill-btn[data-category="${targetCategory}"]`,
  );
  if (targetPill) {
    // Update active pill state
    pills.forEach((p) => p.classList.remove("active"));
    targetPill.classList.add("active");
    selectedCategory = targetCategory;

    // Re-render only that category
    renderView();
    renderCart();

    // Smooth scroll to the content
    setTimeout(() => {
      const targetElement = document.getElementById("serviceSectionsContainer");
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  } else {
    renderView();
    renderCart();
  }
}

// Run on page load
handleUrlRouting();

const targetCategory = getUrlCategory();
if (targetCategory) {
  setTimeout(() => {
    const section = document.getElementById(
      `category-section-${targetCategory}`,
    );
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 150);
}