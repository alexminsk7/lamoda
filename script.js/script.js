const headerCityButton = document.querySelector('.header__city-button');
const navigationLink = document.querySelectorAll('.navigation__link');
const goodsTitle = document.querySelector('.goods__title');

goodsTitle.textContent = localStorage.getItem('goods-title');

goodsTitle.addEventListener('click', () => {
	let value = navigationLink.value;
	goodsTitle.textContent = value;
	localStorage.setItem('goods-title', value);
});

// getting hash
let hash = location.hash.substring(1);

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

// request to DB
const getData = async () => {
	const data = await fetch('db.json');

	if (data.ok) {
		return data.json();
	} else {
		throw new Error(
			`No data was received, error ${data.status} ${data.statusText}`
		);
	}
};

const getGoods = (callback, value) => {
	getData()
		.then((data) => {
			if (value) {
				// return data with needed hash that equal category
				callback(data.filter((item) => item.category === value));
			} else {
				callback(data);
			}
		})
		.catch((err) => {
			console.error(err);
		});
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

document.addEventListener('keydown', (event) => {
	if (event.keyCode === 27) {
		cartModalClose();
	}
});

try {
	console.log(hash);
	const goodsList = document.querySelector('.goods__list');

	if (!goodsList) {
		throw 'This is not a goods page!';
	}

	const createCard = ({ id, preview, cost, brand, name, sizes }) => {
		const li = document.createElement('li');

		li.classList.add('.goods__item');

		// adding list item
		li.innerHTML = `
			<article class="good">
				<a class="good__link-img" href="card-good.html#${id}">
					<img class="good__img" src="goods-image/${preview}" alt="">
				</a>
				<div class="good__description">
					<p class="good__price">${cost} &#8381;</p>
					<h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
					${
						sizes
							? `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(
									' '
							  )}</span></p>`
							: ''
					}
					<a class="good__link" href="card-good.html#${id}">Подробнее</a>
				</div>
			</article>
		`;

		return li;
	};

	const renderGoodsList = (data) => {
		// cleaning
		goodsList.textContent = '';

		data.forEach((item) => {
			// building card
			const card = createCard(item);
			// insert card to page
			goodsList.append(card);
		});
	};

	// getting new hash with invoking getGoods function
	window.addEventListener('hashchange', () => {
		hash = location.hash.substring(1);
		getGoods(renderGoodsList, hash);
	});

	getGoods(renderGoodsList, hash);
} catch (err) {
	console.warn(err);
}
