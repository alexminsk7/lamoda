const headerCityButton = document.querySelector('.header__city-button');

// change text with localStorage
headerCityButton.textContent =
	localStorage.getItem('lomoda-location') || 'Ваш город?';

headerCityButton.addEventListener('click', () => {
	const city = prompt('Укажите ваш город');
	headerCityButton.textContent = city;
	localStorage.setItem('lomoda-location', city);
});

// blocking scroll
const disableScroll = () => {
	// to get scroll
	const widthScroll = window.innerWidth - document.body.offsetWidth;

	document.body.dbScrollY = window.scrollY;

	// styles for page under modal
	document.body.style.cssText = `
		position: fixed;
		top: ${-window.scrollY}px;
		left: 0;
		width: 100%;
		height: 100vh;
		overflow: hidden;
		padding-right: ${widthScroll}px;
	`;
};

// prevent blowout scroll to top
const enableScroll = () => {
	document.body.style.cssText = '';
	window.scroll({
		top: document.body.dbScrollY,
	});
};

// modal window
const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

// open modal window
const cartModalOpen = () => {
	cartOverlay.classList.add('cart-overlay-open');
	disableScroll();
};

// close modal window
const cartModalClose = () => {
	cartOverlay.classList.remove('cart-overlay-open');
	enableScroll();
};

// by click to open modal
subheaderCart.addEventListener('click', cartModalOpen);

cartOverlay.addEventListener('click', (event) => {
	const target = event.target;

	// close modal
	if (target.matches('.cart__btn-close') || target.matches('.cart-overlay')) {
		cartModalClose();
	}
});

// cartOverlay.addEventListener('keyCode', (event) => {
// 	if (event.keyCode == 27) {
// 		cartModalClose();
// 	}
// });
