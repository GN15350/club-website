/* ================= CONFIG ================= */

// Control categories from HTML: <body data-category="academic,arts">
// Categories are stored lowercase in the categorized CSV
const ACTIVE_CATEGORIES = (document.body.dataset.category || "")
  .split(",")
  .map(item => item.trim().toLowerCase())
  .filter(Boolean);


/* ================= HEADER SCROLL ================= */

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
	header.classList.add('scrolled');
  } else {
	header.classList.remove('scrolled');
  }
});


/* ================= CSV + CLUB LOGIC ================= */

const overlay = document.getElementById("overlay");

fetch("Clubs - categorizedClubs.csv")
  .then(response => response.text())
  .then(csvText => {
	const parsed = Papa.parse(csvText, {
	  header: true,
	  skipEmptyLines: true
	});

	// Preload logos
	parsed.data.forEach(club => {
	  if (club.logo) {
		const img = new Image();
		img.src = `clubLogos/${club.logo.trim()}`;
	  }
	});

	const buttonContainer = document.getElementById("clubButtons");
	const infoBox = document.getElementById("clubInfo");
	const searchInput = document.getElementById("clubSearch");

	const clubItems = [];

	parsed.data.forEach(club => {

	  /* ===== CATEGORY FILTER ===== */
	  const category = (club.category || "").trim().toLowerCase();

	  if (ACTIVE_CATEGORIES.length > 0 && !ACTIVE_CATEGORIES.includes(category)) return;
	  /* =========================== */

	  const name = club.name;
	  const description = club.description;
	  const teacherName = club.teacherName;
	  const logo = club.logo;
	  const presidentName = club.presidentName;
	  const meetings = club.meetings;
	  const sponsorRoom = club.room;

	  // Extra button columns
	  const extraButtonLink = club.extraButtonLink || club.signups;
	  const extraButtonName = club.extraButtonName || (extraButtonLink ? "Sign Up" : "");

	  const btn = document.createElement("button");
	  btn.innerHTML = `
		<img src="clubLogos/${logo}" class="clubLogo"><br>
		<span>${name}</span>
	  `;

	  btn.addEventListener("click", () => {
		let extraButtonHTML = "";

		if (
		  extraButtonName &&
		  extraButtonLink &&
		  extraButtonName.trim() !== "" &&
		  extraButtonLink.trim() !== ""
		) {
		  extraButtonHTML = `
			<div class="club-extra-button-container">
			  <a href="${extraButtonLink}" target="_blank" rel="noopener">
				<button class="club-extra-button">
				  ${extraButtonName}
				</button>
			  </a>
			</div>
		  `;
		}

		infoBox.innerHTML = `
		  <button class="closeButton" id="closeButton">✕</button>

		  <h1>${name}</h1>
		  <img src="clubLogos/${logo}" style="width:120px">

		  <p>Description: ${description}</p>

		  <ul>
			<li><strong>Meetings:</strong> ${meetings}</li>
			<li><strong>President:</strong> ${presidentName}</li>
			<li><strong>Sponsor:</strong> ${teacherName}, ${sponsorRoom}</li>
		  </ul>

		  ${extraButtonHTML}
		`;

		infoBox.classList.add("show");
		overlay.classList.add("show");

		document.getElementById("closeButton").addEventListener("click", () => {
		  infoBox.classList.remove("show");
		  overlay.classList.remove("show");
		});
	  });

	  buttonContainer.appendChild(btn);

	  clubItems.push({
		button: btn,
		searchText: `${name} ${description} ${teacherName} ${presidentName}`.toLowerCase()
	  });
	});

	/* ================= SEARCH ================= */

	searchInput.addEventListener("input", () => {
	  const query = searchInput.value.toLowerCase();

	  clubItems.forEach(item => {
		item.button.style.display = item.searchText.includes(query)
		  ? "inline-block"
		  : "none";
	  });
	});
  });


/* ================= MOBILE MENU ================= */

const headerBackground = document.querySelector('.header-background');
const bar = document.getElementById('bar');
const x = document.getElementById('x');
const body = document.body;

let scrollPosition = 0;
let menuOpen = false;

window.addEventListener("scroll", () => {
  if (window.innerWidth > 600) return;
  if (menuOpen) return;

  headerBackground.classList.toggle("show", window.scrollY > 50);
});

function openMenu() {
  scrollPosition = window.scrollY;
  menuOpen = true;

  body.style.top = `-${scrollPosition}px`;
  body.classList.add('no-scroll');

  headerBackground.classList.add('show');
  header.classList.add('open');
  overlay.classList.add('show');
}

function closeMenu() {
  menuOpen = false;

  header.classList.remove('open');
  overlay.classList.remove('show');

  body.classList.remove('no-scroll');
  body.style.top = '';

  headerBackground.classList.toggle("show", scrollPosition > 50);
}

bar?.addEventListener('click', openMenu);
x?.addEventListener('click', closeMenu);


/* ================= SHARED OVERLAY HANDLER ================= */

overlay.addEventListener("click", () => {
  const infoBox = document.getElementById("clubInfo");

  // Close popup first if open
  if (infoBox.classList.contains("show")) {
	infoBox.classList.remove("show");
	overlay.classList.remove("show");
	return;
  }

  // Otherwise close menu
  if (menuOpen) {
	closeMenu();
  }
});
