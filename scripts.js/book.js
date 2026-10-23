// 1. Category Definitions & Custom Headers
const categoryDefinitions = [
  {
    id: "haircuts",
    title: "Haircuts",
    headerHtml: `
        <div class="category-intro-banner">
          <h3>Haircuts</h3>
          <h4>(Gender Neutral)</h4>
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
    price: 699,
    description: "For short to medium - length hair.",
    category: "haircuts",
  },
  {
    id: "srv_Long_Haircut",
    name: "Long & Thick Haircut",
    duration: "75 mins",
    price: 799,
    description:
      "For longer, thicker or more time-intensive hair. Final price depends on the work required",
    category: "haircuts",
  },
  {
    id: "srv_Haircut_Beard_Trim",
    name: "Haircut & Beard Trim",
    duration: "80 mins",
    price: 1099,
    description:
      "A precision haircut and beard trim for a clean, balanced look.",
    category: "haircuts",
  },
  {
    id: "srv_Wash_Blow-dry",
    name: "Wash & Blow-dry",
    duration: "45 mins",
    price: 499,
    description:
      "A refreshing wash and professional blow-dry for smooth, beautifully styled hair.",
    category: "haircuts",
  },
  {
    id: "srv_Hydration_Conditioning_Treatment",
    name: "Hydration & Conditioning Treatment",
    duration: "90 mins",
    price: 1390,
    description:
      "For dry, dull or difficult-to-manage hair. This treatment helps improve softness, smoothness and moisture, leaving the hair feeling more manageable and easier to style.",
    category: "treatments",
  },
  {
    id: "srv_Protein_Strengthening_Treatment",
    name: "Protein & Strengthening Treatment",
    duration: "90 mins",
    price: 1490,
    description:
      "For weak, fragile or damaged hair. This treatment helps improve hair strength, resilience and manageability, supporting hair that is prone to breakage.",
    category: "treatments",
  },
  {
    id: "srv_Scalp Detox & Cleansing_Treatment",
    name: "Scalp Detox & Cleansing Treatment",
    duration: "90 mins",
    price: 1590,
    description:
      "For an oily scalp or a buildup of sweat, excess oil and styling products. This treatment deeply cleanses the scalp, helping it feel fresher, cleaner and more comfortable.",
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
  return val === 0 ? "Free" : val + " kr";
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
              
             
              <button class="add-service-btn ${isAdded ? "added" : ""}" data-id="${service.id}" title="${isAdded ? "Remove" : "Book Now"}">
                ${isAdded ? "x" : "✓"}
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
    cartTotalPrice.textContent = "0kr";
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


// Helper to read query parameters from the URL
function getUrlCategory() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category");
}

// Handle category activation & smooth scrolling on page load
function handleUrlRouting() {
  const targetCategory = getUrlCategory();

  if (targetCategory) {
    const targetPill = document.querySelector(
      `.pill-btn[data-category="${targetCategory}"]`
    );

    if (targetPill) {
      // 1. Activate the corresponding category pill button
      pills.forEach((p) => p.classList.remove("active"));
      targetPill.classList.add("active");
      
      // 2. Set view state exclusively to the requested category
      selectedCategory = targetCategory;
      renderView();
      renderCart();

      // 3. Scroll category pill into center view (for mobile viewports)
      targetPill.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });

      // 4. Smooth scroll directly to the selected category section or container
      setTimeout(() => {
        const categorySection = document.getElementById(
          `category-section-${targetCategory}`
        ) || document.getElementById("serviceSectionsContainer");

        if (categorySection) {
          const headerOffset = 90; // Adjust for fixed header height
          const elementPosition = categorySection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 150);

      return;
    }
  }

  // Fallback: Default rendering when no category parameter is present
  selectedCategory = "all";
  renderView();
  renderCart();
}

// Tab Pill Listeners (Manual filtering when on the page)
pills.forEach((pill) => {
  pill.addEventListener("click", () => {
    pills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    selectedCategory = pill.getAttribute("data-category");
    renderView();
  });
});

// Run single initialization on page load
handleUrlRouting();