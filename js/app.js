(() => {
  'use strict';
  let _slideUp = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = `${target.offsetHeight}px`;
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = showmore ? `${showmore}px` : `0px`;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
        target.hidden = !showmore ? true : false;
        !showmore ? target.style.removeProperty('height') : null;
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        !showmore ? target.style.removeProperty('overflow') : null;
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        target.classList.remove('_slide');
        document.dispatchEvent(
          new CustomEvent('slideUpDone', {
            detail: {
              target,
            },
          })
        );
      }, duration);
    }
  };
  let _slideDown = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains('_slide')) {
      target.classList.add('_slide');
      target.hidden = target.hidden ? false : null;
      showmore ? target.style.removeProperty('height') : null;
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = showmore ? `${showmore}px` : `0px`;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(() => {
        target.style.removeProperty('height');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
        target.classList.remove('_slide');
        document.dispatchEvent(
          new CustomEvent('slideDownDone', {
            detail: {
              target,
            },
          })
        );
      }, duration);
    }
  };
  let _slideToggle = (target, duration = 500) => {
    if (target.hidden) return _slideDown(target, duration);
    else return _slideUp(target, duration);
  };
  let bodyLockStatus = true;
  let bodyUnlock = (delay = 500) => {
    let body = document.querySelector('body');
    if (bodyLockStatus) {
      let lock_padding = document.querySelectorAll('[data-lp]');
      setTimeout(() => {
        for (let index = 0; index < lock_padding.length; index++) {
          const el = lock_padding[index];
          el.style.paddingRight = '0px';
        }
        body.style.paddingRight = '0px';
        document.documentElement.classList.remove('lock');
      }, delay);
      bodyLockStatus = false;
      setTimeout(function () {
        bodyLockStatus = true;
      }, delay);
    }
  };
  let bodyLock = (delay = 500) => {
    let body = document.querySelector('body');
    if (bodyLockStatus) {
      let lock_padding = document.querySelectorAll('[data-lp]');
      for (let index = 0; index < lock_padding.length; index++) {
        const el = lock_padding[index];
        el.style.paddingRight =
          window.innerWidth -
          document.querySelector('.wrapper').offsetWidth +
          'px';
      }
      body.style.paddingRight =
        window.innerWidth -
        document.querySelector('.wrapper').offsetWidth +
        'px';
      document.documentElement.classList.add('lock');
      bodyLockStatus = false;
      setTimeout(function () {
        bodyLockStatus = true;
      }, delay);
    }
  };
  function spollers() {
    const spollersArray = document.querySelectorAll('[data-spollers]');
    if (spollersArray.length > 0) {
      const spollersRegular = Array.from(spollersArray).filter(
        function (item, index, self) {
          return !item.dataset.spollers.split(',')[0];
        }
      );
      if (spollersRegular.length) initSpollers(spollersRegular);
      let mdQueriesArray = dataMediaQueries(spollersArray, 'spollers');
      if (mdQueriesArray && mdQueriesArray.length)
        mdQueriesArray.forEach((mdQueriesItem) => {
          mdQueriesItem.matchMedia.addEventListener('change', function () {
            initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
          });
          initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
      function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach((spollersBlock) => {
          spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
          if (matchMedia.matches || !matchMedia) {
            spollersBlock.classList.add('_spoller-init');
            initSpollerBody(spollersBlock);
            spollersBlock.addEventListener('click', setSpollerAction);
          } else {
            spollersBlock.classList.remove('_spoller-init');
            initSpollerBody(spollersBlock, false);
            spollersBlock.removeEventListener('click', setSpollerAction);
          }
        });
      }
      function initSpollerBody(spollersBlock, hideSpollerBody = true) {
        let spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
        if (spollerTitles.length) {
          spollerTitles = Array.from(spollerTitles).filter(
            (item) => item.closest('[data-spollers]') === spollersBlock
          );
          spollerTitles.forEach((spollerTitle) => {
            if (hideSpollerBody) {
              spollerTitle.removeAttribute('tabindex');
              if (!spollerTitle.classList.contains('_spoller-active'))
                spollerTitle.nextElementSibling.hidden = true;
            } else {
              spollerTitle.setAttribute('tabindex', '-1');
              spollerTitle.nextElementSibling.hidden = false;
            }
          });
        }
      }
      function setSpollerAction(e) {
        const el = e.target;
        if (el.closest('[data-spoller]')) {
          const spollerTitle = el.closest('[data-spoller]');
          const spollersBlock = spollerTitle.closest('[data-spollers]');
          const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');
          const spollerSpeed = spollersBlock.dataset.spollersSpeed
            ? parseInt(spollersBlock.dataset.spollersSpeed)
            : 500;
          if (!spollersBlock.querySelectorAll('._slide').length) {
            if (
              oneSpoller &&
              !spollerTitle.classList.contains('_spoller-active')
            )
              hideSpollersBody(spollersBlock);
            spollerTitle.classList.toggle('_spoller-active');
            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
          }
          e.preventDefault();
        }
      }
      function hideSpollersBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelector(
          '[data-spoller]._spoller-active'
        );
        const spollerSpeed = spollersBlock.dataset.spollersSpeed
          ? parseInt(spollersBlock.dataset.spollersSpeed)
          : 500;
        if (
          spollerActiveTitle &&
          !spollersBlock.querySelectorAll('._slide').length
        ) {
          spollerActiveTitle.classList.remove('_spoller-active');
          _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
        }
      }
      const spollersClose = document.querySelectorAll('[data-spoller-close]');
      if (spollersClose.length)
        document.addEventListener('click', function (e) {
          const el = e.target;
          if (!el.closest('[data-spollers]'))
            spollersClose.forEach((spollerClose) => {
              const spollersBlock = spollerClose.closest('[data-spollers]');
              if (spollersBlock.classList.contains('_spoller-init')) {
                const spollerSpeed = spollersBlock.dataset.spollersSpeed
                  ? parseInt(spollersBlock.dataset.spollersSpeed)
                  : 500;
                spollerClose.classList.remove('_spoller-active');
                _slideUp(spollerClose.nextElementSibling, spollerSpeed);
              }
            });
        });
    }
  }
  function menuOpen() {
    bodyLock();
    document.documentElement.classList.add('menu-open');
  }
  function functions_menuClose() {
    bodyUnlock();
    document.documentElement.classList.remove('menu-open');
  }
  function uniqArray(array) {
    return array.filter(function (item, index, self) {
      return self.indexOf(item) === index;
    });
  }
  function dataMediaQueries(array, dataSetValue) {
    const media = Array.from(array).filter(function (item, index, self) {
      if (item.dataset[dataSetValue])
        return item.dataset[dataSetValue].split(',')[0];
    });
    if (media.length) {
      const breakpointsArray = [];
      media.forEach((item) => {
        const params = item.dataset[dataSetValue];
        const breakpoint = {};
        const paramsArray = params.split(',');
        breakpoint.value = paramsArray[0];
        breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
        breakpoint.item = item;
        breakpointsArray.push(breakpoint);
      });
      let mdQueries = breakpointsArray.map(function (item) {
        return (
          '(' +
          item.type +
          '-width: ' +
          item.value +
          'px),' +
          item.value +
          ',' +
          item.type
        );
      });
      mdQueries = uniqArray(mdQueries);
      const mdQueriesArray = [];
      if (mdQueries.length) {
        mdQueries.forEach((breakpoint) => {
          const paramsArray = breakpoint.split(',');
          const mediaBreakpoint = paramsArray[1];
          const mediaType = paramsArray[2];
          const matchMedia = window.matchMedia(paramsArray[0]);
          const itemsArray = breakpointsArray.filter(function (item) {
            if (item.value === mediaBreakpoint && item.type === mediaType)
              return true;
          });
          mdQueriesArray.push({
            itemsArray,
            matchMedia,
          });
        });
        return mdQueriesArray;
      }
    }
  }
  let addWindowScrollEvent = false;
  function headerScroll() {
    addWindowScrollEvent = true;
    const header = document.querySelector('header.header');
    const headerShow = header.hasAttribute('data-scroll-show');
    const headerShowTimer = header.dataset.scrollShow
      ? header.dataset.scrollShow
      : 500;
    const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
    let scrollDirection = 0;
    let timer;
    document.addEventListener('windowScroll', function (e) {
      const scrollTop = window.scrollY;
      clearTimeout(timer);
      if (scrollTop >= startPoint) {
        !header.classList.contains('_header-scroll')
          ? header.classList.add('_header-scroll')
          : null;
        if (headerShow) {
          if (scrollTop > scrollDirection)
            header.classList.contains('_header-show')
              ? header.classList.remove('_header-show')
              : null;
          else
            !header.classList.contains('_header-show')
              ? header.classList.add('_header-show')
              : null;
          timer = setTimeout(() => {
            !header.classList.contains('_header-show')
              ? header.classList.add('_header-show')
              : null;
          }, headerShowTimer);
        }
      } else {
        header.classList.contains('_header-scroll')
          ? header.classList.remove('_header-scroll')
          : null;
        if (headerShow)
          header.classList.contains('_header-show')
            ? header.classList.remove('_header-show')
            : null;
      }
      scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
    });
  }
  setTimeout(() => {
    if (addWindowScrollEvent) {
      let windowScroll = new Event('windowScroll');
      window.addEventListener('scroll', function (e) {
        document.dispatchEvent(windowScroll);
      });
    }
  }, 0);
  class DynamicAdapt {
    constructor(type) {
      this.type = type;
    }
    init() {
      this.оbjects = [];
      this.daClassname = '_dynamic_adapt_';
      this.nodes = [...document.querySelectorAll('[data-da]')];
      this.nodes.forEach((node) => {
        const data = node.dataset.da.trim();
        const dataArray = data.split(',');
        const оbject = {};
        оbject.element = node;
        оbject.parent = node.parentNode;
        оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
        оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
        оbject.place = dataArray[2] ? dataArray[2].trim() : 'last';
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.оbjects.push(оbject);
      });
      this.arraySort(this.оbjects);
      this.mediaQueries = this.оbjects
        .map(
          ({ breakpoint }) =>
            `(${this.type}-width: ${breakpoint}px),${breakpoint}`
        )
        .filter((item, index, self) => self.indexOf(item) === index);
      this.mediaQueries.forEach((media) => {
        const mediaSplit = media.split(',');
        const matchMedia = window.matchMedia(mediaSplit[0]);
        const mediaBreakpoint = mediaSplit[1];
        const оbjectsFilter = this.оbjects.filter(
          ({ breakpoint }) => breakpoint === mediaBreakpoint
        );
        matchMedia.addEventListener('change', () => {
          this.mediaHandler(matchMedia, оbjectsFilter);
        });
        this.mediaHandler(matchMedia, оbjectsFilter);
      });
    }
    mediaHandler(matchMedia, оbjects) {
      if (matchMedia.matches)
        оbjects.forEach((оbject) => {
          this.moveTo(оbject.place, оbject.element, оbject.destination);
        });
      else
        оbjects.forEach(({ parent, element, index }) => {
          if (element.classList.contains(this.daClassname))
            this.moveBack(parent, element, index);
        });
    }
    moveTo(place, element, destination) {
      element.classList.add(this.daClassname);
      if (place === 'last' || place >= destination.children.length) {
        destination.append(element);
        return;
      }
      if (place === 'first') {
        destination.prepend(element);
        return;
      }
      destination.children[place].before(element);
    }
    moveBack(parent, element, index) {
      element.classList.remove(this.daClassname);
      if (parent.children[index] !== void 0)
        parent.children[index].before(element);
      else parent.append(element);
    }
    indexInParent(parent, element) {
      return [...parent.children].indexOf(element);
    }
    arraySort(arr) {
      if (this.type === 'min')
        arr.sort((a, b) => {
          if (a.breakpoint === b.breakpoint) {
            if (a.place === b.place) return 0;
            if (a.place === 'first' || b.place === 'last') return -1;
            if (a.place === 'last' || b.place === 'first') return 1;
            return 0;
          }
          return a.breakpoint - b.breakpoint;
        });
      else {
        arr.sort((a, b) => {
          if (a.breakpoint === b.breakpoint) {
            if (a.place === b.place) return 0;
            if (a.place === 'first' || b.place === 'last') return 1;
            if (a.place === 'last' || b.place === 'first') return -1;
            return 0;
          }
          return b.breakpoint - a.breakpoint;
        });
        return;
      }
    }
  }
  const da = new DynamicAdapt('max');
  da.init();
  const container = document.getElementById('timeline');
  if (container) {
    const today = new Date();
    let currentStart = new Date(today.getFullYear(), today.getMonth(), 1);
    let currentEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const items = new vis.DataSet([
      {
        id: 1,
        group: 1,
        content: '<span class="order-label">Заказ</span> №5318',
        start: '2025-01-04',
        end: '2025-01-12',
      },
      {
        id: 2,
        group: 2,
        content: '<span class="order-label">Заказ</span> №5318',
        start: '2025-01-01',
        end: '2025-01-09',
      },
      {
        id: 3,
        group: 3,
        content: '<span class="order-label">Заказ</span> №5318',
        start: '2025-01-12',
        end: '2025-01-20',
      },
      {
        id: 5,
        group: 5,
        content: '<span class="order-label">Заказ</span> №5318',
        start: '2025-02-01',
        end: '2025-02-28',
      },
    ]);
    const groups = new vis.DataSet([
      {
        id: 1,
        content:
          '<img src="/img/cars/skoda.png" alt="Skoda Kodiaq"> Skoda Kodiaq',
      },
      {
        id: 2,
        content: '<img src="/img/cars/bmw-x3.png" alt="BMW X3"> BMW X3',
      },
      {
        id: 3,
        content:
          '<img src="/img/cars/vw-golf.png" alt="Volkswagen Golf"> Volkswagen Golf',
      },
      {
        id: 4,
        content: '<img src="/img/cars/kia-rio.png" alt="Kia Rio"> Kia Rio',
      },
      {
        id: 5,
        content:
          '<img src="/img/cars/mercedes-gle.png" alt="Mercedes GLE"> Mercedes GLE',
      },
      {
        id: 6,
        content:
          '<img src="/img/cars/lada-vesta.png" alt="Lada Vesta"> Lada Vesta',
      },
    ]);
    function getTimelineOptions(currentStart, currentEnd) {
      const startOffset = new Date(currentStart);
      startOffset.setDate(startOffset.getDate() + 1);
      const daysInMonth = currentEnd.getDate();
      return {
        start: startOffset,
        end: currentEnd,
        min: startOffset,
        max: currentEnd,
        zoomMin: daysInMonth * 24 * 60 * 60 * 1e3,
        zoomMax: daysInMonth * 24 * 60 * 60 * 1e3,
        moveable: false,
        stack: false,
        orientation: {
          axis: 'top',
        },
        timeAxis: {
          scale: 'day',
          step: 1,
        },
        showCurrentTime: false,
        width: '100%',
        margin: {
          item: 10,
          axis: 10,
        },
        moment: function (date) {
          return vis.moment(date).startOf('day');
        },
      };
    }
    const options = getTimelineOptions(currentStart, currentEnd);
    const timeline = new vis.Timeline(container, items, groups, options);
    initializeCustomHeader();
    function initializeCustomHeader() {
      updateMonthHeader(currentStart);
      updateDaysRow(currentStart);
    }
    function updateTimeline(monthOffset) {
      currentStart = new Date(
        currentStart.getFullYear(),
        currentStart.getMonth() + monthOffset,
        1
      );
      currentEnd = new Date(
        currentStart.getFullYear(),
        currentStart.getMonth() + 1,
        0
      );
      const options = getTimelineOptions(currentStart, currentEnd);
      timeline.setOptions(options);
      timeline.setWindow(options.start, options.end, {
        animation: false,
      });
      updateMonthHeader(currentStart);
      updateDaysRow(currentStart);
    }
    function updateMonthHeader(date) {
      document.getElementById('monthYear').textContent = date.toLocaleString(
        'ru-RU',
        {
          year: 'numeric',
          month: 'long',
        }
      );
    }
    function updateDaysRow(date) {
      const daysRow = document.getElementById('daysRow');
      daysRow.innerHTML = '';
      const daysInMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();
      const dayWidth = 100 / daysInMonth;
      for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('span');
        dayElement.textContent = day;
        dayElement.style.display = 'inline-block';
        dayElement.style.width = `${dayWidth}%`;
        if (
          date.getFullYear() === today.getFullYear() &&
          date.getMonth() === today.getMonth() &&
          day === today.getDate()
        )
          dayElement.classList.add('current-day');
        daysRow.appendChild(dayElement);
      }
    }
    document
      .getElementById('prevMonthButton')
      .addEventListener('click', () => updateTimeline(-1));
    document
      .getElementById('nextMonthButton')
      .addEventListener('click', () => updateTimeline(1));
  }
  const carCard = document.querySelector('.car-card');
  if (carCard) {
    const slider = tns({
      container: '.my-slider',
      items: 1,
      slideBy: 'page',
      autoplay: false,
      controls: false,
      nav: false,
      touch: true,
      mouseDrag: true,
      loop: false,
      speed: 600,
    });
    let thumbs;
    let isVertical = window.innerWidth >= 992;
    function initializeThumbs() {
      if (thumbs) thumbs.destroy();
      thumbs = tns({
        container: '.my-thumbnails',
        items: 5,
        slideBy: 1,
        axis: isVertical ? 'vertical' : 'horizontal',
        controls: false,
        nav: true,
        gutter: 8,
        autoplay: false,
        touch: true,
        mouseDrag: true,
        loop: false,
        speed: 600,
      });
      attachThumbnailListeners();
    }
    function updateActiveThumbnail(index) {
      const thumbItems = document.querySelectorAll('.my-thumbnails .thumb');
      thumbItems.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
      });
    }
    function attachThumbnailListeners() {
      const thumbItems = document.querySelectorAll('.my-thumbnails .thumb');
      thumbItems.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
          slider.goTo(index);
        });
      });
    }
    slider.events.on('indexChanged', (info) => {
      const index = info.displayIndex - 1;
      thumbs.goTo(index);
      updateActiveThumbnail(index);
    });
    window.addEventListener('resize', () => {
      const newIsVertical = window.innerWidth >= 992;
      if (newIsVertical !== isVertical) {
        isVertical = newIsVertical;
        initializeThumbs();
      }
    });
    initializeThumbs();
    updateActiveThumbnail(0);
  }
  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++)
        arr2[i] = arr[i];
      return arr2;
    } else return Array.from(arr);
  }
  var hasPassiveEvents = false;
  if (typeof window !== 'undefined') {
    var passiveTestOptions = {
      get passive() {
        hasPassiveEvents = true;
        return;
      },
    };
    window.addEventListener('testPassive', null, passiveTestOptions);
    window.removeEventListener('testPassive', null, passiveTestOptions);
  }
  var isIosDevice =
    typeof window !== 'undefined' &&
    window.navigator &&
    window.navigator.platform &&
    (/iP(ad|hone|od)/.test(window.navigator.platform) ||
      (window.navigator.platform === 'MacIntel' &&
        window.navigator.maxTouchPoints > 1));
  var locks = [];
  var documentListenerAdded = false;
  var initialClientY = -1;
  var previousBodyOverflowSetting = void 0;
  var previousBodyPosition = void 0;
  var previousBodyPaddingRight = void 0;
  var allowTouchMove = function allowTouchMove(el) {
    return locks.some(function (lock) {
      if (lock.options.allowTouchMove && lock.options.allowTouchMove(el))
        return true;
      return false;
    });
  };
  var preventDefault = function preventDefault(rawEvent) {
    var e = rawEvent || window.event;
    if (allowTouchMove(e.target)) return true;
    if (e.touches.length > 1) return true;
    if (e.preventDefault) e.preventDefault();
    return false;
  };
  var setOverflowHidden = function setOverflowHidden(options) {
    if (previousBodyPaddingRight === void 0) {
      var _reserveScrollBarGap =
        !!options && options.reserveScrollBarGap === true;
      var scrollBarGap =
        window.innerWidth - document.documentElement.clientWidth;
      if (_reserveScrollBarGap && scrollBarGap > 0) {
        var computedBodyPaddingRight = parseInt(
          window
            .getComputedStyle(document.body)
            .getPropertyValue('padding-right'),
          10
        );
        previousBodyPaddingRight = document.body.style.paddingRight;
        document.body.style.paddingRight =
          computedBodyPaddingRight + scrollBarGap + 'px';
      }
    }
    if (previousBodyOverflowSetting === void 0) {
      previousBodyOverflowSetting = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
  };
  var restoreOverflowSetting = function restoreOverflowSetting() {
    if (previousBodyPaddingRight !== void 0) {
      document.body.style.paddingRight = previousBodyPaddingRight;
      previousBodyPaddingRight = void 0;
    }
    if (previousBodyOverflowSetting !== void 0) {
      document.body.style.overflow = previousBodyOverflowSetting;
      previousBodyOverflowSetting = void 0;
    }
  };
  var setPositionFixed = function setPositionFixed() {
    return window.requestAnimationFrame(function () {
      if (previousBodyPosition === void 0) {
        previousBodyPosition = {
          position: document.body.style.position,
          top: document.body.style.top,
          left: document.body.style.left,
        };
        var _window = window,
          scrollY = _window.scrollY,
          scrollX = _window.scrollX,
          innerHeight = _window.innerHeight;
        document.body.style.position = 'fixed';
        document.body.style.top = -scrollY;
        document.body.style.left = -scrollX;
        setTimeout(function () {
          return window.requestAnimationFrame(function () {
            var bottomBarHeight = innerHeight - window.innerHeight;
            if (bottomBarHeight && scrollY >= innerHeight)
              document.body.style.top = -(scrollY + bottomBarHeight);
          });
        }, 300);
      }
    });
  };
  var restorePositionSetting = function restorePositionSetting() {
    if (previousBodyPosition !== void 0) {
      var y = -parseInt(document.body.style.top, 10);
      var x = -parseInt(document.body.style.left, 10);
      document.body.style.position = previousBodyPosition.position;
      document.body.style.top = previousBodyPosition.top;
      document.body.style.left = previousBodyPosition.left;
      window.scrollTo(x, y);
      previousBodyPosition = void 0;
    }
  };
  var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled(
    targetElement
  ) {
    return targetElement
      ? targetElement.scrollHeight - targetElement.scrollTop <=
          targetElement.clientHeight
      : false;
  };
  var handleScroll = function handleScroll(event, targetElement) {
    var clientY = event.targetTouches[0].clientY - initialClientY;
    if (allowTouchMove(event.target)) return false;
    if (targetElement && targetElement.scrollTop === 0 && clientY > 0)
      return preventDefault(event);
    if (isTargetElementTotallyScrolled(targetElement) && clientY < 0)
      return preventDefault(event);
    event.stopPropagation();
    return true;
  };
  var disableBodyScroll = function disableBodyScroll(targetElement, options) {
    if (!targetElement) {
      console.error(
        'disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.'
      );
      return;
    }
    if (
      locks.some(function (lock) {
        return lock.targetElement === targetElement;
      })
    )
      return;
    var lock = {
      targetElement,
      options: options || {},
    };
    locks = [].concat(_toConsumableArray(locks), [lock]);
    if (isIosDevice) setPositionFixed();
    else setOverflowHidden(options);
    if (isIosDevice) {
      targetElement.ontouchstart = function (event) {
        if (event.targetTouches.length === 1)
          initialClientY = event.targetTouches[0].clientY;
      };
      targetElement.ontouchmove = function (event) {
        if (event.targetTouches.length === 1)
          handleScroll(event, targetElement);
      };
      if (!documentListenerAdded) {
        document.addEventListener(
          'touchmove',
          preventDefault,
          hasPassiveEvents
            ? {
                passive: false,
              }
            : void 0
        );
        documentListenerAdded = true;
      }
    }
  };
  var enableBodyScroll = function enableBodyScroll(targetElement) {
    if (!targetElement) {
      console.error(
        'enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.'
      );
      return;
    }
    locks = locks.filter(function (lock) {
      return lock.targetElement !== targetElement;
    });
    if (isIosDevice) {
      targetElement.ontouchstart = null;
      targetElement.ontouchmove = null;
      if (documentListenerAdded && locks.length === 0) {
        document.removeEventListener(
          'touchmove',
          preventDefault,
          hasPassiveEvents
            ? {
                passive: false,
              }
            : void 0
        );
        documentListenerAdded = false;
      }
    }
    if (isIosDevice) restorePositionSetting();
    else restoreOverflowSetting();
  };
  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }
  function openModal(modal) {
    const scrollbarWidth = getScrollbarWidth();
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    disableBodyScroll(modal);
  }
  function closeModal(modal) {
    document.body.style.paddingRight = '';
    enableBodyScroll(modal);
  }
  MicroModal.init({
    onShow: openModal,
    onClose: closeModal,
  });
  const containerCalendar = document.querySelector('.car-card');
  Datepicker.locales.ru = {
    days: [
      'Воскресенье',
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
    ],
    daysShort: ['Вос', 'Пон', 'Вто', 'Сре', 'Чет', 'Пят', 'Суб'],
    daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    months: [
      'Январь',
      'Февраль',
      'Март',
      'Апрель',
      'Май',
      'Июнь',
      'Июль',
      'Август',
      'Сентябрь',
      'Октябрь',
      'Ноябрь',
      'Декабрь',
    ],
    monthsShort: [
      'Янв',
      'Фев',
      'Мар',
      'Апр',
      'Май',
      'Июн',
      'Июл',
      'Авг',
      'Сен',
      'Окт',
      'Ноя',
      'Дек',
    ],
    today: 'Сегодня',
    clear: 'Очистить',
    format: 'dd.mm.yyyy',
    weekStart: 1,
  };
  if (containerCalendar) {
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const startResetButton = startDateInput.nextElementSibling;
    const endResetButton = endDateInput.nextElementSibling;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDatePicker = new Datepicker(startDateInput, {
      autohide: true,
      minDate: today,
      language: 'ru',
    });
    const endDatePicker = new Datepicker(endDateInput, {
      autohide: true,
      minDate: today,
      language: 'ru',
    });
    startResetButton.style.display = 'none';
    endResetButton.style.display = 'none';
    let startSelectedDate = null;
    let endSelectedDate = null;
    startDateInput.addEventListener('changeDate', function () {
      startSelectedDate = startDatePicker.getDate();
      console.log('Start Date Selected:', startSelectedDate);
      if (startSelectedDate) {
        startResetButton.style.display = 'block';
        endDatePicker.setDate(startSelectedDate);
        endDatePicker.show();
      }
    });
    endDateInput.addEventListener('changeDate', function () {
      endSelectedDate = endDatePicker.getDate();
      console.log('End Date Selected:', endSelectedDate);
      if (endSelectedDate) {
        endResetButton.style.display = 'block';
        highlightRange(startSelectedDate, endSelectedDate);
      }
    });
    startResetButton.addEventListener('click', function () {
      console.log('Reset Start Date');
      startDateInput.value = '';
      startDateInput.placeholder = 'Начинание';
      startResetButton.style.display = 'none';
      endDateInput.value = '';
      endDateInput.placeholder = 'Завершение';
      endResetButton.style.display = 'none';
      startSelectedDate = null;
      endSelectedDate = null;
    });
    endResetButton.addEventListener('click', function () {
      console.log('Reset End Date');
      endDateInput.value = '';
      endDateInput.placeholder = 'Завершение';
      endResetButton.style.display = 'none';
      endSelectedDate = null;
    });
    function highlightRange(startDate, endDate) {
      if (!startDate || !endDate) return;
      const calendarDays = document.querySelectorAll(
        '.datepicker .datepicker-days td'
      );
      calendarDays.forEach((day) => {
        const dayDate = new Date(day.dataset.date);
        if (dayDate >= startDate && dayDate <= endDate)
          day.classList.add('highlight-range');
        else day.classList.remove('highlight-range');
      });
    }
    startDatePicker.element.addEventListener('show', function () {
      if (startSelectedDate && endSelectedDate)
        highlightRange(startSelectedDate, endSelectedDate);
    });
    endDatePicker.element.addEventListener('show', function () {
      if (startSelectedDate && endSelectedDate)
        highlightRange(startSelectedDate, endSelectedDate);
    });
    const style = document.createElement('style');
    style.innerHTML = `\n\t  .highlight-range {\n\t\t background-color: red !important;\n\t\t color: white;\n\t  }\n\t`;
    document.head.appendChild(style);
  }
  const mapCustom = document.querySelector('.map-custom');
  if (mapCustom) {
    ymaps.ready(init);
    function init() {
      var map = new ymaps.Map('map', {
        center: [62.035454, 129.675476],
        zoom: 13,
        controls: [],
      });
      var cars = [
        {
          id: 1,
          name: 'BMW X3',
          coordinates: [62.035454, 129.675476],
          info: 'Внедорожник, 2020 год',
          imageUrl: 'img/cars/bmw-x3.png',
          details: [
            {
              label: 'Цена: ',
              value: '9 000 ₽ / сутки ',
            },
            {
              label: 'Статус:',
              value: 'свободна с 31 января',
            },
          ],
        },
        {
          id: 2,
          name: 'Газель',
          coordinates: [62.045454, 129.685476],
          info: 'Грузовик, 2018 год',
          imageUrl: 'img/cars/bmw-x3.png',
          details: [
            {
              label: 'Цена: ',
              value: '9 000 ₽ / сутки ',
            },
            {
              label: 'Статус:',
              value: 'свободна с 31 января',
            },
          ],
        },
      ];
      var defaultIconUrl = 'img/icons/custom-markers.svg';
      var hoverIconUrl = 'img/icons/hover-custom-marker.svg';
      cars.forEach(function (car) {
        var balloonContent = `\n\t\t\t\t\t\t\t  <div class="custom-balloon">\n\t\t\t\t\t\t\t\t\t<div class="custom-balloon__header">\n\t\t\t\t\t\t\t\t\t\t <img src="${
          car.imageUrl
        }" alt="${
          car.name
        }" class="custom-balloon__image">\n\t\t\t\t\t\t\t\t\t\t <p class="custom-balloon__name">${
          car.name
        }</p>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<div class="custom-balloon__content">\n\t\t\t\t\t\t\t\t\t\t ${car.details
          .map(
            (detail) =>
              `\n\t\t\t\t\t\t\t\t\t\t <div class="custom-balloon__item">\n\t\t\t\t\t\t\t\t\t\t\t  <div class="custom-balloon__label">${detail.label}</div>\n\t\t\t\t\t\t\t\t\t\t\t  <div class="custom-balloon__value">${detail.value}</div>\n\t\t\t\t\t\t\t\t\t\t </div>`
          )
          .join(
            ''
          )}\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t  </div>\n\t\t\t\t\t\t `;
        var placemark = new ymaps.Placemark(
          car.coordinates,
          {
            balloonContent,
          },
          {
            iconLayout: 'default#image',
            iconImageHref: defaultIconUrl,
            iconImageSize: [70, 70],
            iconImageOffset: [-17, -49],
          }
        );
        placemark.events.add('mouseenter', function () {
          placemark.options.set('iconImageHref', hoverIconUrl);
          placemark.options.set('iconImageSize', [70, 70]);
          placemark.options.set('iconImageOffset', [-17, -49]);
        });
        placemark.events.add('mouseleave', function () {
          placemark.options.set('iconImageHref', defaultIconUrl);
          placemark.options.set('iconImageSize', [70, 70]);
          placemark.options.set('iconImageOffset', [-17, -49]);
        });
        map.geoObjects.add(placemark);
      });
    }
  }
  const burgerOpenButton = document.querySelector('.icon-menu');
  const burgerCloseButton = document.querySelector('.menu__close');
  if (burgerOpenButton)
    burgerOpenButton.addEventListener('click', () => {
      menuOpen();
    });
  if (burgerCloseButton)
    burgerCloseButton.addEventListener('click', () => {
      functions_menuClose();
    });
  const filterOpenButton = document.querySelector('.filter-btn');
  const filterCloseButton = document.querySelector('.filter-block__close');
  if (filterOpenButton)
    filterOpenButton.addEventListener('click', () => {
      document.documentElement.classList.add('filter-open');
      bodyLock();
    });
  if (filterCloseButton)
    filterCloseButton.addEventListener('click', () => {
      document.documentElement.classList.remove('filter-open');
      bodyUnlock();
    });
  let activeButtonsState = {
    '.autopark__regions': new Set(),
    '.autopark__cars': new Set(),
  };
  function transformButtonsToCheckboxes(parentSelector) {
    const parentElement = document.querySelector(parentSelector);
    if (parentElement) {
      const buttons = parentElement.querySelectorAll('button');
      buttons.forEach((button) => {
        const isActive = button.classList.contains('active');
        if (isActive)
          activeButtonsState[parentSelector].add(button.textContent.trim());
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = button.textContent.trim();
        checkbox.name = parentSelector.replace('.', '');
        checkbox.value = button.textContent.trim();
        checkbox.classList.add('custom-checkbox');
        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = button.textContent;
        label.classList.add('custom-label');
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) label.classList.add('checked-label');
          else label.classList.remove('checked-label');
          if (button.textContent.trim() === 'Все регионы') {
            const allCheckboxes = parentElement.querySelectorAll(
              'input[type="checkbox"]'
            );
            allCheckboxes.forEach((cb) => {
              if (cb !== checkbox) {
                cb.checked = checkbox.checked;
                cb.dispatchEvent(new Event('change'));
              }
            });
          }
        });
        const li = button.parentElement;
        li.innerHTML = '';
        li.appendChild(checkbox);
        li.appendChild(label);
      });
    }
  }
  function transformCheckboxesToButtons(parentSelector) {
    const parentElement = document.querySelector(parentSelector);
    if (parentElement) {
      const checkboxes = parentElement.querySelectorAll(
        'input[type="checkbox"]'
      );
      checkboxes.forEach((checkbox) => {
        const button = document.createElement('button');
        button.textContent = checkbox.value;
        if (activeButtonsState[parentSelector].has(button.textContent.trim()))
          button.classList.add('active');
        const li = checkbox.parentElement;
        li.innerHTML = '';
        li.appendChild(button);
      });
    }
  }
  function checkScreenSize() {
    if (window.innerWidth <= 768) {
      transformButtonsToCheckboxes('.autopark__regions');
      transformButtonsToCheckboxes('.autopark__cars');
    } else {
      transformCheckboxesToButtons('.autopark__regions');
      transformCheckboxesToButtons('.autopark__cars');
    }
  }
  window.addEventListener('resize', checkScreenSize);
  document.addEventListener('DOMContentLoaded', checkScreenSize);
  if (document.querySelector('.file-upload-container'))
    document.querySelectorAll('.file-upload-container').forEach((container) => {
      const fileInput = container.querySelector('.file-upload-input');
      const fileNameDisplay = container.querySelector('.file-upload-filename');
      container.addEventListener('click', (event) => {
        if (event.target !== fileInput) fileInput.click();
      });
      fileInput.addEventListener('change', () => {
        const fileName = fileInput.files.length
          ? fileInput.files[0].name
          : 'No file chosen';
        fileNameDisplay.textContent = fileName;
      });
    });
  const checkboxes = document.querySelectorAll('.customSwitch');
  if (checkboxes)
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', function () {
        const switchContainer = this.closest('.switch-container');
        if (this.checked) switchContainer.classList.add('active');
        else switchContainer.classList.remove('active');
      });
    });
  const bookingNotificationBooking = document.querySelector(
    '.booking-notification__close'
  );
  const infoBtn = document.querySelector('.car-card__info-details');
  const bookingNotification = document.querySelector('.booking-notification');
  if (infoBtn) {
    infoBtn.addEventListener('mouseenter', () => {
      bookingNotification.style.display = 'flex';
    });
    infoBtn.addEventListener('click', () => {
      bookingNotification.style.display = 'flex';
    });
  }
  if (bookingNotificationBooking)
    bookingNotificationBooking.addEventListener('click', () => {
      bookingNotification.style.display = 'none';
    });
  document.addEventListener('DOMContentLoaded', function () {
    const passwordInputs = document.querySelectorAll('.password-input');
    const toggleButtons = document.querySelectorAll('.password-toggle');
    console.log(toggleButtons);
    console.log(passwordInputs);
    toggleButtons.forEach((button, index) => {
      if (passwordInputs[index])
        button.addEventListener('click', function (event) {
          event.preventDefault();
          const input = passwordInputs[index];
          const img = button.querySelector('img');
          if (input.type === 'password') {
            input.type = 'text';
            img.src = 'img/icons/eye.svg';
            img.alt = 'Скрыть';
          } else {
            input.type = 'password';
            img.src = 'img/icons/eye-slash.svg';
            img.alt = 'Показать';
          }
        });
    });
  });
  window['FLS'] = false;
  spollers();
  headerScroll();
})();
