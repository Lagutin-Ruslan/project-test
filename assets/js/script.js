// Отображение dot в крайних пунктах заказа---------------------

function hidePointsForLastInRow() {
    const container = document.querySelector('.order__list');
    if (!container) return;

    const items = container.querySelectorAll('li');
    if (items.length === 0) return;

    // Сбрасываем скрытие у всех элементов (если функция вызывается повторно)
    items.forEach(item => {
        const pointsBlock = item.querySelector('.order__item-points');
        if (pointsBlock) pointsBlock.style.display = 'flex';
    });

    // Получаем текущее количество колонок из CSS Grid
    const containerStyle = window.getComputedStyle(container);
    const columnCount = containerStyle.gridTemplateColumns.split(' ').length;

    // Скрываем .order__item-points у последних элементов в строке
    items.forEach((item, index) => {
        const isLastInRow = (index + 1) % columnCount === 0;
        if (isLastInRow) {
            const pointsBlock = item.querySelector('.order__item-points');
            if (pointsBlock) pointsBlock.style.display = 'none';
        }
    });

    // Скрываем у последнего элемента, если строка неполная
    const isLastRowIncomplete = items.length % columnCount !== 0;
    if (isLastRowIncomplete) {
        const lastItem = items[items.length - 1];
        const pointsBlock = lastItem.querySelector('.order__item-points');
        if (pointsBlock) pointsBlock.style.display = 'none';
    }
}

// Запускаем при загрузке и при изменении размера окна
window.addEventListener('load', hidePointsForLastInRow);
window.addEventListener('resize', hidePointsForLastInRow);

// -----------------------------------------------------------


// Select ----------------------------------------------------

// Инициализация кастомных выпадающих списков
function initCustomSelect() {
    const selectContainers = document.querySelectorAll('[data-select]');

    if (!selectContainers.length) return;

    selectContainers.forEach(container => {
        setupCustomSelect(container);
    });
}

// @param {HTMLElement} container - Контейнер селекта
function setupCustomSelect(container) {
    const selectButton = container.querySelector('[data-select-button]');
    const displayText = selectButton.querySelector('.order__select-text');
    const options = container.querySelectorAll('[data-select-value]');
    const hiddenInput = container.querySelector('[data-select-input]');
    let selectedOption = null;

    // Находим изначально выбранный вариант
    options.forEach(option => {
        if (option.classList.contains('is-active')) {
            selectedOption = option;
        }
    });

    // Обработчик кликов
    document.addEventListener('click', (event) => {
        const clickedElement = event.target;

        if (clickedElement.closest('[data-select]')) {
            // Клик внутри селекта
            handleSelectClick(clickedElement);
        } else if (container.classList.contains('is-open')) {
            // Клик снаружи - закрываем
            container.classList.remove('is-open');
        }
    });

    // Обработчик клавиатуры
    document.addEventListener('keydown', (event) => {
        if (!event.target.closest('[data-select]')) return;

        switch (event.key) {
            case 'Tab':
                handleTabKey(event);
                break;
            case 'Enter':
                handleEnterKey(event);
                break;
            case 'Escape':
                container.classList.remove('is-open');
                break;
        }
    });

    // Обработка клика по элементам селекта
    function handleSelectClick(clickedElement) {
        if (clickedElement.closest('[data-select-value]')) {
            const clickedOption = clickedElement.closest('[data-select-value]');

            // Снимаем выделение с предыдущего варианта
            if (selectedOption) {
                selectedOption.classList.remove('is-active');
            }

            // Устанавливаем новый вариант
            clickedOption.classList.add('is-active');
            selectedOption = clickedOption;
            displayText.textContent = clickedOption.textContent;
            hiddenInput.setAttribute('value', clickedOption.textContent);
        }

        // Переключаем состояние открытия
        container.classList.toggle('is-open');
    }

    // Обработка нажатия Tab
    function handleTabKey(event) {
        if (!event.target.closest('[data-select-value]')) return;

        const focusedOption = event.target.closest('[data-select-value]');
        const optionIndex = Array.from(options).indexOf(focusedOption);

        // Закрываем если это последний элемент
        if (optionIndex === options.length - 1 && container.classList.contains('is-open')) {
            container.classList.remove('is-open');
        }
    }

    // Обработка нажатия Enter
    function handleEnterKey(event) {
        if (!event.target.closest('[data-select-value]')) return;

        const focusedOption = event.target.closest('[data-select-value]');

        if (selectedOption) {
            selectedOption.classList.remove('is-active');
        }

        focusedOption.classList.add('is-active');
        selectedOption = focusedOption;
        displayText.textContent = focusedOption.textContent;
        hiddenInput.setAttribute('value', focusedOption.textContent);

        if (container.classList.contains('is-open')) {
            container.classList.remove('is-open');
        }
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    initCustomSelect();
});

// ----------------------------------------------------------------

// Range

const rangeInput = document.querySelector('.order__range-input');
const rangeNum = document.querySelector('.order__range-num');

rangeInput.addEventListener('input', () => {
    rangeNum.textContent = rangeInput.value + "%";
})

// ----------------------------------------------------------------

// File

const inputsFile = document.querySelectorAll('.order__file-input');

inputsFile.forEach(input => {
    let inputText = document.querySelector('.order__file-text');

    input.addEventListener('change', (e) => {
        const countFiles = input.files.length;

        if (e.target.files && e.target.files.length > 0) {
            inputText.innerText = `Добавлено файлов: ${countFiles}`;
        }
    })
})

document.querySelector('.order__file').addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        document.getElementById('file').click();
    }
});

// ----------------------------------------------------------------

// Berger menu

const burgerBtn = document.querySelector('.burger-btn');
const burgerMnu = document.querySelector('.burger-mnu');
const lineTop = document.querySelector('.line__top');
const lineBottom = document.querySelector('.line__bottom');

// Функция для анимации меню
function toggleMenu() {
    if (burgerMnu.classList.contains('is-opening') || burgerMnu.classList.contains('is-closing')) {
        return; // Предотвращаем множественные клики во время анимации
    }

    if (burgerMnu.classList.contains('is-open')) {
        closeMenu();
    } else {
        openMenu();
    }
}

function openMenu() {
    // Начало анимации открытия
    burgerMnu.style.display = 'block';
    burgerMnu.classList.add('is-opening');
    burgerBtn.setAttribute('aria-expanded', 'true');
    lineTop.classList.add('line__top--open');
    lineBottom.classList.add('line__bottom--open');
    document.body.style.overflow = 'hidden';

    // Запуск анимации
    requestAnimationFrame(() => {
        burgerMnu.style.maxHeight = burgerMnu.scrollHeight + 'px';
        burgerMnu.style.opacity = '1';
    });

    // Завершение анимации
    setTimeout(() => {
        burgerMnu.classList.remove('is-opening');
        burgerMnu.classList.add('is-open');
        burgerMnu.style.maxHeight = ''; // Сброс для адаптивности
        burgerBtn.focus();
    }, 500);
}

function closeMenu() {
    // Начало анимации закрытия
    burgerMnu.style.maxHeight = burgerMnu.scrollHeight + 'px';
    burgerMnu.classList.add('is-closing');
    lineTop.classList.remove('line__top--open');
    lineBottom.classList.remove('line__bottom--open');

    // Запуск анимации
    requestAnimationFrame(() => {
        burgerMnu.style.maxHeight = '0';
        burgerMnu.style.opacity = '0';
    });

    // Завершение анимации
    setTimeout(() => {
        burgerMnu.classList.remove('is-closing', 'is-open');
        burgerMnu.style.display = 'none';
        burgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }, 500);
}

function closeMenuOnClickOutside(e) {
    if (!burgerMnu.contains(e.target) && e.target !== burgerBtn && burgerMnu.classList.contains('is-open')) {
        closeMenu();
    }
}

function closeMenuOnLinkClick(e) {
    if (e.target.closest('a') && burgerMnu.classList.contains('is-open')) {
        closeMenu();
    }
}

function initBurgerMenu() {
    burgerBtn.setAttribute('aria-controls', 'burger-mnu');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerMnu.setAttribute('id', 'burger-mnu');

    // Инициализация стилей для анимации
    burgerMnu.style.transition = 'max-height 0.5s ease, opacity 0.5s ease';
    burgerMnu.style.overflow = 'hidden';
    burgerMnu.style.maxHeight = '0';
    burgerMnu.style.opacity = '0';

    burgerBtn.addEventListener('click', toggleMenu);
    burgerMnu.addEventListener('click', closeMenuOnLinkClick);
    document.addEventListener('click', closeMenuOnClickOutside);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && burgerMnu.classList.contains('is-open')) {
            closeMenu();
            burgerBtn.focus();
        }
    });
}

initBurgerMenu();

// ------------------------------------------------------------------------------