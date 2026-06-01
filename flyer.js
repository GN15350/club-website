const overlay = document.getElementById("overlay");
const flyerPopup = document.getElementById("flyerPopup");
const flyerGrid = document.getElementById("flyerGrid");
const flyerPopupImage = document.getElementById("flyerPopupImage");
const flyerPopupButtons = document.getElementById("flyerPopupButtons");
const closeButton = document.getElementById("close");

const flyerCsvPath = "Clubs - flyers.csv";

const closePopup = () => {
	flyerPopup.classList.remove("show");
	overlay.classList.remove("show");
	document.body.classList.remove("no-scroll");
};

const openPopup = (flyerSrc, row) => {
	flyerPopupImage.src = flyerSrc;
	flyerPopupButtons.innerHTML = "";

	const buttonData = [
		{ name: row.buttonName1, link: row.link1 },
		{ name: row.buttonName2, link: row.link2 },
	];

	let buttonCount = 0;
	buttonData.forEach(({ name, link }) => {
		if (!name || !link) return;
		const button = document.createElement("div");
		button.className = "flyerLinks";
		button.textContent = name;
		button.addEventListener("click", () => {
			window.location.href = link;
		});
		flyerPopupButtons.appendChild(button);
		buttonCount += 1;
	});

	flyerPopupButtons.style.display = buttonCount > 0 ? "flex" : "none";
	flyerPopup.classList.add("show");
	overlay.classList.add("show");
	document.body.classList.add("no-scroll");
};

const getFileName = (row) => {
	return (
		(row["File Name"] || row["File name"] || row.fileName || row.filename || "")
			.toString()
			.trim()
	);
};

const createFlyerImage = (row) => {
	const fileName = getFileName(row);
	if (!fileName) return;

	const img = document.createElement("img");
	img.className = "flyer-img";
	img.src = `flyers/${fileName}`;
	img.alt = "flyer-img";
	img.addEventListener("click", () => openPopup(img.src, row));
	flyerGrid.appendChild(img);
};

const loadFlyers = () => {
	Papa.parse(flyerCsvPath, {
		download: true,
		header: true,
		skipEmptyLines: true,
		complete: (results) => {
			results.data.forEach(createFlyerImage);
		},
	});
};

overlay.addEventListener("click", closePopup);
closeButton.addEventListener("click", closePopup);
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") closePopup();
});

loadFlyers();
