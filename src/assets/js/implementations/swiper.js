import Swiper, { Navigation, Pagination, Autoplay } from 'swiper'

const swiperInstances = []
const swiperElements = document.querySelectorAll('[data-swiper]')

if (swiperElements.length) {

  for (let element of swiperElements) {

    const loop = element.hasAttribute('data-swiper-loop')
    const slidesPerViewValue = Number(element.getAttribute('data-swiper-slides-per-view'))
    const slidesPerView = isNaN(slidesPerViewValue) ? 1 : slidesPerViewValue
    const autoplayDelay = element.getAttribute('data-swiper-autoplay')
    const centeredSlides = element.hasAttribute('data-swiper-centered')

    const settings = {
      modules: [Navigation, Pagination, Autoplay],
      loop,
      slidesPerView,
      spaceBetween: 0,
      pagination: {
        el: '.swiper-pagination',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      centeredSlides
    }

    if (autoplayDelay) {
      const delay = Number(autoplayDelay)
      settings.autoplay = {
        delay: isNaN(delay) ? 3000 : delay,
        disableOnInteraction: false,
      }
    }

    swiperInstances.push(new Swiper(element, settings))
  }
}
