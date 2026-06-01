const header = document.querySelector('.header');

	window.addEventListener('scroll', () => {
		if (window.scrollY > 50) {
			header.classList.add('scrolled');
		} else {
			header.classList.remove('scrolled');
		}
	});




	const headerBackground = document.querySelector('.header-background');

let scrollPosition = 0;
let menuOpen = false;

window.addEventListener("scroll", () => {
	if (window.innerWidth > 600) return;
	if (menuOpen) return;

	headerBackground.classList.toggle("show", window.scrollY > 50);
});

const bar = document.getElementById('bar');
const x = document.getElementById('x');
const overlay = document.querySelector('.overlay');
const popupOverlay = document.getElementById('popupOverlay');
const announcementPopup = document.getElementById('announcementPopup');
const announcementClose = document.getElementById('announcementClose');
const body = document.body;

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
	window.scrollTo(0, scrollPosition);

	headerBackground.classList.toggle("show", scrollPosition > 50);
}

bar?.addEventListener('click', openMenu);
x?.addEventListener('click', closeMenu);
overlay?.addEventListener('click', closeMenu);

let announcementScrollPosition = 0;
let announcementOpen = false;

function openAnnouncement() {
	if (announcementOpen) return;
	announcementOpen = true;
	announcementScrollPosition = window.scrollY;
	body.style.top = `-${announcementScrollPosition}px`;
	body.classList.add('no-scroll');
	popupOverlay?.classList.add('show');
	announcementPopup?.classList.add('show');
}

function closeAnnouncement() {
	if (!announcementOpen) return;
	announcementOpen = false;
	popupOverlay?.classList.remove('show');
	announcementPopup?.classList.remove('show');

	if (!menuOpen) {
		body.classList.remove('no-scroll');
		body.style.top = '';
		window.scrollTo(0, announcementScrollPosition);
	}
}

popupOverlay?.addEventListener('click', closeAnnouncement);
announcementClose?.addEventListener('click', closeAnnouncement);

window.addEventListener('load', openAnnouncement);
