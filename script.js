'use strict';

///////////////////////////////////////
// Modal window

// selector function
function $(selected) {
	const self = document.querySelector(selected);
	return self;
}
function $all(selected) {
	const self = document.querySelectorAll(selected);
	return self;
}

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = $all('.operations__tab');
const tabContainer = $('.operations__tab-container');
const tabContent = $all('.operations__content');

const nav = $('.nav');

const openModal = function (e) {
	e.preventDefault();
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

const closeModal = function () {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => {
	btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModal();
	}
});

// scroll down button
$('.btn--scroll-to').addEventListener('click', function () {
	$('#section--1').scrollIntoView({ behavior: 'smooth' });
});

// smooth scrolling for nav links

$('.nav__links').addEventListener('click', function (e) {
	e.preventDefault();

	if (e.target.classList.contains('nav__link')) {
		const id = e.target.getAttribute('href');
		document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
	}
});

// tabbed component

tabContainer.addEventListener('click', function (e) {
	const clicked = e.target.closest('.operations__tab');

	if (!clicked) return;

	// removeing active classes
	tabs.forEach((tab) => tab.classList.remove('operations__tab--active'));
	tabContent.forEach((tab) =>
		tab.classList.remove('operations__content--active')
	);

	// activate tabs
	clicked.classList.add('operations__tab--active');
	$(`.operations__content--${clicked.dataset.tab}`).classList.add(
		'operations__content--active'
	);
});

// sticky nav
const stickyNav = (entries) => {
	const [entry] = entries;
	if (!entry.isIntersecting) nav.classList.add('sticky');
	else nav.classList.remove('sticky');
};
const header = $('.header');
const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNav, {
	root: null,
	threshold: 0,
	rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// section fadeIn animation
const revealSection = (entries, observer) => {
	const [entry] = entries;
	if (!entry.isIntersecting) return;
	entry.target.classList.remove('section--hidden');

	observer.unobserve(entry.target);
};

const sections = $all('.section');
const sectionObserver = new IntersectionObserver(revealSection, {
	root: null,
	threshold: 0.15,
});

sections.forEach((section) => {
	sectionObserver.observe(section);
	// section.classList.add('section--hidden');
});

// lazy Loading images

const lazyImg = (entries, observer) => {
	const [entry] = entries;
	if (!entry.isIntersecting) return;
	const imgSrc = entry.target.dataset.src;
	entry.target.src = imgSrc;

	entry.target.addEventListener('load', function () {
		entry.target.classList.remove('lazy-img');
	});

	observer.unobserve(entry.target);
};

const images = $all('img[data-src]');
const imagesObserver = new IntersectionObserver(lazyImg, {
	root: null,
	threshold: 0,
});

images.forEach((img) => imagesObserver.observe(img));

// implementing slider

const slider = $('.slider');
const slides = $all('.slide');
const btnNext = $('.slider__btn--right');
const btnprev = $('.slider__btn--left');
const dotsContainer = $('.dots');
let curslide = 0;

const goToSlide = (curr) => {
	slides.forEach(
		(slide, i) => {
			slide.style.transform = `translateX(${100 * (i - curr)}%)`;

			slide.classList.remove('active')
			slide.classList.add(`slide${i}`);
			$(`.slide${curr}`).classList.add('active')
		}
	);
};

function createDots() {
	slides.forEach((_, i) => {
		dotsContainer.insertAdjacentHTML(
			'beforeend',
			`<button class="dots__dot" data-slide="${i}"></button>`
		);
	});
}

function activateDots(slide){
	const dots = $all('.dots__dot');

	dots.forEach(dot => dot.classList.remove('dots__dot--active'))

	$(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
}

createDots();
activateDots(0)
goToSlide(0);


// next slide
function nextSlide() {
	curslide = (curslide + 1) % slides.length;
	goToSlide(curslide);
	activateDots(curslide);
}

function prevSlide() {
	curslide = (curslide - 1 + slides.length) % slides.length;
	goToSlide(curslide);
	activateDots(curslide);
}

btnNext.addEventListener('click', nextSlide);
btnprev.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
	if (e.keyCode === 39 || e.key === 'ArrowRight') nextSlide();
	if (e.keyCode === 37 || e.key === 'ArrowLeft') prevSlide();
});

dotsContainer.addEventListener('click', function (e) {
	if(e.target.classList.contains('dots__dot')){
		const slide = e.target.dataset.slide;
		goToSlide(slide)
		activateDots(slide);
	}
});
