document.addEventListener("DOMContentLoaded", function() {

    // Создаем контейнер для кнопок
    const containerMain = document.createElement('div');
    containerMain.id = 'sections-container';

    // Названия разделов
    const sections = [
        { id: 'main', name: 'Главная' },
        { id: 'food-diary', name: 'Дневник питания' },
        { id: 'anthropometry', name: 'Антропометрия' },
        { id: 'sport', name: 'Спорт' },
        { id: 'analyzes', name: 'Анализы' },
    ];

    // Функция для создания кнопки
    function createButton(id, name) {
        const button = document.createElement('button');
        button.id = id;
        button.className = 'section-button';
        button.textContent = name;

        // При клике меняем хэш в URL и прокручиваем страницу
        button.addEventListener('click', () => {
            window.location.hash = id;
            setActiveButton(id);
            // Прокрутка страницы к началу
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        return button;
    }

    // Функция для установки активной кнопки
    function setActiveButton(activeId) {
        sections.forEach(section => {
            const button = document.getElementById(section.id);
            if (section.id === activeId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Добавляем кнопки в контейнер
    sections.forEach(section => {
        const button = createButton(section.id, section.name);
        containerMain.appendChild(button);
    });

    // Найдем элемент с id 'max' и добавим туда контейнер вторым
    const maxElement = document.getElementById('max');
    if (maxElement) {
        if (maxElement.children.length >= 1) {
            maxElement.insertBefore(containerMain, maxElement.children[1]);
        } else {
            maxElement.appendChild(containerMain); // Если есть только один элемент или ни одного
        }
    }

    // Проверяем текущий хэш и устанавливаем активную кнопку
    window.addEventListener('hashchange', () => {
        setActiveButton(window.location.hash.substring(1));
    });

    // Изначально активная кнопка
    setActiveButton(window.location.hash.substring(1) || 'food-diary');










    // Восстановление позиции прокрутки
    const savedScrollPosition = localStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition, 10));
        localStorage.removeItem('scrollPosition');
    }

    // Дополнительные глобальные переменные
    let globalProteinNorm, globalFatsNorm, globalCarbsNorm, globalFiberNorm, globalWaterNorm, globalMetabolicAge;

    // Функции для расчета норм потребления
    function calculateNutrientNorms(weight) {
        globalProteinNorm = (1.0 * weight).toFixed(2);
        globalFatsNorm = (1.0 * weight).toFixed(2);
        globalCarbsNorm = (4.0 * weight).toFixed(2);
        globalFiberNorm = 28;
        globalWaterNorm = (35 * weight).toFixed(2);
    }

    let globalBMR;

    const buttonClass = 'profile-btn';
    const modalClass = 'profile-modal';
    const closeButtonClass = 'close-btn';

    const header = document.createElement('header');

    const button = document.createElement('button');
    button.className = buttonClass;
    button.id = "toggle-profile";
    
    document.body.appendChild(button);

    const modal = document.createElement('div');
    modal.className = modalClass;
    modal.innerHTML = `
        <button class="${closeButtonClass}">&times;</button>
        <h2>Основные данные пользователя</h2>
        <label for="first-name">Имя:</label>
        <input type="text" id="first-name" placeholder="Имя">
        <label for="last-name">Фамилия:</label>
        <input type="text" id="last-name" placeholder="Фамилия">
        <label for="birth-date">Дата рождения:</label>
        <input type="date" id="birth-date">
        <p id="age">Возраст:</p>
        <label for="gender">Пол:</label>
        <select id="gender">
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
            <option value="other">Другой</option>
        </select>
        <label for="height">Рост (см):</label>
        <input type="number" id="height" placeholder="Рост (см)">
        <label for="weight">Вес (кг):</label>
        <input type="number" id="weight" placeholder="Вес (кг)">
        <label for="body-fat">Общий жир (%):</label>
        <input type="number" id="body-fat" placeholder="Процент жира в организме">
        <p id="bmi">ИМТ:</p>
        <label for="activity-level">Уровень физической активности:</label>
        <select id="activity-level">
            <option value="">Выберите уровень</option>
            <option value="1.2">Сидячий образ жизни</option>
            <option value="1.375">Малая активность</option>
            <option value="1.55">Умеренный спорт</option>
            <option value="1.725">Интенсивный спорт</option>
            <option value="1.9">Профессиональный спорт</option>
        </select>
        <p id="bmr">Базальный метаболизм (BMR):</p>
        <p id="metabolic-age">Метаболический возраст:</p>
    `;
    document.body.appendChild(modal);

    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const birthDateInput = document.getElementById('birth-date');
    const ageParagraph = document.getElementById('age');
    const genderSelect = document.getElementById('gender');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const bodyFatInput = document.getElementById('body-fat');
    const activityLevelSelect = document.getElementById('activity-level');
    const bmiParagraph = document.getElementById('bmi');
    const bmrParagraph = document.getElementById('bmr');
    const metabolicAgeParagraph = document.getElementById('metabolic-age');

    // Функция для обновления кнопки профиля
function updateProfileButton() {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();

    if (firstName && lastName) {
        // Если имя и фамилия заданы, показываем первую букву имени и фамилии
        button.innerHTML = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
        button.style.fontSize = '20px'; // Увеличиваем размер шрифта для букв
        button.style.display = 'flex';
        button.style.alignItems = 'center'; // Вертикальное выравнивание по центру
        button.style.justifyContent = 'center'; // Горизонтальное выравнивание по центру
    } else {
        // Если имя и фамилия не заданы, показываем значок по умолчанию
        button.innerHTML = '&#128100;';
        button.style.fontSize = '20px'; // Размер шрифта для иконки
        button.style.justifyContent = 'center'; // Горизонтальное выравнивание по центру
    }
}



    // Функция для обновления возраста
function updateAge() {
    const birthDateValue = birthDateInput.value;
    if (birthDateValue) {
        const [year, month, day] = birthDateValue.split('-').map(Number);
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const isBeforeBirthday = today.getMonth() < birthDate.getMonth() ||
                                 (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
        if (isBeforeBirthday) {
            age--;
        }
        ageParagraph.textContent = `Возраст: ${age} лет`;
        return age;
    } else {
        ageParagraph.textContent = 'Возраст:';
        return null;
    }
}

// Функция для определения категории ИМТ и соответствующего CSS-класса
function getBMICategoryAndClass(bmi) {
    let category = '';
    let cssClass = '';

    if (bmi < 15) {
        category = 'Острый дефицит массы тела';
        cssClass = 'bmi-acute-deficit';
    } else if (bmi >= 15 && bmi < 18.5) {
        category = 'Недостаточная масса тела';
        cssClass = 'bmi-insufficient';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Норма';
        cssClass = 'bmi-normal';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Избыточная масса тела';
        cssClass = 'bmi-overweight';
    } else if (bmi >= 30 && bmi < 35) {
        category = 'Ожирение 1 степени';
        cssClass = 'bmi-obesity-1';
    } else if (bmi >= 35 && bmi < 40) {
        category = 'Ожирение 2 степени';
        cssClass = 'bmi-obesity-2';
    } else {
        category = 'Ожирение 3 степени';
        cssClass = 'bmi-obesity-3';
    }

    return { category, cssClass };
}

// Функция для обновления ИМТ с индикатором
function updateBMI() {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    if (height && weight) {
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

        // Получаем категорию и CSS-класс на основе ИМТ
        const { category, cssClass } = getBMICategoryAndClass(bmi);

        // Обновляем HTML с индикатором и подсказкой
        bmiParagraph.innerHTML = `
            <strong>ИМТ:</strong> ${bmi}
            <div class="bmi-indicator ${cssClass}">
                ${category}
            </div>
        `;

        // Добавляем элемент с классом "tooltip" и атрибутом data-tooltip для всплывающей подсказки
        bmiParagraph.classList.add('tooltip');
        bmiParagraph.setAttribute('data-tooltip', 'Острый дефицит: < 15\nНедостаточная масса: 15 - 18.5\nНорма: 18.5 - 24.9\nИзбыточная масса: 25 - 29.9\nОжирение 1 степени: 30 - 34.9\nОжирение 2 степени: 35 - 39.9\nОжирение 3 степени: >= 40');

        return bmi;
    } else {
        bmiParagraph.innerHTML = '<strong>ИМТ:</strong>';
        bmiParagraph.classList.remove('tooltip');
        bmiParagraph.removeAttribute('data-tooltip');
        return null;
    }
}
    let GlobalpercentageBMR;

// Функция для обновления BMR (формула Миффлина-Сан Жеора)
function updateBMR(age) {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);
    const gender = genderSelect.value;
    
    if (height && weight && age !== null) {
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else if (gender === 'female') {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        } else {
            bmr = null; // Для прочих гендеров можно либо добавить усредненное значение, либо оставить пустым
        }
        bmr = bmr ? bmr.toFixed(2) : 'N/A';
        bmrParagraph.innerHTML = `<strong>Базальный метаболизм (BMR):</strong> ${bmr} ккал/день`;

        // Сохранение в глобальную переменную и в локальное хранилище
        globalBMR = bmr;
        localStorage.setItem('globalBMR', bmr);

        const dailyCaloriesElement = document.getElementById('daily-calories');
        if (dailyCaloriesElement) {
            const dailyCalories = parseFloat(dailyCaloriesElement.textContent);

            // Рассчет процента от BMR
            const percentage = dailyCalories && globalBMR != 0 ? ((dailyCalories / globalBMR) * 100).toFixed(2) : '0';

            GlobalpercentageBMR = percentage;
            localStorage.setItem('globalPercentageBMR', GlobalpercentageBMR);

            // Определение цвета прогресс-бара в зависимости от процента
            const percentValue = parseFloat(percentage);
            let progressBarColorClass = '';

            if (percentValue <= 15) {
                progressBarColorClass = 'blue';
            } else if (percentValue > 15 && percentValue <= 50) {
                progressBarColorClass = 'turquoise';
            } else if (percentValue > 50 && percentValue <= 100) {
                progressBarColorClass = 'green';
            } else if (percentValue > 100 && percentValue <= 200) {
                progressBarColorClass = 'yellow';
            } else {
                progressBarColorClass = 'orange';
            }

            // Создание контейнера для прогресс-бара
            let progressBarContainer = document.getElementById('progress-bar-container');
            if (!progressBarContainer) {
                progressBarContainer = document.createElement('div');
                progressBarContainer.id = 'progress-bar-container';
                dailyCaloriesElement.parentNode.insertBefore(progressBarContainer, dailyCaloriesElement.nextSibling);
            }

            progressBarContainer.innerHTML = `
                <div class="progress-bar-wrapper">
                    <div class="progress-bar-container">
                        <div id="progress-bar" class="progress-bar ${progressBarColorClass}" style="width: ${percentValue}%;">
                            ${percentValue}%
                        </div>
                    </div>
                    <span class="calories-text">${globalBMR} ккал</span>
                </div>
            `;
        }

        return bmr;
    } else {
        bmrParagraph.textContent = 'Базальный метаболизм (BMR):';
        return null;
    }
}


function calculateMetabolicAge() {
    const bmr = parseFloat(globalBMR);
    const bodyFat = bodyFatInput.value ? parseFloat(bodyFatInput.value) : null; // Учитываем значение жира только если оно указано
    const activityLevel = activityLevelSelect.value;
    const age = updateAge();

    if (bmr && activityLevel && age !== null) {
        let metabolicAge;

        // Базовый расчет метаболического возраста
        const ageFactor = age;
        const bmrFactor = (bmr / 1500); // Условный коэффициент, требующий дополнительной калибровки
        let fatFactor = 0;

        // Если процент жира указан, учитываем его в расчете
        if (bodyFat !== null) {
            fatFactor = bodyFat * (
                activityLevel == 1.9 ? 0 :
                activityLevel == 1.725 ? 0.1 :
                activityLevel == 1.55 ? 0.2 :
                activityLevel == 1.375 ? 0.3 : 0.5
            );
        }

        // Финальный расчет метаболического возраста с учетом всех факторов
        metabolicAge = ageFactor + fatFactor - (bmrFactor * 2);

        // Обновляем интерфейс
        metabolicAgeParagraph.innerHTML = `<strong>Метаболический возраст:</strong> ${metabolicAge.toFixed(2)} лет`;
        localStorage.setItem('metabolicAge', metabolicAge.toFixed(2));

        return metabolicAge.toFixed(2);
    } else {
        metabolicAgeParagraph.textContent = 'Метаболический возраст:';
        return null;
    }
}






    // Функция для сохранения данных в локальное хранилище
function saveProfileData() {

    const age = updateAge();
    const bmi = updateBMI();
    updateBMR(age); // Обновляем BMR без сохранения, чтобы использовать актуальное значение
    const bodyFatPercentage = parseFloat(bodyFatInput.value) || 0;
    const metabolicAge = calculateMetabolicAge(); // Вычисляем метаболический возраст
    
    
    const userProfile = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        birthDate: birthDateInput.value,
        age: age,
        gender: genderSelect.value,
        height: heightInput.value,
        weight: weightInput.value,
        bodyFatPercentage: bodyFatPercentage, // Сохраняем процент жира
        activityLevel: activityLevelSelect.value, // Сохраняем уровень активности
        bmi: bmi,
        bmr: globalBMR, // Используем глобальную переменную для BMR
        metabolicAge: metabolicAge // Сохраняем метаболический возраст
    };
    localStorage.setItem('userProfile', JSON.stringify(userProfile));

    // Проверка сохраненных данных
    console.log('Profile data saved:', userProfile);
    
}

    globalBMR = localStorage.getItem('globalBMR') ? localStorage.getItem('globalBMR') : 'N/A'; // Обратите внимание на значение по умолчанию



// Функция для обновления процентного выполнения нормы
// Функция для обновления процентного выполнения нормы
function updateDailySummary2() {
    const dailyProtein = parseFloat(document.getElementById('daily-protein').textContent);
    const dailyFats = parseFloat(document.getElementById('daily-fats').textContent);
    const dailyCarbs = parseFloat(document.getElementById('daily-carbs').textContent);
    const dailyFiber = parseFloat(document.getElementById('daily-fiber').textContent);
    const dailyWater = parseFloat(document.getElementById('daily-water').textContent);

    // Расчет процентов выполнения норм
    const proteinPercentage = (dailyProtein / globalProteinNorm * 100).toFixed(2);
    const fatsPercentage = (dailyFats / globalFatsNorm * 100).toFixed(2);
    const carbsPercentage = (dailyCarbs / globalCarbsNorm * 100).toFixed(2);
    const fiberPercentage = (dailyFiber / globalFiberNorm * 100).toFixed(2);
    const waterPercentage = (dailyWater / globalWaterNorm * 100).toFixed(2);

    // Функция для обновления прогресс-бара
    function updateProgressBar(elementId, percentage, norm, unit) {
        const element = document.getElementById(elementId);

        if (element) {
            const percentValue = parseFloat(percentage);
            let progressBarColorClass = '';

            if (percentValue <= 15) {
                progressBarColorClass = 'blue';
            } else if (percentValue > 15 && percentValue <= 50) {
                progressBarColorClass = 'turquoise';
            } else if (percentValue > 50 && percentValue <= 100) {
                progressBarColorClass = 'green';
            } else if (percentValue > 100 && percentValue <= 200) {
                progressBarColorClass = 'yellow';
            } else {
                progressBarColorClass = 'orange';
            }

            let progressBarContainer = document.getElementById(`${elementId}-progress-bar-container`);
            if (!progressBarContainer) {
                progressBarContainer = document.createElement('div');
                progressBarContainer.id = `${elementId}-progress-bar-container`;
                element.parentNode.insertBefore(progressBarContainer, element.nextSibling);
            }

            progressBarContainer.innerHTML = `
                <div class="progress-bar-wrapper">
                    <div class="progress-bar-container">
                        <div class="progress-bar ${progressBarColorClass}" style="width: ${percentValue}%;">
                            ${percentValue}%
                        </div>
                    </div>
                    <span class="value-text">${norm} ${unit}</span>
                </div>
            `;
        }
    }

    // Обновление прогресс-баров для каждого макронутриента
    updateProgressBar('daily-protein', proteinPercentage, globalProteinNorm, 'г');
    updateProgressBar('daily-fats', fatsPercentage, globalFatsNorm, 'г');
    updateProgressBar('daily-carbs', carbsPercentage, globalCarbsNorm, 'г');
    updateProgressBar('daily-fiber', fiberPercentage, globalFiberNorm, 'г');
    updateProgressBar('daily-water', waterPercentage, globalWaterNorm, 'мл');
}



    
    // Функция для загрузки данных из локального хранилища
    function loadProfileData() {
        const savedData = JSON.parse(localStorage.getItem('userProfile'));
        
            
        
        
        if (savedData) {
            firstNameInput.value = savedData.firstName || '';
            lastNameInput.value = savedData.lastName || '';
            birthDateInput.value = savedData.birthDate || '';
            ageParagraph.textContent = savedData.age ? `Возраст: ${savedData.age} лет` : 'Возраст:';
            genderSelect.value = savedData.gender || 'male';
            heightInput.value = savedData.height || '';
            weightInput.value = savedData.weight || '';
            bodyFatInput.value = savedData.bodyFatPercentage || ''; // Загружаем процент жира
            activityLevelSelect.value = savedData.activityLevel || ''; // Загружаем уровень активности
            bmiParagraph.innerHTML = savedData.bmi ? `<strong>ИМТ:</strong> ${savedData.bmi}` : '<strong>ИМТ:</strong>';

            bmrParagraph.innerHTML = savedData.bmr ? `<strong>Базальный метаболизм (BMR):</strong> ${savedData.bmr} ккал/день` : '<strong>Базальный метаболизм (BMR):</strong>';
            metabolicAgeParagraph.innerHTML = savedData.metabolicAge ? `<strong>Метаболический возраст:</strong> ${savedData.metabolicAge} лет` : '<strong>Метаболический возраст:</strong>';
            
            const Globalweight = parseFloat(savedData.weight) || 0;

            setInterval(updateProfileButton, 1000); // Обновляем кнопку пользователя
            
        
        if (Globalweight > 0) {
            
            setInterval(calculateNutrientNorms(Globalweight), 1000);
            // Запуск обновления сводки за день раз в секунду
    setInterval(updateDailySummary2, 1000); // Обновляем сводку за день
        }

        
        
        
        

        GlobalpercentageBMR = localStorage.getItem('globalPercentageBMR') || '?';

        const dailyCaloriesElement = document.getElementById('daily-calories');
        if (dailyCaloriesElement && globalBMR) {
            if (!dailyCaloriesElement.nextSibling.textContent.includes('/ Норма:')) {
                dailyCaloriesElement.nextSibling.textContent += ``;
            }
        }
    }
}
    
    // Загрузка сохраненных данных при загрузке страницы
    loadProfileData();


    // Сохрняем имя
    firstNameInput.addEventListener('input', function() {
        saveProfileData(); // Вызываем функцию сохранения, которая сама обновит все данные
    });

     // Сохрняем фамилию

    lastNameInput.addEventListener('input', function() {
        saveProfileData(); // Сохраняем данные при изменении
    });

    // Обновление возраста, ИМТ и BMR при изменении данных
birthDateInput.addEventListener('input', function() {
    saveProfileData(); // Вызываем функцию сохранения, которая сама обновит все данные
    updateDailySummary2(); // Добавляем вызов обновления сводки
    calculateMetabolicAge();
    
});
heightInput.addEventListener('input', function() {


    // temporaryHeightChange();
    
    saveProfileData();
    
    updateDailySummary2();
    calculateMetabolicAge();
    
    
});
weightInput.addEventListener('input', function() {
    saveProfileData();
    updateDailySummary2();
    calculateMetabolicAge();
    
    
});
genderSelect.addEventListener('input', function() {
    saveProfileData();
    updateDailySummary2();
    calculateMetabolicAge();
    
});

bodyFatInput.addEventListener('input', function() {
    saveProfileData();
    updateDailySummary2();
    calculateMetabolicAge();
    
});

activityLevelSelect.addEventListener('input', function() {
    saveProfileData();
    updateDailySummary2(); // При необходимости, пересчитываем сводку дня
    calculateMetabolicAge();
});





    // Обработчик для кнопки открытия/закрытия модального окна
button.addEventListener('click', function() {
    if (modal.classList.contains('active')) {
        // Если окно уже открыто, закрываем его и сохраняем позицию прокрутки
        modal.classList.remove('active');
        
    } else {
        // Если окно закрыто, просто открываем его
        modal.classList.add('active');
    }
});


    // Обработчик для закрытия модального окна
    modal.querySelector(`.${closeButtonClass}`).addEventListener('click', function() {
        
        modal.classList.remove('active');
        
    
    });


    document.addEventListener('keydown', function(event) {
        // Проверяем нажатие Ctrl и F8
        if (event.ctrlKey && event.key === 'F8') {
            localStorage.clear();
            alert('Локальное хранилище очищено!');
        }
    });
    
    


    











    const productsDiv = document.getElementById("products");
    const searchInput = document.getElementById("search-input");
    const suggestionsDiv = document.getElementById("suggestions");
    const currentDayInput = document.getElementById("current-day");
    const prevDayButton = document.getElementById("prev-day");
    const nextDayButton = document.getElementById("next-day");

    prevDayButton.classList.add('prev-day');
    nextDayButton.classList.add('next-day');
    currentDayInput.classList.add('current-day');

    let products = [];
    let selectedDate = new Date();
    let mealData = {};

    const mealTotals = {
        breakfast: { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, water: 0, grams: 0 },
        lunch: { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, water: 0, grams: 0 },
        dinner: { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, water: 0, grams: 0 }
    };


    let calendarOpened = false; // Флаг состояния для открытия календаря

function openCalendar(mealType) {
    if (calendarOpened) return; // Проверяем флаг, если окно уже открыто, выходим из функции
    calendarOpened = true; // Устанавливаем флаг в true, указывая, что окно открыто

    const calendarDiv = document.createElement('div');
    calendarDiv.classList.add('calendar-overlay');
    calendarDiv.innerHTML = `
        <div class="calendar-container">
            <label for="copy-date-picker">Выберите дату:</label>
            <input type="date" id="copy-date-picker">
            <label for="copy-meal-type">Выберите прием пищи:</label>
            <select id="copy-meal-type">
                <option value="breakfast">Завтрак</option>
                <option value="lunch">Обед</option>
                <option value="dinner">Ужин</option>
            </select>
            <button id="copy-meal-confirm">Копировать</button>
            <button id="copy-meal-cancel">Отмена</button>
        </div>
    `;
    document.body.appendChild(calendarDiv);

    const datePicker = document.getElementById('copy-date-picker');
    const mealTypeSelect = document.getElementById('copy-meal-type');
    const confirmButton = document.getElementById('copy-meal-confirm');
    const cancelButton = document.getElementById('copy-meal-cancel');

    confirmButton.addEventListener('click', () => {
        const selectedDate = new Date(datePicker.value);
        const selectedMealType = mealTypeSelect.value;
        if (isNaN(selectedDate)) {
            alert('Пожалуйста, выберите корректную дату.');
            return;
        }
        copyMealToDate(mealType, selectedDate, selectedMealType);
        document.body.removeChild(calendarDiv);
        calendarOpened = false; // Сбрасываем флаг при закрытии окна
    });

    cancelButton.addEventListener('click', () => {
        document.body.removeChild(calendarDiv);
        calendarOpened = false; // Сбрасываем флаг при закрытии окна
    });
}

function copyMealToDate(sourceMealType, targetDate, targetMealType) {
    const dateKey = formatDate(targetDate);
    const targetData = JSON.parse(localStorage.getItem(dateKey)) || { breakfast: [], lunch: [], dinner: [] };

    targetData[targetMealType] = mealData[sourceMealType].map(product => ({ ...product }));

    localStorage.setItem(dateKey, JSON.stringify(targetData));
    alert('Прием пищи успешно скопирован!');
}
    

 // Проверка наличия продуктов перед открытием календаря
function checkAndOpenCalendar(mealType) {
    if (mealData[mealType] && mealData[mealType].length > 0) {
        openCalendar(mealType);
    } else {
        alert('В этом приеме пищи нет продуктов для копирования.');
    }
}   

    

    function updateMealDataOrder(meal, fromIndex, toIndex) {
        const movedItem = mealData[meal].splice(fromIndex, 1)[0];
        mealData[meal].splice(toIndex, 0, movedItem);
        // Обновление индексов для всех продуктов в mealData[meal]
        mealData[meal].forEach((item, index) => item.index = index);
        saveMealData();
        // Перезагрузка данных для обновления UI
        loadMealData(); 
    }
    
    

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function updateDateDisplay() {
        currentDayInput.value = selectedDate.toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function loadMealData() {
        const dateKey = formatDate(selectedDate);
        const storedData = JSON.parse(localStorage.getItem(dateKey)) || { breakfast: [], lunch: [], dinner: [] };
        mealData = storedData;
    
        ["breakfast", "lunch", "dinner"].forEach(meal => {
            const mealProductsDiv = document.getElementById(`${meal}-products`);
            mealProductsDiv.innerHTML = '';
            mealTotals[meal] = { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, water: 0, grams: 0 };
    
            storedData[meal].sort((a, b) => a.index - b.index).forEach(product => {
                updateMealSummary(meal, product);
            });
            updateMealTotal(meal);
        });
        updateDailySummary();
    }
    
    

    function saveMealData() {
        const dateKey = formatDate(selectedDate);
        // Добавим индексы каждому продукту перед сохранением
        ["breakfast", "lunch", "dinner"].forEach(meal => {
            mealData[meal] = mealData[meal].map((item, index) => ({ ...item, index }));
        });
        localStorage.setItem(dateKey, JSON.stringify(mealData));
    }

    function changeDay(offset) {
        selectedDate.setDate(selectedDate.getDate() + offset);
        updateDateDisplay();
        loadMealData();
        
        saveProfileData();
        calculateNutrientNorms(Globalweight);
        
    }

    prevDayButton.addEventListener('click', () => changeDay(-1));
    nextDayButton.addEventListener('click', () => changeDay(1));

    // Загрузка продуктов из JSON файла
fetch('products.json')
.then(response => response.json())
.then(data => {
    products = data;
    searchInput.addEventListener('input', handleSearchInput);
    clearButton.addEventListener('click', clearSearch);
});

// Обработка ввода в поисковое поле
function handleSearchInput() {
const query = searchInput.value.toLowerCase();
suggestionsDiv.innerHTML = '';

if (query) {
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query)
    );

    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            const option = document.createElement('div');
            option.classList.add('suggestion-item');

            // Форматирование строки
            option.innerHTML = `
                <span class="product-name-search">${product.name}</span>
                <span class="product-details">
                    ${product.calories} ккал, 
                    ${product.protein} г белков, 
                    ${product.fats} г жиров, 
                    ${product.carbs} г углеводов
                </span>
            `;

            // Добавление обработчика клика
            option.addEventListener('click', () => {
                displayProductCard(product);
                suggestionsDiv.innerHTML = ''; // Закрываем предложения
                searchInput.value = ''; // Очищаем поле поиска
            });

            suggestionsDiv.appendChild(option);
        });
    }
}
}

// Очистка поиска и предложений
function clearSearch() {
searchInput.value = '';
suggestionsDiv.innerHTML = '';
searchInput.focus(); // Фокус на поле поиска после очистки
}

// Инициализация элементов
const clearButton = document.getElementById('clear-button');









// Функция для проверки хэша и создания контейнера
function checkAndCreateSearchContainer() {
    const hash = window.location.hash.substring(1);
    const searchContainerId = 'search-container';
    let searchContainer = document.getElementById(searchContainerId);

    if (hash === 'food-diary') {
        if (!searchContainer) {
            // Создаем контейнер для поиска рецептов и продуктов
            searchContainer = document.createElement('div');
            searchContainer.id = searchContainerId;
            searchContainer.className = 'exotic-search-container'; // Новый класс для контейнера поиска

            // Добавляем заголовок в начало контейнера
            const header = document.createElement('h2');
            header.className = 'exotic-search-header';
            header.textContent = 'Поиск рецептов и продуктов';
            searchContainer.appendChild(header);

            // Вкладки "Полная база" и "Мое"
            const tabs = document.createElement('div');
            tabs.className = 'exotic-tabs';
            tabs.innerHTML = `
                <button class="exotic-tab active" id="full-base-tab">Полная база</button>
                <button class="exotic-tab" id="my-tab">Мое</button>
            `;
            searchContainer.appendChild(tabs);

            // Контейнер для подвкладок и списка избранных продуктов
            const subTabsContainer = document.createElement('div');
            subTabsContainer.className = 'exotic-sub-tabs-container';
            searchContainer.appendChild(subTabsContainer);

            // Добавляем контейнер в maxElement
            maxElement.insertBefore(searchContainer, maxElement.children[1]);

            // Логика переключения между вкладками
            const fullBaseTab = document.getElementById('full-base-tab');
            const myTab = document.getElementById('my-tab');

            fullBaseTab.addEventListener('click', () => {
                subTabsContainer.innerHTML = ''; // Очищаем содержимое при выборе "Полная база"
                showFullBaseSubTabs(subTabsContainer); // Показать подвкладки для "Полная база"
                fullBaseTab.classList.add('active');
                myTab.classList.remove('active');
            });

            myTab.addEventListener('click', () => {
                subTabsContainer.innerHTML = ''; // Очищаем содержимое при выборе "Мое"
                showMySubTabs(subTabsContainer); // Показать подвкладки для "Мое"
                myTab.classList.add('active');
                fullBaseTab.classList.remove('active');
            });

            // Изначально показываем подвкладки для "Полная база"
            showFullBaseSubTabs(subTabsContainer);
        }
    } else {
        // Если хэш не 'food-diary', удаляем контейнер
        if (searchContainer) {
            searchContainer.remove();
        }
    }
}

// Функция для проверки хэша и создания контейнера
function checkAndCreateSearchContainer() {
    const hash = window.location.hash.substring(1);
    const searchContainerId = 'search-container';
    let searchContainer = document.getElementById(searchContainerId);

    if (hash === 'food-diary') {
        if (!searchContainer) {
            // Создаем контейнер для поиска рецептов и продуктов
            searchContainer = document.createElement('div');
            searchContainer.id = searchContainerId;
            searchContainer.className = 'exotic-search-container'; // Новый класс для контейнера поиска

            // Добавляем заголовок в начало контейнера
            const header = document.createElement('h2');
            header.className = 'exotic-search-header';
            header.textContent = 'Поиск рецептов и продуктов';
            searchContainer.appendChild(header);

            // Вкладки "Полная база" и "Мое"
            const tabs = document.createElement('div');
            tabs.className = 'exotic-tabs';
            tabs.innerHTML = `
                <button class="exotic-tab active" id="full-base-tab">Полная база</button>
                <button class="exotic-tab" id="my-tab">Мое</button>
            `;
            searchContainer.appendChild(tabs);

            // Контейнер для подвкладок и списка избранных продуктов
            const subTabsContainer = document.createElement('div');
            subTabsContainer.className = 'exotic-sub-tabs-container';
            searchContainer.appendChild(subTabsContainer);

            // Добавляем контейнер в maxElement
            maxElement.insertBefore(searchContainer, maxElement.children[1]);

            // Логика переключения между вкладками
            const fullBaseTab = document.getElementById('full-base-tab');
            const myTab = document.getElementById('my-tab');

            fullBaseTab.addEventListener('click', () => {
                subTabsContainer.innerHTML = ''; // Очищаем содержимое при выборе "Полная база"
                showFullBaseSubTabs(subTabsContainer); // Показать подвкладки для "Полная база"
                fullBaseTab.classList.add('active');
                myTab.classList.remove('active');
            });

            myTab.addEventListener('click', () => {
                subTabsContainer.innerHTML = ''; // Очищаем содержимое при выборе "Мое"
                showMySubTabs(subTabsContainer); // Показать подвкладки для "Мое"
                myTab.classList.add('active');
                fullBaseTab.classList.remove('active');
            });

            // Изначально показываем подвкладки для "Полная база"
            showFullBaseSubTabs(subTabsContainer);
        }
    } else {
        // Если хэш не 'food-diary', удаляем контейнер
        if (searchContainer) {
            searchContainer.remove();
        }
    }
}

// Функция для показа подвкладок "Полная база"
function showFullBaseSubTabs(subTabsContainer) {
    subTabsContainer.innerHTML = `
        <div class="exotic-subtabs">
            <button class="exotic-subtab active" id="basic-tab">Основная</button>
            <button class="exotic-subtab" id="advanced-tab">Расширенная</button>
        </div>
        <div class="exotic-search-block" id="search-block"></div>
        <div class="exotic-products-block" id="products-block"></div>
    `;

    const basicTab = document.getElementById('basic-tab');
    const advancedTab = document.getElementById('advanced-tab');
    const searchBlock = document.getElementById('search-block');
    const productsBlock = document.getElementById('products-block');

    // Показать блок для поиска и категорий при выборе "Основная"
    basicTab.addEventListener('click', () => {
        basicTab.classList.add('active');
        advancedTab.classList.remove('active');
        showBasicSearch(searchBlock, productsBlock); // Показать базовый поиск и категории
    });

    // Очистить контейнер при выборе "Расширенная"
    advancedTab.addEventListener('click', () => {
        advancedTab.classList.add('active');
        basicTab.classList.remove('active');
        searchBlock.innerHTML = ''; // Очищаем блок поиска
        if (productsBlock) {
            productsBlock.innerHTML = ''; // Очищаем блок продуктов
        }
    });

    // Изначально показываем базовый поиск и категории
    showBasicSearch(searchBlock, productsBlock);
}

// Функция для показа подвкладок "Полная база"
function showFullBaseSubTabs(subTabsContainer) {
    subTabsContainer.innerHTML = `
        <div class="exotic-subtabs">
            <button class="exotic-subtab active" id="basic-tab">Основная</button>
            <button class="exotic-subtab" id="advanced-tab">Расширенная</button>
        </div>
        <div class="exotic-search-block" id="search-block"></div>
        <div class="exotic-products-block" id="products-block"></div>
    `;

    const basicTab = document.getElementById('basic-tab');
    const advancedTab = document.getElementById('advanced-tab');
    const searchBlock = document.getElementById('search-block');
    const productsBlock = document.getElementById('products-block');

    // Показать блок для поиска и категорий при выборе "Основная"
    basicTab.addEventListener('click', () => {
        basicTab.classList.add('active');
        advancedTab.classList.remove('active');
        showBasicSearch(searchBlock, productsBlock); // Показать базовый поиск и категории
    });

    // Очистить контейнер при выборе "Расширенная"
    advancedTab.addEventListener('click', () => {
        advancedTab.classList.add('active');
        basicTab.classList.remove('active');
        searchBlock.innerHTML = ''; // Очищаем блок поиска
        if (productsBlock) {
            productsBlock.innerHTML = ''; // Очищаем блок продуктов
        }
    });

    // Изначально показываем базовый поиск и категории
    showBasicSearch(searchBlock, productsBlock);
}

// Функция для показа подвкладок "Полная база"
function showFullBaseSubTabs(subTabsContainer) {
    subTabsContainer.innerHTML = `
        <div class="exotic-subtabs">
            <button class="exotic-subtab active" id="basic-tab">Основная</button>
            <button class="exotic-subtab" id="advanced-tab">Расширенная</button>
        </div>
        <div class="exotic-products-block" id="products-block"></div>
    `;

    const basicTab = document.getElementById('basic-tab');
    const advancedTab = document.getElementById('advanced-tab');
    const productsBlock = document.getElementById('products-block');

    // Показать блок для категорий при выборе "Основная"
    basicTab.addEventListener('click', () => {
        basicTab.classList.add('active');
        advancedTab.classList.remove('active');
        showProductCategories(productsBlock); // Показать категории
    });

    // Очистить контейнер при выборе "Расширенная"
    advancedTab.addEventListener('click', () => {
        advancedTab.classList.add('active');
        basicTab.classList.remove('active');
        productsBlock.innerHTML = ''; // Очищаем блок продуктов
    });

    // Изначально показываем категории
    showProductCategories(productsBlock);
}

// Функция для отображения категорий продуктов
function showProductCategories(productsBlock) {
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        const categories = {};

        // Группировка продуктов по категориям
        data.forEach(product => {
            if (!categories[product.category]) {
                categories[product.category] = [];
            }
            categories[product.category].push(product);
        });

        // Очистка контейнера перед добавлением новых элементов
        productsBlock.innerHTML = '';

        // Отображение категорий и продуктов
        for (const category in categories) {
            const translatedCategory = categoryTranslations[category] || category; // Переводим категорию
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('category-container-search');

            const categoryTitle = document.createElement('h3');
            categoryTitle.classList.add('exotic-category-header');
            categoryTitle.textContent = translatedCategory;

            // Создаем кнопку с треугольной стрелкой
            const toggleButton = document.createElement('button');
            toggleButton.classList.add('toggle-category-button');
            toggleButton.innerHTML = '▼'; // Вниз по умолчанию

            categoryTitle.appendChild(toggleButton);
            categoryContainer.appendChild(categoryTitle);

            const productsList = document.createElement('ul');
            productsList.classList.add('products-list-search');

            categories[category].forEach(product => {
                const productItem = document.createElement('li');
                productItem.classList.add('product-item-search');
            
                // Меняем порядок элементов: сначала название продукта, затем тире, затем детали
                productItem.innerHTML = `
                    <span class="product-name-search">${product.name}</span>
                    <span class="product-details-search">
                        ${product.calories} ккал, 
                        ${product.protein} г белков, 
                        ${product.fats} г жиров, 
                        ${product.carbs} г углеводов
                    </span>
                `;
            
                // Добавление обработчика клика для отображения информации о продукте
                productItem.addEventListener('click', () => {
                    displayProductCard(product);
                });
            
                productsList.appendChild(productItem);
            });

            // Добавляем сворачивание/разворачивание списка продуктов
            toggleButton.addEventListener('click', () => {
                const isHidden = productsList.style.display === 'none';
                productsList.style.display = isHidden ? 'block' : 'none';
                toggleButton.innerHTML = isHidden ? '▲' : '▼'; // Меняем стрелку в зависимости от состояния списка
            });

            productsList.style.display = 'none'; // Изначально скрываем список продуктов
            categoryContainer.appendChild(productsList);
            productsBlock.appendChild(categoryContainer);
        }
    });
}

// Примерная функция для отображения информации о продукте
function displayProductCard(product) {
    // Реализуйте отображение карточки продукта здесь
    alert(`Продукт: ${product.name}\nКалории: ${product.calories}\nБелки: ${product.protein}\nЖиры: ${product.fats}\nУглеводы: ${product.carbs}`);
}

// Объект для перевода категорий на русский
const categoryTranslations = {
    'cereals': 'Крупы',
    'legumes': 'Бобовые',
    'vegetables': 'Овощи',
    'roots': 'Корнеплоды',
    'fruits': 'Фрукты',
    'vegetable oils': 'Растительные масла',
    'liquids': 'Жидкости'
};

// Функция для проверки хэша и создания контейнера
function checkAndCreateSearchContainer() {
    const hash = window.location.hash.substring(1);
    const searchContainerId = 'search-container';
    let searchContainer = document.getElementById(searchContainerId);

    if (hash === 'food-diary') {
        if (!searchContainer) {
            // Создаем контейнер для поиска рецептов и продуктов
            searchContainer = document.createElement('div');
            searchContainer.id = searchContainerId;
            searchContainer.className = 'exotic-search-container'; // Новый класс для контейнера поиска

            // Добавляем заголовок в начало контейнера
            const header = document.createElement('h2');
            header.className = 'exotic-search-header';
            header.textContent = 'Поиск рецептов и продуктов';
            searchContainer.appendChild(header);

            // Вкладки "Полная база" и "Мое"
            const tabs = document.createElement('div');
            tabs.className = 'exotic-tabs';
            tabs.innerHTML = `
                <button class="exotic-tab active" id="full-base-tab">Полная база</button>
                <button class="exotic-tab" id="my-tab">Мое</button>
            `;
            searchContainer.appendChild(tabs);

            // Контейнер для подвкладок и списка избранных продуктов
            const subTabsContainer = document.createElement('div');
            subTabsContainer.className = 'exotic-sub-tabs-container';
            searchContainer.appendChild(subTabsContainer);

            // Добавляем контейнер в maxElement
            maxElement.insertBefore(searchContainer, maxElement.children[1]);

            // Логика переключения между вкладками
            const fullBaseTab = document.getElementById('full-base-tab');
            const myTab = document.getElementById('my-tab');

            fullBaseTab.addEventListener('click', () => {
                subTabsContainer.innerHTML = ''; // Очищаем содержимое при выборе "Полная база"
                showFullBaseSubTabs(subTabsContainer); // Показать подвкладки для "Полная база"
                fullBaseTab.classList.add('active');
                myTab.classList.remove('active');
            });

            myTab.addEventListener('click', () => {
                subTabsContainer.innerHTML = ''; // Очищаем содержимое при выборе "Мое"
                showMySubTabs(subTabsContainer); // Показать подвкладки для "Мое"
                myTab.classList.add('active');
                fullBaseTab.classList.remove('active');
            });

            // Изначально показываем подвкладки для "Полная база"
            showFullBaseSubTabs(subTabsContainer);
        }
    } else {
        // Если хэш не 'food-diary', удаляем контейнер
        if (searchContainer) {
            searchContainer.remove();
        }
    }
}

// Инициализация контейнера поиска при загрузке страницы
document.addEventListener('DOMContentLoaded', checkAndCreateSearchContainer);


















// Функция для показа подвкладок и списка избранных продуктов
function showMySubTabs(subTabsContainer) {
    subTabsContainer.innerHTML = `
        <div class="exotic-subtabs">
            <button class="exotic-subtab active" id="favorites-tab">Избранное</button>
            <button class="exotic-subtab" id="my-products-tab">Мои</button>
        </div>
        <div class="exotic-favorite-products-container" id="favorite-products-container"></div>
    `;

    const favoritesTab = document.getElementById('favorites-tab');
    const myProductsTab = document.getElementById('my-products-tab');
    const favoriteProductsContainer = document.getElementById('favorite-products-container');

    // Показать избранные продукты при выборе вкладки "Избранное"
    favoritesTab.addEventListener('click', () => {
        favoritesTab.classList.add('active');
        myProductsTab.classList.remove('active');
        displayFavoriteProducts(favoriteProductsContainer);
    });

    // Очистить контейнер при выборе вкладки "Мои"
    myProductsTab.addEventListener('click', () => {
        myProductsTab.classList.add('active');
        favoritesTab.classList.remove('active');
        favoriteProductsContainer.innerHTML = ''; // Очищаем список
    });

    // Изначально показываем "Избранное"
    displayFavoriteProducts(favoriteProductsContainer);

    // Обновляем кнопки при изменении статуса
    document.addEventListener('favoriteStatusChange', () => {
        displayFavoriteProducts(favoriteProductsContainer);
    });
}

function displayFavoriteProducts(container) {
    container.innerHTML = ''; // Очищаем контейнер перед заполнением

    // Получаем избранные продукты из локального хранилища
    const favorites = JSON.parse(localStorage.getItem('favorites')) || {};

    // Категории на русском языке
    const categories = {
        cereals: 'Крупы',
        legumes: 'Бобовые',
        vegetables: 'Овощи',
        roots: 'Корнеплоды',
        fruits: 'Фрукты',
        'vegetable oils': 'Растительные масла',
        liquids: 'Жидкости'
    };

    // Проходим по всем категориям
    Object.keys(categories).forEach(category => {
        // Фильтруем продукты по категории
        const categoryProducts = Object.values(favorites).filter(product => product.category === category);

        // Если есть продукты в этой категории, создаем раздел для категории
        if (categoryProducts.length > 0) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'exotic-category';

            // Создаем заголовок категории с кнопкой сворачивания/разворачивания
            const categoryHeader = document.createElement('h3');
            categoryHeader.className = 'exotic-category-header';
            const isOpen = localStorage.getItem(`category-${category}`) === 'open';
            categoryHeader.innerHTML = `
                ${categories[category]}
                <button class="toggle-category-button">${isOpen ? '&#9650;' : '&#9660;'}</button>
            `;

            // Добавляем обработчик для кнопки сворачивания/разворачивания
            const toggleButton = categoryHeader.querySelector('.toggle-category-button');
            toggleButton.addEventListener('click', () => {
                const content = categoryDiv.querySelector('.exotic-category-content');
                if (content.style.display === 'none' || content.style.display === '') {
                    content.style.display = 'block';
                    toggleButton.innerHTML = '&#9650;'; // Стрелка вверх
                    localStorage.setItem(`category-${category}`, 'open');
                } else {
                    content.style.display = 'none';
                    toggleButton.innerHTML = '&#9660;'; // Стрелка вниз
                    localStorage.setItem(`category-${category}`, 'closed');
                }
            });

            // Создаем контейнер для продуктов в категории
            const categoryContent = document.createElement('div');
            categoryContent.className = 'exotic-category-content';
            categoryContent.style.display = isOpen ? 'block' : 'none';

            // Проходим по каждому продукту в категории
            categoryProducts.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'exotic-favorite-product';

                // Создаем элемент для названия продукта, который будет кликабельным
                const productNameSpan = document.createElement('span');
                productNameSpan.className = 'exotic-product-name';
                productNameSpan.textContent = product.name;

                // Добавляем обработчик клика, который будет открывать карточку продукта
                productNameSpan.addEventListener('click', () => {
                    const fullProduct = products.find(p => p.id === product.id && p.category === product.category);
                    if (fullProduct) {
                        displayProductCard(fullProduct);
                    }
                });

                // Создаем кнопку для удаления продукта из избранного
                const removeButton = document.createElement('button');
                removeButton.className = 'exotic-remove-button';
                removeButton.textContent = '×';

                // Добавляем событие для удаления из избранного
                removeButton.addEventListener('click', () => {
                    removeProductFromFavorites(product.id, product.category);
                    productDiv.remove(); // Удаляем продукт из DOM
                });

                // Добавляем элементы в productDiv
                productDiv.appendChild(productNameSpan);
                productDiv.appendChild(removeButton);

                // Добавляем продукт в раздел категории
                categoryContent.appendChild(productDiv);
            });

            // Добавляем содержимое категории и заголовок в основной контейнер
            categoryDiv.appendChild(categoryHeader);
            categoryDiv.appendChild(categoryContent);

            // Добавляем категорию в основной контейнер
            container.appendChild(categoryDiv);
        }
    });

    // Обновляем состояние кнопок избранного в карточках
    updateFavoriteButtons();
}






// Функция удаления продукта из избранного
function removeProductFromFavorites(productId, productCategory) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
    const favoriteKey = `${productId}-${productCategory}`;

    delete favorites[favoriteKey];
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();
}

// Проверка хэша при загрузке страницы
checkAndCreateSearchContainer();

// Проверка хэша при изменении
window.addEventListener('hashchange', checkAndCreateSearchContainer);








// Функция обновления состояния кнопок избранного на странице
function updateFavoriteButtons() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
    
    document.querySelectorAll('.favorite-button-card').forEach(button => {
        const productId = button.dataset.productId;
        const productCategory = button.dataset.productCategory;
        const favoriteKey = `${productId}-${productCategory}`;
        const isFavorite = favorites[favoriteKey]?.isFavorite || false;

        if (isFavorite) {
            button.classList.add('favorite-active-button-card');
        } else {
            button.classList.remove('favorite-active-button-card');
        }
    });
}


// Создание события для обновления состояния кнопок избранного
const favoriteStatusChangeEvent = new Event('favoriteStatusChange');


// Функция для добавления кнопки "Избранное" с сердечком
function addFavoriteButton(card, product) {
    const favoriteButton = document.createElement('span');
    favoriteButton.classList.add('favorite-button-card'); // Класс для кнопки с сердечком
    favoriteButton.innerHTML = '&#9829;'; // Юникод символ сердечка

    // Установка атрибутов для поиска кнопки
    favoriteButton.setAttribute('data-product-id', product.id);
    favoriteButton.setAttribute('data-product-category', product.category);

    // Проверка статуса избранного из локального хранилища
    const favoriteKey = `${product.id}-${product.category}`;
    const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
    const isFavorite = favorites[favoriteKey]?.isFavorite || false;

    // Установка начального состояния кнопки
    if (isFavorite) {
        favoriteButton.classList.add('favorite-active-button-card');
    }

    // Событие переключения статуса избранного
    favoriteButton.addEventListener('click', () => {
        const currentStatus = favoriteButton.classList.toggle('favorite-active-button-card');
        const updatedFavorite = {
            id: product.id,
            category: product.category,
            name: product.name, // Сохранение названия продукта
            isFavorite: currentStatus
        };

        // Обновление локального хранилища
        const favorites = JSON.parse(localStorage.getItem('favorites')) || {};
        if (currentStatus) {
            favorites[favoriteKey] = updatedFavorite;
        } else {
            delete favorites[favoriteKey];
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));

        // Генерация события изменения статуса
        document.dispatchEvent(favoriteStatusChangeEvent);
    });

    // Добавляем кнопку с сердечком в карточку
    card.appendChild(favoriteButton);
}



updateFavoriteButtons();































    // Обновление значений питательных веществ с учетом метода обработки
    const processingMethods = {
        'Отсутствует': 1.0,
        'Резка': 0.9,
        'Пароварка': 0.8,
        'Варка': 0.5,
        'Жарка': 0.2
    };

    // Переводы названий витаминов
const vitaminTranslations = {
    'vitaminA': 'A',
    'vitaminBeta-carotene': 'Бета-Каротин',
    'vitaminB1': 'B1',
    'vitaminB2': 'B2',
    'vitaminB3': 'B3-Ниацин',
    'vitaminCholine': '[B4*]-Холин',
    'vitaminB5': 'B5',
    'vitaminB6': 'B6',
    'vitaminB7': 'B7',
    'vitaminB9': 'B9',
    'vitaminB12': 'B12',
    'vitaminС': 'С',
    'vitaminD': 'D',
    'vitaminE': 'E',
    'vitaminK': 'K',
    
};

/**
 * Суточные нормы потребления витаминов.
 * Включает нижнюю и верхнюю границу нормы по каждому витамину.
 * Значения основаны на рекомендациях от ВОЗ и IOM.
 */

const vitaminRecommendations = {
    vitamins: {
      "vitaminA": {
        "lowerBound": 900, // Нижняя граница нормы для мужчин
        "upperBound": 3000, // Верхняя граница нормы для мужчин
        "unit": "мкг"
      },
      "vitaminBeta-carotene": {
        "lowerBound": 0.9, // Оценочная доза в миллиграммах
        "upperBound": 6,   // Оценочная доза в миллиграммах
        "unit": "мг"
      },
      "vitaminB1": {
        "lowerBound": 1.2, // Нижняя граница нормы для мужчин
        "upperBound": 1.5, // Верхняя граница нормы для мужчин
        "unit": "мг"
      },
      "vitaminB2": {
        "lowerBound": 1.1, // Нижняя граница нормы для женщин
        "upperBound": 1.6, // Верхняя граница нормы для мужчин
        "unit": "мг"
      },
      "vitaminB3": {
        "lowerBound": 14,  // Нижняя граница нормы для женщин
        "upperBound": 16,  // Верхняя граница нормы для мужчин
        "unit": "мг"
      },
      "vitaminCholine": {
        "lowerBound": 425, // Нижняя граница нормы для женщин
        "upperBound": 550, // Верхняя граница нормы для мужчин
        "unit": "мг"
      },
      "vitaminB5": {
        "lowerBound": 5,   // Оценочная доза
        "upperBound": 10,  // Оценочная доза
        "unit": "мг"
      },
      "vitaminB6": {
        "lowerBound": 1.3, // Нижняя граница нормы для женщин (19-50 лет)
        "upperBound": 2.0, // Верхняя граница нормы для мужчин (19-50 лет)
        "unit": "мг"
      },
      "vitaminB7": {
        "lowerBound": 30,  // Нижняя граница нормы
        "upperBound": 100, // Верхняя граница нормы
        "unit": "мкг"
      },
      "vitaminB9": {
        "lowerBound": 400, // Нижняя граница нормы
        "upperBound": 800, // Верхняя граница нормы при беременности
        "unit": "мкг"
      },
      "vitaminB12": {
        "lowerBound": 2.4, // Нижняя граница нормы
        "upperBound": 2.4, // Верхняя граница нормы
        "unit": "мкг"
      },
      "vitaminC": {
        "lowerBound": 75,  // Нижняя граница нормы для женщин
        "upperBound": 90,  // Верхняя граница нормы для мужчин
        "unit": "мг"
      },
      "vitaminD": {
        "lowerBound": 15,  // Нижняя граница нормы для взрослых
        "upperBound": 100, // Верхняя граница нормы для взрослых
        "unit": "мкг"
      },
      "vitaminE": {
        "lowerBound": 15,  // Нижняя граница нормы
        "upperBound": 1000, // Верхняя граница нормы
        "unit": "мг"
      },
      "vitaminK": {
        "lowerBound": 90,  // Нижняя граница нормы для женщин
        "upperBound": 120, // Верхняя граница нормы для мужчин
        "unit": "мкг"
      }
    }
  };

// Переводы названий минералов
const mineralTranslations = {
    'lithium': 'Литий [Li]',
    'boron': 'Бор [B]',
    'sodium': 'Натрий [Na]',
    'silicon': 'Кремний [Si]',
    'potassium': 'Калий [K]',
    'calcium': 'Кальций [Ca]',
    'chromium': 'Хром [Cr]',
    'cadmium': 'Кадмий [Cd]',
    'lead': 'Свинец [Pb]',
    'magnesium': 'Магний [Mg]',
    'aluminum': 'Алюминий [Al]',
    'titanium': 'Титан [Ti]',
    'manganese': 'Марганец [Mn]',
    'iron': 'Железо [Fe]',
    'cobalt': 'Кобальт [Co]',
    'nickel': 'Никель [Ni]',
    'copper': 'Медь [Cu]',
    'zinc': 'Цинк [Zn]',
    'arsenic': 'Мышьяк [As]',
    'selenium': 'Селен [Se]',
    'molybdenum': 'Молибден [Mo]',
    'antimony': 'Сурьма [Sb]',
    'mercury': 'Ртуть [Hg]',
    'phosphorus': 'Фосфор [P]',
    'iodine': 'Йод [I]',
    'fluorine': 'Фтор [F]'
};

/**
 * Суточные нормы потребления минералов.
 * Включает нижнюю и верхнюю границу нормы по каждому минералу.
 * Значения основаны на рекомендациях от ВОЗ и IOM.
 */

const mineralRecommendations = {
    minerals: {
        "lithium": {
            "lowerBound": 0, // Нет официальных рекомендаций
            "upperBound": 2, // Оценочная верхняя граница, мг
            "unit": "мг",
            "effect": "эссенциальный"
        },
        "boron": {
            "lowerBound": 1,  // Оценочная норма, мг
            "upperBound": 20, // Максимальная допустимая доза, мг
            "unit": "мг",
            "effect": "эссенциальный"
        },
        "sodium": {
            "lowerBound": 1500, // Нижняя граница нормы для взрослых, мг
            "upperBound": 2300, // Верхняя граница нормы для взрослых, мг
            "unit": "мг",
            "effect": "эссенциальный"
        },
        "silicon": {
            "lowerBound": 5,  // Оценочная минимальная доза, мг
            "upperBound": 40, // Оценочная верхняя граница, мг
            "unit": "мг",
            "effect": "эссенциальный"
        },
        "potassium": {
            "lowerBound": 3500, // Нижняя граница нормы для взрослых, мг
            "upperBound": 4700, // Верхняя граница нормы для взрослых, мг
            "unit": "мг",
            "effect": "эссенциальный"
        },
        "calcium": {
            "lowerBound": 1000, // Нижняя граница нормы для взрослых, мг
            "upperBound": 2500, // Верхняя граница нормы для взрослых, мг
            "unit": "мг",
            "effect": "эссенциальный"
        },
        "chromium": {
            "lowerBound": 25,  // Нижняя граница нормы для женщин, мкг
            "upperBound": 35,  // Верхняя граница нормы для мужчин, мкг
            "unit": "мкг",
            "effect": "эссенциальный"
        },
        "cadmium": {
            "lowerBound": 0, // Нет официальных рекомендаций
            "upperBound": 0, // Токсичен, избегать потребления
            "unit": "мкг",
            "effect": "токсичный",
            "toxicUpperBound": 5 // Верхняя граница, за которой начинается негативное воздействие, мкг
        },
        "lead": {
            "lowerBound": 0, // Нет официальных рекомендаций
            "upperBound": 0, // Токсичен, избегать потребления
            "unit": "мкг",
            "effect": "токсичный",
            "toxicUpperBound": 10 // Верхняя граница, за которой начинается негативное воздействие, мкг
        },
        "magnesium": {
            "lowerBound": 310, // Нижняя граница нормы для женщин, мг
            "upperBound": 420, // Верхняя граница нормы для мужчин, мг
            "unit": "мг",
            "effect": "эссенциальный"
        },
        "aluminum": {
            "lowerBound": 0, // Нет официальных рекомендаций
            "upperBound": 1, // Максимальная допустимая доза, мг
            "unit": "мг",
            "effect": "токсичный",
            "toxicUpperBound": 2 // Верхняя граница, за которой начинается негативное воздействие, мг
        },
        "titanium": {
            "lowerBound": 0, // Нет официальных рекомендаций
            "upperBound": 0, // Недостаточно данных
            "unit": "мг",
            "effect": "эссенциальный"
        },
        "manganese": {
            "lowerBound": 1.8,  // Нижняя граница нормы для женщин, мг
            "upperBound": 2.3,  // Верхняя граница нормы для мужчин, мг
            "unit": "мг",
            "effect": "эссенциальный"
        },
        "iron": {
            "lowerBound": 8,   // Нижняя граница нормы для мужчин, мг
            "upperBound": 18,  // Верхняя граница нормы для женщин, мг
            "unit": "мг",
            "effect": "эссенциальный"
        },
        "cobalt": {
            "lowerBound": 0,   // Нет официальных рекомендаций
            "upperBound": 0.1, // Оценочная максимальная доза, мкг
            "unit": "мкг",
            "effect": "эссенциальный"
        },
        "nickel": {
            "lowerBound": 0,   // Нет официальных рекомендаций
            "upperBound": 1,   // Максимальная допустимая доза, мг
            "unit": "мг",
            "effect": "эссенциальный"
        },
        "copper": {
            "lowerBound": 0.9,  // Нижняя граница нормы для взрослых, мг
            "upperBound": 10,   // Верхняя граница нормы для взрослых, мг
            "unit": "мг",
            "effect": "эссенциальный"
        },
        "zinc": {
            "lowerBound": 8,   // Нижняя граница нормы для женщин, мг
            "upperBound": 11,  // Верхняя граница нормы для мужчин, мг
            "unit": "мг",
            "effect": "эссенциальный"
        },
        "arsenic": {
            "lowerBound": 0, // Нет официальных рекомендаций
            "upperBound": 0, // Токсичен, избегать потребления
            "unit": "мкг",
            "effect": "токсичный",
            "toxicUpperBound": 1 // Верхняя граница, за которой начинается негативное воздействие, мкг
        },
        "selenium": {
            "lowerBound": 55,   // Нижняя граница нормы для взрослых, мкг
            "upperBound": 400,  // Верхняя граница нормы для взрослых, мкг
            "unit": "мкг",
            "effect": "эссенциальный"
        },
        "molybdenum": {
            "lowerBound": 45,  // Нижняя граница нормы для взрослых, мкг
            "upperBound": 2000, // Верхняя граница нормы для взрослых, мкг
            "unit": "мкг",
            "effect": "эссенциальный"
        },
        "antimony": {
            "lowerBound": 0, // Нет официальных рекомендаций
            "upperBound": 0.5, // Оценочная верхняя граница, мкг
            "unit": "мкг",
            "effect": "токсичный",
            "toxicUpperBound": 0.5 // Верхняя граница, за которой начинается негативное воздействие, мкг
        },
        "mercury": {
            "lowerBound": 0, // Нет официальных рекомендаций
            "upperBound": 0, // Токсичен, избегать потребления
            "unit": "мкг",
            "effect": "токсичный",
            "toxicUpperBound": 0.1 // Верхняя граница, за которой начинается негативное воздействие, мкг
        },
        "phosphorus": {
            "lowerBound": 700,  // Нижняя граница нормы для взрослых, мг
            "upperBound": 4000, // Верхняя граница нормы для взрослых, мг
            "unit": "мг",
            "effect": "эссенциальный"
        },
        "iodine": {
            "lowerBound": 150,  // Нижняя граница нормы для взрослых, мкг
            "upperBound": 1100, // Верхняя граница нормы для взрослых, мкг
            "unit": "мкг",
            "effect": "эссенциальный"
        },
        "fluorine": {
            "lowerBound": 3,   // Нижняя граница нормы для женщин, мг
            "upperBound": 4,   // Верхняя граница нормы для мужчин, мг
            "unit": "мг",
            "effect": "эссенциальный"
        }
    }
};



// Переводы названий жиров и холестерина
const fattyAcidsAndCholesterolTranslations = {
    'omega3': 'Омега-3 Жирные кислоты',
    'omega6': 'Омега-6 Жирные кислоты',
    'cholesterol': 'Холестерин',
    'saturatedFats': 'Насыщенные жирные кислоты',
    'monounsaturatedFats': 'Мононенасыщенные жирные кислоты',
    'polyunsaturatedFats': 'Полиненасыщенные жирные кислоты',
    'transFats': 'Трансжиры'
};

/**
 * Суточные нормы потребления жирных кислот и холестерина.
 * Включает нижнюю и верхнюю границу нормы по каждому виду жиров.
 * Значения основаны на рекомендациях от ВОЗ и других экспертных источников.
 */

const fatRecommendations = {
    fattyAcidsAndCholesterol: {
        "omega3": {
            "lowerBound": 1.1, // Нижняя граница нормы для женщин, г
            "upperBound": 1.6, // Верхняя граница нормы для мужчин, г
            "unit": "г"
        },
        "omega6": {
            "lowerBound": 11, // Нижняя граница нормы для женщин, г
            "upperBound": 17, // Верхняя граница нормы для мужчин, г
            "unit": "г"
        },
        "cholesterol": {
            "lowerBound": 0,   // Минимальная рекомендуемая доза, мг
            "upperBound": 300, // Максимальная допустимая доза, мг
            "unit": "мг"
        },
        "saturatedFats": {
            "lowerBound": 0,  // Минимальная рекомендуемая доза, г
            "upperBound": 20, // Максимальная допустимая доза, г (до 10% от общего калоража)
            "unit": "г"
        },
        "monounsaturatedFats": {
            "lowerBound": 15, // Нижняя граница нормы, г (10-20% от общего калоража)
            "upperBound": 30, // Верхняя граница нормы, г
            "unit": "г"
        },
        "polyunsaturatedFats": {
            "lowerBound": 5,   // Нижняя граница нормы, г (5-10% от общего калоража)
            "upperBound": 10,  // Верхняя граница нормы, г
            "unit": "г"
        },
        "transFats": {
            "lowerBound": 0,   // Минимальная рекомендуемая доза, г (избегать потребления)
            "upperBound": 2,   // Максимальная допустимая доза, г (до 1% от общего калоража)
            "unit": "г"
        }
    }
};


// Переводы названий незаменимых аминокислот
const essentialAminoAcidsTranslations = {
    'histidine': 'Гистидин',
    'isoleucine': 'Изолейцин',
    'leucine': 'Лейцин',
    'lysine': 'Лизин',
    'methionine': 'Метионин',
    'phenylalanine': 'Фенилаланин',
    'threonine': 'Треонин',
    'tryptophan': 'Триптофан',
    'valine': 'Валин'
};

/**
 * Суточные нормы потребления незаменимых аминокислот.
 * Включает нижнюю и верхнюю границу нормы по каждой аминокислоте.
 * Значения основаны на рекомендациях от ВОЗ и других экспертных источников.
 */
const aminoAcidRecommendations = {
    essentialAminoAcids: {
        "histidine": {
            "lowerBound": 10,  // Нижняя граница нормы, мг/кг массы тела
            "upperBound": 14,  // Верхняя граница нормы, мг/кг массы тела
            "unit": "мг"
        },
        "isoleucine": {
            "lowerBound": 19,  // Нижняя граница нормы, мг/кг массы тела
            "upperBound": 42,  // Верхняя граница нормы, мг/кг массы тела
            "unit": "мг"
        },
        "leucine": {
            "lowerBound": 39,  // Нижняя граница нормы, мг/кг массы тела
            "upperBound": 54,  // Верхняя граница нормы, мг/кг массы тела
            "unit": "мг"
        },
        "lysine": {
            "lowerBound": 30,  // Нижняя граница нормы, мг/кг массы тела
            "upperBound": 45,  // Верхняя граница нормы, мг/кг массы тела
            "unit": "мг"
        },
        "methionine": {
            "lowerBound": 10,  // Нижняя граница нормы, мг/кг массы тела
            "upperBound": 15,  // Верхняя граница нормы, мг/кг массы тела
            "unit": "мг"
        },
        "phenylalanine": {
            "lowerBound": 25,  // Нижняя граница нормы, мг/кг массы тела
            "upperBound": 33,  // Верхняя граница нормы, мг/кг массы тела
            "unit": "мг"
        },
        "threonine": {
            "lowerBound": 15,  // Нижняя граница нормы, мг/кг массы тела
            "upperBound": 23,  // Верхняя граница нормы, мг/кг массы тела
            "unit": "мг"
        },
        "tryptophan": {
            "lowerBound": 4,   // Нижняя граница нормы, мг/кг массы тела
            "upperBound": 6,   // Верхняя граница нормы, мг/кг массы тела
            "unit": "мг"
        },
        "valine": {
            "lowerBound": 26,  // Нижняя граница нормы, мг/кг массы тела
            "upperBound": 34,  // Верхняя граница нормы, мг/кг массы тела
            "unit": "мг"
        }
    }
};





// Определение цвета ГИ
function getGlycemicIndexColor(gi) {
    if (gi <= 55) return '#28a745';
    if (gi <= 69) return 'rgba(124, 124, 35, 0.5)';
    return 'rgba(189, 77, 77, 0.5)';
}

// Получаем значение ГИ в зависимости от метода обработки
function getGlycemicIndex(methodIndex, product) {
    if (!product.GIDuringProcessing || product.GIDuringProcessing.length === 0) {
        return null; // ГИ отсутствует
    }
    if (product.rawFood) {
        return product.GIDuringProcessing[methodIndex];
    } else {
        // Проверяем, что индекс не выходит за пределы массива
        const adjustedIndex = Math.max(methodIndex + 2, 3);
        return product.GIDuringProcessing[adjustedIndex] || null;
    }
}









function calculateGlycemicLoad(gi, carbs) {
    return (gi * carbs) / 100;
}

function getGlycemicLoadRecommendation(gl) {
    if (gl <= 10) {
        return "Этот уровень гликемической нагрузки безопасен и способствует стабильному уровню сахара в крови.";
    } else if (gl > 10 && gl <= 20) {
        return "Средний уровень гликемической нагрузки. Рекомендуется следить за потреблением углеводов.";
    } else {
        return "Высокий уровень гликемической нагрузки может привести к перегрузке поджелудочной железы. Следует сократить вес продукта, количество порций или выбрать продукты с низким ГИ.";
    }
}

function updateGlycemicIndexDisplay(methodIndex, product, card) {
    const glycemicIndex = getGlycemicIndex(methodIndex, product);
    const giContainer = card.querySelector(".glycemic-index-container");
    const giValue = giContainer.querySelector(".glycemic-index-value");
    const giTooltip = giContainer.querySelector(".glycemic-index-tooltip");

    if (glycemicIndex !== null) {
        giContainer.style.display = 'inline-block';
        giValue.textContent = `ГИ: ${glycemicIndex}`;
        giContainer.style.backgroundColor = getGlycemicIndexColor(glycemicIndex);

        let glycemicLoadContainer = giTooltip.querySelector(".glycemic-load-container");
        if (!glycemicLoadContainer) {
            glycemicLoadContainer = document.createElement("div");
            glycemicLoadContainer.classList.add("glycemic-load-container");
            giTooltip.appendChild(glycemicLoadContainer);
        }

        const servingWeight = parseFloat(card.querySelector(".product-weight").value) || product.weightDefault;
        const servingsAmount = parseFloat(card.querySelector(".serving-amount").value) || 1;
        const carbsPerServing = product.carbs * (servingWeight / 100);
        const glycemicLoad = calculateGlycemicLoad(glycemicIndex, carbsPerServing * servingsAmount);

        const recommendation = getGlycemicLoadRecommendation(glycemicLoad);

        giTooltip.innerHTML = `
            <p><b>Нормы ГИ:</b><br>[Гликемического индекса]</p>
            <p class="low-gi ${getGiClass(glycemicIndex) === 'low-gi' ? 'highlight' : ''}">0-55 (Низкий)</p>
            <p class="medium-gi ${getGiClass(glycemicIndex) === 'medium-gi' ? 'highlight' : ''}">56-69 (Средний)</p>
            <p class="high-gi ${getGiClass(glycemicIndex) === 'high-gi' ? 'highlight' : ''}">70+ (Высокий)</p>

            <div class="glycemic-load-container">
                <span class="glycemic-load-value" style="background-color: ${getGlClassColor(glycemicLoad)}">ГН: ${glycemicLoad.toFixed(2)}</span>
                <div class="glycemic-load-tooltip">
                    <p><b>Нормы ГН:</b><br>[Гликемической нагрузки]</p>
                    <p class="low-gl ${getGlClass(glycemicLoad) === 'low-gl' ? 'highlight' : ''}">0-10 (Низкая)</p>
                    <p class="medium-gl ${getGlClass(glycemicLoad) === 'medium-gl' ? 'highlight' : ''}">11-20 (Средняя)</p>
                    <p class="high-gl ${getGlClass(glycemicLoad) === 'high-gl' ? 'highlight' : ''}">21+ (Высокая)</p>
                </div>
            </div>
            <div class="gi-recommendation">${recommendation}</div>
        `;
    } else {
        giContainer.style.display = 'none';
        giTooltip.innerHTML = '';
    }
}

function getGiClass(gi) {
    if (gi <= 55) return 'low-gi';
    if (gi >= 56 && gi <= 69) return 'medium-gi';
    return 'high-gi';
}

function getGlClass(gl) {
    if (gl <= 10) return 'low-gl';
    if (gl > 10 && gl <= 20) return 'medium-gl';
    return 'high-gl';
}

function getGlClassColor(gl) {
    if (gl <= 10) return '#4caf50'; // Зеленый цвет для низкого ГН
    if (gl > 10 && gl <= 20) return 'rgba(255, 193, 7, 0.8)'; // Желтый цвет для среднего ГН
    return 'rgba(255, 82, 82, 0.8)'; // Красный цвет для высокого ГН
}



// Определение цвета ОВП
function getORPColor(orp) {
    if (orp >= 300 && orp <= 500) return 'rgba(189, 77, 77, 0.685)'; // Сильные свободные радикалы - ярко-красный
    if (orp > 0 && orp < 300) return '#ff7f00'; // Слабые свободные радикалы - оранжевый
    if (orp >= -200 && orp <= 0) return '#28a745'; // Слабые антиоксиданты - зеленый
    if (orp < -200 && orp >= -700) return '#9400d3'; // Сильные антиоксиданты - фиолетовый
    return '#d3d3d3'; // По умолчанию - серый
}

// Создание всплывающего окна для ОВП с подсветкой соответствующей нормы
function getORPTooltip(orp) {
    let description = '';
    
    if (orp >= 300 && orp <= 500) {
        description = 'Этот продукт обладает ярко выраженным наличием свободных радикалов. Он будет быстро забирать энергию из ваших клеток (отрицательный заряд), чтобы восстановиться.';
    } else if (orp > 0 && orp < 300) {
        description = 'Этот продукт обладает слабыми свободными радикалами и будет забирать небольшое количество энергии из ваших клеток для восстановления.';
    } else if (orp >= -200 && orp <= 0) {
        description = 'Этот продукт обладает слабыми антиоксидантными свойствами. Он будет восстанавливать энергию ваших клеток, немного улучшая их защитные свойства.';
    } else if (orp < -200 && orp >= -700) {
        description = 'Этот продукт обладает сильными антиоксидантными свойствами. Он будет эффективно восстанавливать энергию клеток и значительно усиливать их защитные функции.';
    }

    return `
        <p><b>Нормы ОВП:</b><br>[Окислительно-восстановительный потенциал]</p>
        <p class="${orp >= 300 && orp <= 500 ? 'highlight' : ''}" style="background-color: ${orp >= 300 && orp <= 500 ? 'rgba(189, 77, 77, 0.685)' : 'transparent'};">+300 - +500 мВ (Сильные свободные радикалы)</p>
        <p class="${orp > 0 && orp < 300 ? 'highlight' : ''}" style="background-color: ${orp > 0 && orp < 300 ? '#ff7f00' : 'transparent'};">0 - +300 мВ (Слабые свободные радикалы)</p>
        <p class="${orp >= -200 && orp <= 0 ? 'highlight' : ''}" style="background-color: ${orp >= -200 && orp <= 0 ? '#4caf50' : 'transparent'};">0 - -200 мВ (Слабые антиоксиданты)</p>
        <p class="${orp < -200 && orp >= -700 ? 'highlight' : ''}" style="background-color: ${orp < -200 && orp >= -700 ? '#9400d3' : 'transparent'};">-200 - -700 мВ (Сильные антиоксиданты)</p>
        <p class="orp-recommendation">${description}</p>
    `;
}

// Функция для обновления отображения ОВП
function updateORPDisplay(product, card) {
    if (product.ORPValue === undefined || product.ORPValue === null) {
        // Если у продукта нет значения ОВП, не создавать индикатор
        return;
    }

    // Проверка на существование контейнера
    let orpContainer = card.querySelector(".orp-container");
    if (!orpContainer) {
        orpContainer = document.createElement("div");
        orpContainer.classList.add("orp-container");
        card.querySelector(".indicators-container").appendChild(orpContainer);
    }
    orpContainer.style.backgroundColor = getORPColor(product.ORPValue);

    // Обновление или создание значений
    let orpValue = orpContainer.querySelector(".orp-value");
    if (!orpValue) {
        orpValue = document.createElement("span");
        orpValue.classList.add("orp-value");
        orpContainer.appendChild(orpValue);
    }
    orpValue.textContent = `ОВП: ${product.ORPValue} мВ`;

    let orpTooltip = orpContainer.querySelector(".orp-tooltip");
    if (!orpTooltip) {
        orpTooltip = document.createElement("div");
        orpTooltip.classList.add("orp-tooltip");
        orpContainer.appendChild(orpTooltip);
    }
    orpTooltip.innerHTML = getORPTooltip(product.ORPValue);
}


// Определение цвета pH
function getPHColor(ph) {
    if (ph < 3.5) return '#ff0000'; // Сильно кислый - красный
    if (ph >= 3.5 && ph < 4.5) return '#ff7f7f'; // Умеренно кислый - светло-красный
    if (ph >= 4.5 && ph < 7) return '#ff7f00'; // Легкая кислотность - оранжевый
    if (ph === 7) return '#4caf50'; // Нейтральный - зеленый
    if (ph > 7 && ph <= 9) return '#1f9c76'; // Легкая щелочность - темно-бирюзовый
    if (ph > 9) return '#9400d3'; // Щелочной - фиолетовый
    return '#d3d3d3'; // По умолчанию - серый
}




// Создание всплывающего окна для pH с подсветкой соответствующей нормы
function getPHTooltip(ph) {
    let description = '';

    if (ph < 3.5) {
        description = 'Сильно кислые продукты могут повышать риск повреждения зубной эмали, раздражать желудок и провоцировать Ацидоз. Они также могут способствовать потере минералов из костей.';
    } else if (ph >= 3.5 && ph < 4.5) {
        description = 'Умеренно кислые продукты могут иметь слабое влияние на зубы и желудок. Включение таких продуктов в рацион следует ограничивать.';
    } else if (ph >= 4.5 && ph < 7) {
        description = 'Легкая кислотность. Продукты в этом диапазоне обычно безопасны, но употребление их без ограничений может негативно сказаться на организме.';
    } else if (ph === 7) {
        description = 'Нейтральный pH. Такие продукты не оказывают значительного воздействия на кислотно-щелочной баланс организма.';
    } else if (ph > 7 && ph <= 9) {
        description = 'Легкая щелочность. Щелочные продукты могут способствовать улучшению pH баланса крови и укреплению костей.';
    } else if (ph > 9) {
        description = 'Щелочные продукты помогают поддерживать щелочной баланс в организме, что может способствовать лучшему усвоению минералов и укреплению здоровья костей. Но не рекомендуются в больших количествах т.к. вызывают Алколоз.';
    }

    return `
        <p><b>Нормы pH:</b><br>[Кислотно-щелочной баланс]</p>
        <p class="${ph < 3.5 ? 'highlight' : ''}" style="background-color: ${ph < 3.5 ? '#ff0000' : 'transparent'};">pH < 3.5 (Сильно кислый)</p>
        <p class="${ph >= 3.5 && ph < 4.5 ? 'highlight' : ''}" style="background-color: ${ph >= 3.5 && ph < 4.5 ? '#ff7f7f' : 'transparent'};">3.5 - 4.5 (Умеренно кислый)</p>
        <p class="${ph >= 4.5 && ph < 7 ? 'highlight' : ''}" style="background-color: ${ph >= 4.5 && ph < 7 ? '#ff7f00' : 'transparent'};">4.5 - 7 (Легкая кислотность)</p>
        <p class="${ph === 7 ? 'highlight' : ''}" style="background-color: ${ph === 7 ? '#4caf50' : 'transparent'};">pH = 7 (Нейтральный)</p>
        <p class="${ph > 7 && ph <= 9 ? 'highlight' : ''}" style="background-color: ${ph > 7 && ph <= 9 ? '#1f9c76' : 'transparent'};">7 - 9 (Легкая щелочность)</p>
        <p class="${ph > 9 ? 'highlight' : ''}" style="background-color: ${ph > 9 ? '#9400d3' : 'transparent'};">pH > 9 (Щелочной)</p>
        <p class="ph-recommendation">${description}</p>
    `;
}


// Функция для обновления отображения pH
function updatePHDisplay(product, card) {
    if (product.pHValue === undefined || product.pHValue === null) {
        // Если у продукта нет значения pH, не создавать индикатор
        return;
    }

    // Проверка на существование контейнера
    let phContainer = card.querySelector(".ph-container");
    if (!phContainer) {
        phContainer = document.createElement("div");
        phContainer.classList.add("ph-container");
        card.querySelector(".indicators-container").appendChild(phContainer);
    }
    phContainer.style.backgroundColor = getPHColor(product.pHValue);

    // Обновление или создание значений
    let phValue = phContainer.querySelector(".ph-value");
    if (!phValue) {
        phValue = document.createElement("span");
        phValue.classList.add("ph-value");
        phContainer.appendChild(phValue);
    }
    phValue.textContent = `pH: ${product.pHValue}`;

    let phTooltip = phContainer.querySelector(".ph-tooltip");
    if (!phTooltip) {
        phTooltip = document.createElement("div");
        phTooltip.classList.add("ph-tooltip");
        phContainer.appendChild(phTooltip);
    }
    phTooltip.innerHTML = getPHTooltip(product.pHValue);
}




// Переводы названий сахаров
const sugarsTranslations = {
    'monosaccharides': 'Моносахариды',
    'glucose': 'Глюкоза',
    'fructose': 'Фруктоза',
    'galactose': 'Галактоза',
    'disaccharides': 'Дисахариды',
    'sucrose': 'Сахароза',
    'lactose': 'Лактоза',
    'maltose': 'Мальтоза',
    'polysaccharides': 'Полисахариды',
    'starch': 'Крахмал',
    'otherSugarsAndSugarAlcohols': 'Другие сахара и сахарные спирты',
    'trehalose': 'Треалоза',
    'sorbitol': 'Сорбитол',
    'xylitol': 'Ксилитол',
    'mannitol': 'Маннитол',
    'totalCarbohydrates': 'Общие углеводы',
    'totalSugars': 'Общие сахара',
    'addedSugars': 'Добавленные сахара'
};





/**
 * Суточные нормы потребления сахаров.
 * Включает рекомендуемые значения потребления по различным видам сахаров.
 * Значения основаны на рекомендациях от ВОЗ и других экспертных источников.
 */
const sugarRecommendations = {
    sugars: {
        "glucose": {
            "recommendedIntake": 130,  // Рекомендуемое потребление, г/день (минимальное количество для мозга)
            "unit": "г"
        },
        "fructose": {
            "recommendedIntake": 50,  // Рекомендуемое потребление, г/день (рекомендуемая верхняя граница)
            "unit": "г"
        },
        "galactose": {
            "recommendedIntake": 0,  // Специальных рекомендаций нет, потребление происходит с лактозой
            "unit": "г"
        },
        "sucrose": {
            "recommendedIntake": 25,  // Рекомендуемая верхняя граница для добавленных сахаров (включая сахарозу), г/день
            "unit": "г"
        },
        "lactose": {
            "recommendedIntake": 0,  // Специальных рекомендаций нет, потребление происходит с молочными продуктами
            "unit": "г"
        },
        "maltose": {
            "recommendedIntake": 0,  // Специальных рекомендаций нет, потребление происходит с продуктами из крахмала
            "unit": "г"
        },
        "starch": {
            "recommendedIntake": 130,  // Рекомендуемое потребление крахмала как источника углеводов, г/день
            "unit": "г"
        },
        "trehalose": {
            "recommendedIntake": 0,  // Специальных рекомендаций нет, редко встречается в продуктах
            "unit": "г"
        },
        "sorbitol": {
            "recommendedIntake": 15,  // Рекомендуемая верхняя граница потребления, г/день
            "unit": "г"
        },
        "xylitol": {
            "recommendedIntake": 10,  // Рекомендуемая верхняя граница потребления, г/день
            "unit": "г"
        },
        "mannitol": {
            "recommendedIntake": 20,  // Рекомендуемая верхняя граница потребления, г/день
            "unit": "г"
        },
        "addedSugars": {
            "recommendedIntake": 25,  // Рекомендуемая верхняя граница для добавленных сахаров, г/день
            "unit": "г"
        }
    }
};







const phytochemicalTranslations = {
    "resveratrol": "Ресвератрол",
    "catechins": "Катехины",
    "curcumin": "Куркумин",
    "quercetin": "Кверцетин",
    "anthocyanins": "Антоцианы",
    "lycopene": "Ликопин",
    "betaCarotene": "Бета-каротин",
    "lutein": "Лютеин",
    "zeaxanthin": "Зеаксантин",
    "ellagicAcid": "Эллаговая кислота",
    "saponins": "Сапонины",
    "hesperidin": "Гесперидин",
    "rutin": "Рутин",
    "allicin": "Аллицин",
    "sulforaphane": "Сульфорафан",
    "flavonols": "Флавонолы",
    "isoflavones": "Изофлавоны",
    "epicatechin": "Эпикатехин",
    "genistein": "Генистеин",
    "pterostilbene": "Птеростильбен"
};




/**
 * Суточные нормы потребления фитохимических соединений.
 * Включает рекомендуемые значения потребления по различным фитохимическим соединениям.
 * Значения основаны на текущих исследованиях и экспертных рекомендациях.
 */
const phytochemicalRecommendations = {
    phytochemicals: {
        "resveratrol": {
            "recommendedIntake": 1,  // Ориентировочная доза, часто получаемая с пищей, мг/день
            "unit": "мг"
        },
        "catechins": {
            "recommendedIntake": 300,  // Рекомендуемая доза для поддержания здоровья, мг/день
            "unit": "мг"
        },
        "curcumin": {
            "recommendedIntake": 500,  // Ориентировочная терапевтическая доза, мг/день
            "unit": "мг"
        },
        "quercetin": {
            "recommendedIntake": 10,  // Среднее потребление с пищей, мг/день
            "unit": "мг"
        },
        "anthocyanins": {
            "recommendedIntake": 100,  // Ориентировочная доза для антиоксидантного эффекта, мг/день
            "unit": "мг"
        },
        "lycopene": {
            "recommendedIntake": 10,  // Ориентировочная доза для антиоксидантного эффекта, мг/день
            "unit": "мг"
        },
        "betaCarotene": {
            "recommendedIntake": 6000,  // Рекомендуемое потребление как провитамина A, мкг/день
            "unit": "мкг"
        },
        "lutein": {
            "recommendedIntake": 6000,  // Рекомендуемое потребление для поддержки зрения, мкг/день
            "unit": "мкг"
        },
        "zeaxanthin": {
            "recommendedIntake": 2000,  // Рекомендуемое потребление для поддержки зрения, мкг/день
            "unit": "мкг"
        },
        "ellagicAcid": {
            "recommendedIntake": 30,  // Ориентировочное потребление с ягодами и орехами, мг/день
            "unit": "мг"
        },
        "saponins": {
            "recommendedIntake": 50,  // Ориентировочное потребление с бобовыми, мг/день
            "unit": "мг"
        },
        "hesperidin": {
            "recommendedIntake": 500,  // Ориентировочная доза с цитрусовыми, мг/день
            "unit": "мг"
        },
        "rutin": {
            "recommendedIntake": 50,  // Ориентировочная доза для антиоксидантного эффекта, мг/день
            "unit": "мг"
        },
        "allicin": {
            "recommendedIntake": 10,  // Ориентировочное потребление с чесноком, мг/день
            "unit": "мг"
        },
        "sulforaphane": {
            "recommendedIntake": 20,  // Ориентировочная доза с крестоцветными овощами, мг/день
            "unit": "мг"
        },
        "flavonols": {
            "recommendedIntake": 100,  // Среднее потребление с фруктами и овощами, мг/день
            "unit": "мг"
        },
        "isoflavones": {
            "recommendedIntake": 50,  // Ориентировочная доза с соевыми продуктами, мг/день
            "unit": "мг"
        },
        "epicatechin": {
            "recommendedIntake": 50,  // Ориентировочная доза с шоколадом и чаем, мг/день
            "unit": "мг"
        },
        "genistein": {
            "recommendedIntake": 50,  // Ориентировочная доза с соевыми продуктами, мг/день
            "unit": "мг"
        },
        "pterostilbene": {
            "recommendedIntake": 1,  // Ориентировочная доза с ягодами, мг/день
            "unit": "мг"
        }
    }
};











    // Отображение карточки продукта
function displayProductCard(product) {
    productsDiv.innerHTML = '';

    const card = document.createElement("div");
    card.classList.add("product-card");

    // Установка отступа сверху на 200 пикселей
card.style.marginTop = '-265px';

// Функция для обновления опций порций
const updateServingsOptions = () => {
    return Object.keys(product.servings).map(serving => {
        // Если порция "шт.", используем вес из product.servings, а не из productWeight
        let servingWeight = product.servings[serving];
        return `<option value="${serving}" ${serving === 'шт.' ? 'selected' : ''}>${serving} [${servingWeight} г]</option>`;
    }).join('');
};


    const mealsOptions = ["breakfast", "lunch", "dinner"].map(meal => 
        `<option value="${meal}">${meal === 'breakfast' ? 'Завтрак' : meal === 'lunch' ? 'Обед' : 'Ужин'}</option>`
    ).join('');

    const defaultWeight = product.weightDefault;


    product.vegan;
    product.GlycemicIndex;

    

    // Создание HTML-кода карточки
    card.innerHTML = `
        <img class="product-image" src="${product.image}" alt="${product.name}">

        <div>
            <h3 class="product-name">${product.name}</h3>
            ${product.manufacturerOrSeller ? `<p><span class="manufacturerOrSeller"><b>Производитель/Продавец:</b> ${product.manufacturerOrSeller}</span></p>` : ''}
            ${product.description ? `<p class="description-product-in-card"><b>Описание:</b><span class="description-in-italics">  ${product.description}</span></p>` : ''}

            <!-- Контейнер для индикаторов -->
            <div class="indicators-container">

            <!-- Добавляем Vegan, если продукт является веганским -->
        ${product.vegan ? `
            <p class="vegan-info" style="position: relative;"><b>Vegan</b>
                <span class="vegan-tooltip"><span class="vegan-recommendation">Vegan [веганские] продукты исключают любые ингредиенты животного происхождения, такие как мясо, молоко, яйца, мёд и т.д. Они обычно богаты растительными белками и клетчаткой, что способствует улучшению здоровья сердца, снижению веса и общего самочувствия.</span></span>
            </p>` : ''}

            <!-- Добавляем сюда RAW, он будет динамически управляться -->
        <p class="raw-info" style="display: none; position: relative;"><b>RAW</b>
            <span class="raw-tooltip"><span class="raw-recommendation">RAW [сыроедные] продукты сохраняют больше питательных веществ и ферментов, которые могут быть потеряны при термической обработке. Они способствуют улучшению пищеварения, поддержанию уровня энергии и укреплению иммунной системы.</span></span>
        </p>

              <!-- Контейнер для ГИ -->
            <div class="glycemic-index-container">
                    <span class="glycemic-index-value"></span>
                    <div class="glycemic-index-tooltip"></div>
                </div>

            </div>

            <div class="modification-panel">

            <label><b>Введите вес продукта (граммы):</b>
                <input type="number" class="product-weight" min="1" step="1" value="${defaultWeight}">
            </label>
            <p><b>Калории:</b> <span id="calories-info" class="calories-info">${product.calories}</span> ккал</p>
            <p><b>Белки:</b> <span class="protein-info">${product.protein}</span> г</p>
            <p><b>Жиры:</b> <span class="fats-info">${product.fats}</span> г</p>
            <p><b>Углеводы:</b> <span class="carbs-info">${product.carbs}</span> г</p>
            <p><b>Содержание клетчатки:</b> <span class="fiber-info">${product.fiberContent}</span> г</p>
            <p><b>Содержание воды:</b> <span class="water-info">0.00</span> мл</p>

            

            <label><b>Метод обработки:</b>
                <select class="processing-method">
                    ${Object.keys(processingMethods).map(method => 
                        `<option value="${method}">${method}</option>`
                    ).join('')}
                </select>
            </label>

            <label><b>Меры объема:</b>
            <select class="serving-size">
                ${updateServingsOptions(defaultWeight)}
            </select>
            </label>

            <label><b>Кол-во порций:</b>
            <input type="number" class="serving-amount" placeholder="Количество порций" min="1" step="1">
            </label>

            <label><b>Выбранный прием пищи:</b>
            <select class="meal-time">
                <option value="">Выберите прием пищи</option>
                ${mealsOptions}
            </select>
            </label>

            <button class="add-to-meal">Добавить в прием пищи</button>

            
            </div>

            <!-- Проверяем, существует ли уже BJU виджет -->
            ${!document.querySelector('.bju-widget') ? createBJUWidget(product) : ''}

       


        </div>
    `;


    // Функция для добавления крестика к карточке
function addCloseButtonCard(card) {
    const closeButton = document.createElement("span");
    closeButton.classList.add("close-button-card"); // Добавляем класс для крестика
    closeButton.innerHTML = "&times;"; // Символ крестика

    // Событие для удаления карточки при клике на крестик
    closeButton.addEventListener("click", () => {
        card.remove(); // Удаление карточки
    });

    // Добавляем крестик в карточку
    card.appendChild(closeButton);
}

addCloseButtonCard(card);














addFavoriteButton(card, product);















    


    function createBJUWidget(product) {
        // Проверяем наличие белков, жиров или углеводов
        const hasNutrients = product.protein > 0 || product.fats > 0 || product.carbs > 0;
    
        // Если нет белков, жиров и углеводов, возвращаем пустую строку
        if (!hasNutrients) return '';
    
        // Выбираем базовый макроэлемент
        const baseValue = product.protein || product.fats || product.carbs;
    
        // Рассчитываем соотношение БЖУ относительно базового макроэлемента
        const proteinRatio = (product.protein / baseValue).toFixed(2);
        const fatsRatio = (product.fats / baseValue).toFixed(2);
        const carbsRatio = (product.carbs / baseValue).toFixed(2);
    
        // Форматируем соотношение для вывода
        const bjuRatio = `${proteinRatio} : ${fatsRatio} : ${carbsRatio}`;
    
        // Возвращаем HTML-код контейнера с БЖУ и отдельным элементом для соотношения
        return `
            <div class="bju-widget">
                <h4>Доля БЖУ в продукте</h4>
                <div class="bju-content">
                    
                    <div class="bju-chart-container" id="bjuChart2">
                        <div class="bju-chart" id="bjuChart"></div>
                    </div>
                    <div class="bju-legend">
                        <div class="bju-item">
                            <span class="bju-color" style="background-color: #4CAF50;"></span>
                            <span class="bju-label">Белки: <span id="proteinGrams">${product.protein}</span> г (<span id="proteinPercent"></span>%)</span>
                        </div>
                        <div class="bju-item">
                            <span class="bju-color" style="background-color: #FFEB3B;"></span>
                            <span class="bju-label">Жиры: <span id="fatsGrams">${product.fats}</span> г (<span id="fatsPercent"></span>%)</span>
                        </div>
                        <div class="bju-item">
                            <span class="bju-color" style="background-color: #F44336;"></span>
                            <span class="bju-label">Углеводы: <span id="carbsGrams">${product.carbs}</span> г (<span id="carbsPercent"></span>%)</span>
                        </div>
                        <div class="bju-ratio">
                        <span class="bju-ratio-label">Соотношение БЖУ: ${bjuRatio}</span>
                    </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    
    
    
    

 


// Функция для создания цветного индикатора
function getRecommendationIndicator(percentage) {
    let color;
    
    if (percentage >= 0 && percentage < 25) {
        color = '#1961a8'; // Мягкий темно-синий цвет
    } else if (percentage >= 25 && percentage < 75) {
        color = '#22b376'; // Темно-бирюзовый цвет
    } else if (percentage >= 75 && percentage < 100) {
        color = '#4CAF50'; // Зеленый цвет
    } else if (percentage >= 100 && percentage < 150) {
        color = '#FF5722'; // Оранжевый цвет
    } else if (percentage >= 150) {
        color = '#F44336'; // Красный цвет
    }

    return `
        <div class="indicator" style="background-color: ${color};">
            ${percentage}%
        </div>`;
}

// Функция для создания цветного индикатора для токсичных веществ
function getToxicityIndicator(percentage) {
    let color;

    if (percentage >= 0 && percentage < 25) {
        color = '#4CAF50'; // Зеленый цвет
    } else if (percentage >= 25 && percentage < 50) {
        color = '#FFEB3B'; // Желтый цвет
    } else if (percentage >= 50 && percentage < 100) {
        color = '#FF5722'; // Оранжевый цвет
    } else if (percentage >= 100) {
        color = '#F44336'; // Красный цвет
    }

    return `
        <div class="indicator" style="background-color: ${color};">
            ${percentage}%
        </div>`;
}


// Функция для получения суточной нормы витамина
function getVitaminRecommendation(vitamin) {
    return vitaminRecommendations.vitamins[vitamin] || {};
}





// Добавляем контейнер для витаминов только если есть витамины
if (product.vitamins && Object.keys(product.vitamins).length > 0) {
    const vitaminsContainer = document.createElement("div");
    vitaminsContainer.classList.add("vitamins-container");

    vitaminsContainer.innerHTML = `
        <h4>Витамины</h4>
        <table class="vitamins-table">
            <thead>
                <tr>
                    <th>Название</th>
                    <th>Значение</th>
                    <th>От РСП</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(product.vitamins).map(([vitamin, value]) => {
                    if (vitamin.endsWith("units")) {
                        return ''; // Пропускаем поля units
                    }
                    const unitKey = vitamin + 'units';
                    const unit = product.vitamins[unitKey] || '';
                    const vitaminName = vitaminTranslations[vitamin] || vitamin;
                    const vitaminValue = (value * defaultWeight / 100).toFixed(2);

                    // Получаем рекомендации по витамину
                    const recommendation = getVitaminRecommendation(vitamin);
                    const lowerBound = recommendation.lowerBound || 0;
                    const upperBound = recommendation.upperBound || Infinity;
                    const recommendedUnit = recommendation.unit || '';

                    // Проверка совпадения единиц измерения
                    if (unit !== recommendedUnit) {
                        console.error(`Несоответствие единиц измерения для ${vitaminName}: ${unit} и ${recommendedUnit}`);
                        return '';
                    }

                    // Рассчитываем процент от суточной нормы по верхней границе
                    const percentage = upperBound > 0 ? ((vitaminValue / upperBound) * 100).toFixed(2) : '0';

                    // Всплывающая подсказка с нижней и верхней границей нормы
                    const tooltip = `Норма: ${lowerBound}-${upperBound} ${unit}`;

                    return `
                        <tr>
                            <td>${vitaminName}</td>
                            <td>${vitaminValue} ${unit}</td>
                            <td title="${tooltip}">${getRecommendationIndicator(percentage)}</td>
                        </tr>`;
                }).join('')}
            </tbody>
        </table>`;

    card.appendChild(vitaminsContainer);
}

// Функция для получения суточной нормы минерала
function getMineralRecommendation(mineral) {
    return mineralRecommendations.minerals[mineral] || {};
}

// Функция для создания строки таблицы минералов
function createMineralRow(mineral, value, unit, defaultWeight, isToxic = false) {
    if (product.minerals && Object.keys(product.minerals).length > 0) {
    const mineralName = mineralTranslations[mineral] || mineral;
    const mineralValue = (value * defaultWeight / 100).toFixed(2);

    // Получаем рекомендации по минералу
    const recommendation = getMineralRecommendation(mineral);
    const lowerBound = recommendation.lowerBound || 0;
    const upperBound = recommendation.upperBound || Infinity;
    const recommendedUnit = recommendation.unit || '';

    // Проверка совпадения единиц измерения
    if (unit !== recommendedUnit) {
        console.error(`Несоответствие единиц измерения для ${mineralName}: ${unit} и ${recommendedUnit}`);
        return '';
    }

    // Рассчитываем процент от суточной нормы по верхней границе
    const percentage = upperBound > 0 ? ((mineralValue / upperBound) * 100).toFixed(2) : '0';

    // Всплывающая подсказка с нижней и верхней границей нормы
    const tooltip = `Норма: ${lowerBound}-${upperBound} ${unit}`;

    // Выбираем индикатор в зависимости от типа минерала
    const indicator = isToxic ? getToxicityIndicator(percentage) : getRecommendationIndicator(percentage);

    return `
        <tr>
            <td>${mineralName}</td>
            <td>${mineralValue} ${unit}</td>
            <td title="${tooltip}">${indicator}</td>
        </tr>`;
}
}

// Проверяем наличие минералов в продукте
if (product.minerals && Object.keys(product.minerals).length > 0) {
    const mineralsContainer = document.createElement("div");
    mineralsContainer.classList.add("minerals-container");

    // Создаем таблицы для эссенциальных и токсичных минералов
    const essentialMineralsRows = [];
    const toxicMineralsRows = [];

    Object.entries(product.minerals).forEach(([mineral, value]) => {
        if (mineral.endsWith("Units")) {
            return; // Пропускаем поля units
        }

        const unitKey = mineral + 'Units';
        const unit = product.minerals[unitKey] || '';

        const recommendation = getMineralRecommendation(mineral);
        const effect = recommendation.effect || 'неизвестный';

        if (effect === 'эссенциальный') {
            essentialMineralsRows.push(createMineralRow(mineral, value, unit, defaultWeight));
        } else if (effect === 'токсичный') {
            toxicMineralsRows.push(createMineralRow(mineral, value, unit, defaultWeight, true));
        }
    });

    // Добавляем таблицу для эссенциальных минералов
    mineralsContainer.innerHTML = `
        <h4>Эссенциальные минералы</h4>
        <table class="minerals-table">
            <thead>
                <tr>
                    <th>Название</th>
                    <th>Значение</th>
                    <th>От РСП</th>
                </tr>
            </thead>
            <tbody>
                ${essentialMineralsRows.join('')}
            </tbody>
        </table>`;

    // Добавляем таблицу для токсичных минералов
    if (toxicMineralsRows.length > 0) {
        mineralsContainer.innerHTML += `
            <h4 class="h-toxic">Токсичные минералы</h4>
            <table class="minerals-table">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Значение</th>
                        <th>От РСП</th>
                    </tr>
                </thead>
                <tbody>
                    ${toxicMineralsRows.join('')}
                </tbody>
            </table>`;
    }

    card.appendChild(mineralsContainer);
}

// Функция для создания полосок баланса натрия и калия
function createSodiumPotassiumBalanceWidget(sodium, sodiumUnits, potassium, potassiumUnits) {
    if (product.minerals && product.minerals.sodium && product.minerals.potassium) {
        // Рассчитываем соотношение натрия к калию
        const sodiumPotassiumRatio = (sodium / potassium).toFixed(2);
        let ratioCategory = '';
        let ratioColor = '';
        let ratioText = '';
        let ratioDescription = '';

        // Определяем категорию соотношения и описание на основе соотношения
        if (sodiumPotassiumRatio < 0.5) {
            ratioCategory = 'низкое';
            ratioColor = '#F44336';
            ratioText = '▲ Гиперкалиемия';
            ratioDescription = 'Высокий уровень калия в продукте (по отношению к натрию) может негативно повлиять на здоровье. Избыточное количество калия может нарушить функции сердца, вызывая аритмии и другие сердечные проблемы. Также может затрудниться работа почек, что приведет к накоплению калия и ухудшению общего состояния организма. Рекомендуется следить за потреблением калия и при необходимости проконсультироваться с врачом.';
        } else if (sodiumPotassiumRatio >= 0.5 && sodiumPotassiumRatio <= 1.5) {
            ratioCategory = 'оптимальное';
            ratioColor = '#4CAF50';
            ratioText = 'Норма';
            ratioDescription = 'Этот уровень калия и натрия в продукте считается оптимальным для поддержания здоровья. Он способствует нормальному функционированию организма и поддерживает энергетический баланс.';
        } else {
            ratioCategory = 'высокое';
            ratioColor = '#F44336';
            ratioText = '▲ Гипернатриемия';
            ratioDescription = 'Высокий уровень натрия в продукте (по отношению к калию) может повышать риск высокого кровяного давления, что в свою очередь увеличивает вероятность сердечно-сосудистых заболеваний. Также это может способствовать задержке жидкости в организме и проблемам с почками. Рекомендуется следить за потреблением натрия для поддержания общего здоровья.';
        }

        // Рассчитываем относительную ширину полосок
        const sodiumWidth = sodiumPotassiumRatio >= 1 ? 100 : (sodiumPotassiumRatio * 100);
        const potassiumWidth = sodiumPotassiumRatio <= 1 ? 100 : (100 / sodiumPotassiumRatio);

        // Создаем HTML структуру для виджета
        return `
            <div class="balance-widget-NK">
                <h4 class="balance-title-NK">Баланс Натрия и Калия</h4>
                <div class="balance-bars-container-NK">
                    <div class="balance-bar-NK sodium-bar-NK" style="background-color: #87CEEB; width: ${sodiumWidth}%;">
                    </div>
                    <div class="balance-bar-NK potassium-bar-NK" style="background-color: #665605; width: ${potassiumWidth}%;">
                    </div>
                </div>
                
                <div class="buttons-container-NK">
                    <button class="mineral-button-NK sodium-button-NK" style="background-color: #87CEEB;">
                        Натрий: ${sodium} ${sodiumUnits}
                    </button>
                    <button class="mineral-button-NK potassium-button-NK" style="background-color: #665605;">
                        Калий: ${potassium} ${potassiumUnits}
                    </button>
                </div>
                <div class="ratio-NK">
                    <span class ="NK-ratios-header-bottom">Соотношение: ${sodiumPotassiumRatio}:1</span>
                    <div class="ratio-indicator-NK" style="background-color: ${ratioColor};">
                        <span>${ratioText}</span>
                        <div class="tooltip-NK">
                            <div class="tooltip-norm-NK">Норма: 0.5-1.5</div>
                            <div class="tooltip-description-NK"><em>${ratioDescription}</em></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}












// Функция для получения суточной нормы по жирам и холестерину
function getFatRecommendation(fat) {
    return fatRecommendations.fattyAcidsAndCholesterol[fat] || {};
}

// Добавляем контейнер для жиров только если есть данные о жирах
if (product.fattyAcidsAndCholesterol && Object.keys(product.fattyAcidsAndCholesterol).length > 0) {
    const fatsContainer = document.createElement("div");
    fatsContainer.classList.add("fats-container");

    fatsContainer.innerHTML = `
        <h4>Жиры</h4>
        <table class="fats-table">
            <thead>
                <tr>
                    <th>Название</th>
                    <th>Значение</th>
                    <th>От РСП</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(product.fattyAcidsAndCholesterol).map(([fat, value]) => {
                    if (fat.endsWith("Units")) {
                        return ''; // Пропускаем поля units
                    }
                    const unitKey = fat + 'Units';
                    const unit = product.fattyAcidsAndCholesterol[unitKey] || '';
                    const fatName = fattyAcidsAndCholesterolTranslations[fat] || fat;
                    const fatValue = (value * defaultWeight / 100).toFixed(2);

                    // Получаем рекомендации по жирам
                    const recommendation = getFatRecommendation(fat);
                    const lowerBound = recommendation.lowerBound || 0;
                    const upperBound = recommendation.upperBound || Infinity;
                    const recommendedUnit = recommendation.unit || '';

                    // Проверка совпадения единиц измерения
                    if (unit !== recommendedUnit) {
                        console.error(`Несоответствие единиц измерения для ${fatName}: ${unit} и ${recommendedUnit}`);
                        return '';
                    }

                    // Рассчитываем процент от суточной нормы по верхней границе
                    const percentage = upperBound > 0 ? ((fatValue / upperBound) * 100).toFixed(2) : '0';

                    // Всплывающая подсказка с нижней и верхней границей нормы
                    const tooltip = `Норма: ${lowerBound}-${upperBound} ${unit}`;

                    return `
                        <tr>
                            <td>${fatName}</td>
                            <td>${fatValue} ${unit}</td>
                            <td title="${tooltip}">${getRecommendationIndicator(percentage)}</td>
                        </tr>`;
                }).join('')}
            </tbody>
        </table>`;

    card.appendChild(fatsContainer);
}

// Функция для получения суточной нормы по незаменимым аминокислотам
function getAminoAcidRecommendation(aminoAcid) {
    return aminoAcidRecommendations.essentialAminoAcids[aminoAcid] || {};
}



// Добавляем контейнер для незаменимых аминокислот только если есть данные о них
if (product.essentialAminoAcids && Object.keys(product.essentialAminoAcids).length > 0) {
    const aminoAcidsContainer = document.createElement("div");
    aminoAcidsContainer.classList.add("amino-acids-container");

    aminoAcidsContainer.innerHTML = `
        <h4>Незаменимые аминокислоты</h4>
        <table class="amino-acids-table">
            <thead>
                <tr>
                    <th>Название</th>
                    <th>Значение</th>
                    <th>От РСП</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(product.essentialAminoAcids).map(([aminoAcid, value]) => {
                    if (aminoAcid.endsWith("Units")) {
                        return ''; // Пропускаем поля units
                    }
                    const unitKey = aminoAcid + 'Units';
                    const unit = product.essentialAminoAcids[unitKey] || '';
                    const aminoAcidName = essentialAminoAcidsTranslations[aminoAcid] || aminoAcid;
                    const aminoAcidValue = (value * defaultWeight / 100).toFixed(2);

                    // Получаем рекомендации по аминокислоте
                    const recommendation = getAminoAcidRecommendation(aminoAcid);
                    const lowerBound = recommendation.lowerBound || 0;
                    const upperBound = recommendation.upperBound || Infinity;
                    const recommendedUnit = recommendation.unit || '';

                    // Проверка совпадения единиц измерения
                    if (unit !== recommendedUnit) {
                        console.error(`Несоответствие единиц измерения для ${aminoAcidName}: ${unit} и ${recommendedUnit}`);
                        return '';
                    }

                    // Рассчитываем процент от суточной нормы по верхней границе
                    const percentage = upperBound > 0 ? ((aminoAcidValue / upperBound) * 100).toFixed(2) : '0';

                    // Всплывающая подсказка с нижней и верхней границей нормы
                    const tooltip = `Норма: ${lowerBound}-${upperBound} ${unit}`;

                    return `
                        <tr>
                            <td>${aminoAcidName}</td>
                            <td>${aminoAcidValue} ${unit}</td>
                            <td title="${tooltip}">${getRecommendationIndicator(percentage)}</td>
                        </tr>`;
                }).join('')}
            </tbody>
        </table>`;

    card.appendChild(aminoAcidsContainer);
}



// Функция для создания цветного индикатора для потребления сахаров
function getSugarRecommendationIndicator(percentage) {
    let color;
    
    if (percentage >= 0 && percentage < 25) {
        color = '#1961a8'; // Мягкий темно-синий цвет
    } else if (percentage >= 25 && percentage < 75) {
        color = '#22b376'; // Темно-бирюзовый цвет
    } else if (percentage >= 75 && percentage < 100) {
        color = '#4CAF50'; // Зеленый цвет
    } else if (percentage >= 100 && percentage < 150) {
        color = '#FF5722'; // Оранжевый цвет
    } else if (percentage >= 150) {
        color = '#F44336'; // Красный цвет
    }

    return `
        <div class="indicator" style="background-color: ${color};">
            ${percentage}%
        </div>`;
}

// Функция для создания цветного индикатора для токсичных сахаров
function getSugarToxicityIndicator(percentage) {
    let color;

    if (percentage >= 0 && percentage < 25) {
        color = '#4CAF50'; // Зеленый цвет
    } else if (percentage >= 25 && percentage < 50) {
        color = '#FFEB3B'; // Желтый цвет
    } else if (percentage >= 50 && percentage < 100) {
        color = '#FF5722'; // Оранжевый цвет
    } else if (percentage >= 100) {
        color = '#F44336'; // Красный цвет
    }

    return `
        <div class="indicator" style="background-color: ${color};">
            ${percentage}%
        </div>`;
}

// Функция для получения суточной нормы по сахарам
function getSugarRecommendation(sugar) {
    return sugarRecommendations.sugars[sugar] || {};
}

// Добавляем контейнер для сахаров только если они присутствуют в продукте
if (product.sugars && Object.keys(product.sugars).length > 0) {
    const sugarsContainer = document.createElement("div");
    sugarsContainer.classList.add("sugars-container");

    sugarsContainer.innerHTML = `
        <h4>Сахара</h4>
        <table class="sugars-table">
            <thead>
                <tr>
                    <th>Название</th>
                    <th>Значение</th>
                    <th>От РСП</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(product.sugars).map(([sugar, value]) => {
                    if (sugar.endsWith("Units")) {
                        return ''; // Пропускаем поля units
                    }
                    const unitKey = sugar + 'Units';
                    const unit = product.sugars[unitKey] || '';
                    const sugarName = sugarsTranslations[sugar] || sugar;
                    const sugarValue = (value * defaultWeight / 100).toFixed(2);

                    // Получаем рекомендации по сахару
                    const recommendation = getSugarRecommendation(sugar);
                    const recommendedIntake = recommendation.recommendedIntake || Infinity;
                    const recommendedUnit = recommendation.unit || '';

                    // Проверка совпадения единиц измерения
                    if (unit !== recommendedUnit) {
                        console.error(`Несоответствие единиц измерения для ${sugarName}: ${unit} и ${recommendedUnit}`);
                        return '';
                    }

                    // Рассчитываем процент от суточной нормы
                    const percentage = recommendedIntake > 0 ? ((sugarValue / recommendedIntake) * 100).toFixed(2) : '0';

                    // Определяем, использовать ли токсичный индикатор
                    const isToxicSugar = ["sucrose", "fructose", "addedSugars"].includes(sugar);
                    const indicator = isToxicSugar ? getSugarToxicityIndicator(percentage) : getSugarRecommendationIndicator(percentage);

                    // Всплывающая подсказка с рекомендуемым потреблением
                    const tooltip = `Норма: до ${recommendedIntake} ${unit}`;

                    return `
                        <tr>
                            <td>${sugarName}</td>
                            <td>${sugarValue} ${unit}</td>
                            <td title="${tooltip}">${indicator}</td>
                        </tr>`;
                }).join('')}
            </tbody>
        </table>`;

    card.appendChild(sugarsContainer);
}




// Функция для получения суточной нормы фитохимического соединения
function getPhytochemicalRecommendation(phytochemical) {
    return phytochemicalRecommendations.phytochemicals[phytochemical] || {};
}

// Добавляем контейнер для фитохимических соединений только если они есть
if (product.phytochemicals && Object.keys(product.phytochemicals).length > 0) {
    const phytochemicalsContainer = document.createElement("div");
    phytochemicalsContainer.classList.add("phytochemicals-container");

    phytochemicalsContainer.innerHTML = `
        <h4>Фитохимические соединения</h4>
        <table class="phytochemicals-table">
            <thead>
                <tr>
                    <th>Название</th>
                    <th>Значение</th>
                    <th>От РСП</th>
                </tr>
            </thead>
            <tbody>
                ${Object.entries(product.phytochemicals).map(([phytochemical, value]) => {
                    if (phytochemical.endsWith("Units")) {
                        return ''; // Пропускаем поля Units
                    }
                    const unitKey = phytochemical + 'Units';
                    const unit = product.phytochemicals[unitKey] || '';
                    const phytochemicalName = phytochemicalTranslations[phytochemical] || phytochemical;
                    const phytochemicalValue = (value * defaultWeight / 100).toFixed(2);

                    // Получаем рекомендации по фитохимическому соединению
                    const recommendation = getPhytochemicalRecommendation(phytochemical);
                    const upperBound = recommendation.recommendedIntake || Infinity;
                    const recommendedUnit = recommendation.unit || '';

                    // Проверка совпадения единиц измерения
                    if (unit !== recommendedUnit) {
                        console.error(`Несоответствие единиц измерения для ${phytochemicalName}: ${unit} и ${recommendedUnit}`);
                        return '';
                    }

                    // Рассчитываем процент от суточной нормы
                    const percentage = upperBound > 0 ? ((phytochemicalValue / upperBound) * 100).toFixed(2) : '0';

                    // Всплывающая подсказка с диапазоном нормы
                    const tooltip = `Норма: 0 - ${upperBound} ${recommendedUnit}`;

                    return `
                        <tr>
                            <td>${phytochemicalName}</td>
                            <td>${phytochemicalValue} ${unit}</td>
                            <td title="${tooltip}">${getRecommendationIndicator(percentage)}</td>
                        </tr>`;
                }).join('')}
            </tbody>
        </table>`;

    card.appendChild(phytochemicalsContainer);
}



















    productsDiv.appendChild(card);

    const weightInput = card.querySelector(".product-weight");
    const methodSelect = card.querySelector(".processing-method");
    const servingSizeSelect = card.querySelector(".serving-size");
    const servingAmountInput = card.querySelector(".serving-amount");
    const waterInfo = card.querySelector(".water-info");
    const fiberInfo = card.querySelector(".fiber-info");
    const rawInfo = card.querySelector(".raw-info");

    // Установка метода обработки в select
    if (product.processingMethod) {
        const methodOption = methodSelect.querySelector(`option[value="${product.processingMethod}"]`);
        if (methodOption) {
            methodSelect.value = product.processingMethod;
        }
        
        
    }


    // Обновление отображения элемента Vegan
function updateVeganInfo() {
    const veganInfo = card.querySelector('.vegan-info');
    if (product.vegan) {
        veganInfo.style.display = 'block'; // Показываем Vegan индикатор
    } else {
        veganInfo.style.display = 'none'; // Скрываем Vegan индикатор
    }
}

    
    // Обновление отображения элемента RAW
function updateRawInfo() {
    const method = methodSelect.value;
    const rawInfo = card.querySelector('.raw-info');
    if (product.RawFood === true) {
        if (method === 'Отсутствует' || method === 'Резка') {
            rawInfo.style.display = 'block'; // Показываем RAW
        } else {
            rawInfo.style.display = 'none'; // Скрываем RAW
        }
    } else {
        rawInfo.style.display = 'none'; // Скрываем RAW
    }
}

    let editableWeight = null; // Переменная для хранения редактируемого веса для типа 'шт.'
    let defaultProductWeight = null; // Переменная для хранения веса продукта по умолчанию
    let weightRestored = false; // Флаг для отслеживания, был ли восстановлен вес
    let isUnitType = false; // Флаг для проверки, что тип порции 'шт.'
    
    // Функция для обновления информации о питательных веществах
    function updateNutritionalInfo() {
        const selectedServing = servingSizeSelect.value; // Получаем выбранный тип порции
        const servingsAmount = parseFloat(servingAmountInput.value) || 1; // По умолчанию 1 порция
    
        let servingWeight = 0;
    
        console.log("Selected Serving:", selectedServing); // Отладка
        console.log("Product Servings:", product.servings); // Отладка
    
        if (selectedServing === 'шт.') {
            isUnitType = true;
    
            // Если вес ещё не был восстановлен после первого переключения на 'шт.'
            if (!weightRestored) {
                editableWeight = product.servings['шт.'] || product.weightDefault || defaultWeight;
                weightInput.value = editableWeight; // Устанавливаем значение в поле ввода веса
                weightRestored = true; // Помечаем, что вес восстановлен
            } else {
                // Если вес уже был восстановлен ранее, используем текущее значение поля ввода
                editableWeight = parseFloat(weightInput.value) || product.servings['шт.'];
            }
    
            console.log("Editable Weight for 'шт.':", editableWeight); // Отладка
    
            servingWeight = editableWeight; // Присваиваем значение в servingWeight
    
            if (servingAmountInput.value < 1) {
                // Устанавливаем порцию на 1 при выборе 'шт.'
                servingAmountInput.value = 1;
            }
        } else {
            isUnitType = false;
            weightRestored = false; // Сбрасываем флаг при переключении на другой тип порции
    
            // Используем вес из списка порций для других типов порций
            servingWeight = product.servings[selectedServing] || defaultWeight;
    
            // Обновляем weightInput только если тип порции не 'шт.'
            weightInput.value = servingWeight;
    
            // Сбрасываем editableWeight при смене типа порции
            editableWeight = null;
        }
    
        console.log("Final Serving Weight:", servingWeight); // Отладка
    
        // Итоговый вес с учетом количества порций
        const weight = servingWeight * servingsAmount;
        const method = methodSelect.value;
        const factor = processingMethods[method] || 1; // Дефолтный фактор 1, если метод не выбран
    
        // Обновляем нутриенты
        card.querySelector(".calories-info").textContent = (product.calories * weight / 100 * factor).toFixed(2);
        card.querySelector(".protein-info").textContent = (product.protein * weight / 100 * factor).toFixed(2);
        card.querySelector(".carbs-info").textContent = (product.carbs * weight / 100 * factor).toFixed(2);
        card.querySelector(".fats-info").textContent = (product.fats * weight / 100 * factor).toFixed(2);
        card.querySelector(".fiber-info").textContent = (product.fiberContent * weight / 100 * factor).toFixed(2);
        card.querySelector(".water-info").textContent = (product.waterContent * weight / 100 * factor).toFixed(2);


         let ChartProtein = product.protein * weight / 100 * factor;
         let ChartFats = product.fats * weight / 100 * factor;
         let ChartCarbs = product.carbs * weight / 100 * factor;
        

         function drawBJUChart(ChartProtein, ChartFats, ChartCarbs) {
            // Проверяем, существуют ли белки, жиры и углеводы и контейнер для графика
            const hasNutrients = ChartProtein > 0 || ChartFats > 0 || ChartCarbs > 0;
            const chartContainer = document.getElementById('bjuChart2');
            
            // Если нет белков, жиров, углеводов или контейнер не найден, не выполняем функцию
            if (!hasNutrients || !chartContainer) return;
        
            const total = ChartProtein + ChartFats + ChartCarbs;
        
            // Вычисляем проценты
            const proteinPercent = (ChartProtein / total) * 100;
            const fatsPercent = (ChartFats / total) * 100;
            const carbsPercent = (ChartCarbs / total) * 100;
        
            // Вычисляем углы для conic-gradient
            const proteinAngle = proteinPercent * 3.6;
            const fatsAngle = fatsPercent * 3.6;
            const carbsAngle = carbsPercent * 3.6;
        
            console.log('Protein Angle:', proteinAngle);
            console.log('Fats Angle:', fatsAngle);
            console.log('Carbs Angle:', carbsAngle);
        
            // Применяем градиент к диаграмме
            chartContainer.style.background = `conic-gradient(
                #4CAF50 0% ${proteinAngle}deg, 
                #FFEB3B ${proteinAngle}deg ${proteinAngle + fatsAngle}deg, 
                #F44336 ${proteinAngle + fatsAngle}deg 360deg
            )`;
        
            // Обновляем значения в легенде
            document.getElementById('proteinGrams').textContent = ChartProtein.toFixed(2);
            document.getElementById('proteinPercent').textContent = proteinPercent.toFixed(2);
            document.getElementById('fatsGrams').textContent = ChartFats.toFixed(2);
            document.getElementById('fatsPercent').textContent = fatsPercent.toFixed(2);
            document.getElementById('carbsGrams').textContent = ChartCarbs.toFixed(2);
            document.getElementById('carbsPercent').textContent = carbsPercent.toFixed(2);
        }
        
        
        drawBJUChart(ChartProtein, ChartFats, ChartCarbs);
        
        
        







        
    
        // Обновление информации о витаминах с учётом процентов от суточной нормы
// Обновление информации о витаминах с учётом процентов от суточной нормы
function updateVitaminInfo() {
    const vitaminsContainer = card.querySelector(".vitamins-container");
    if (vitaminsContainer) {
        const weight = servingWeight * servingsAmount;
        const factor = processingMethods[methodSelect.value] || 1; // Дефолтный фактор 1, если метод не выбран

        vitaminsContainer.innerHTML = `
            <h4>Витамины</h4>
            <table class="vitamins-table">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Значение</th>
                        <th>От РСП</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(product.vitamins).map(([vitamin, value]) => {
                        if (vitamin.endsWith("units")) {
                            return ''; // Пропускаем поля units
                        }
                        const unitKey = vitamin + 'units';
                        const unit = product.vitamins[unitKey] || '';
                        const vitaminName = vitaminTranslations[vitamin] || vitamin;
                        const vitaminValue = (value * weight / 100 * factor).toFixed(2);
                        
                        // Получаем рекомендации по витамину
                        const recommendation = getVitaminRecommendation(vitamin);
                        const lowerBound = recommendation.lowerBound || 0;
                        const upperBound = recommendation.upperBound || Infinity;
                        
                        // Рассчитываем процент от суточной нормы по верхней границе
                        const percentage = upperBound > 0 ? ((vitaminValue / upperBound) * 100).toFixed(2) : '0';
                        
                        // Всплывающая подсказка с нижней и верхней границей нормы
                        const tooltip = `Норма: ${lowerBound}-${upperBound} ${unit}`;

                        return `
                            <tr>
                                <td>${vitaminName}</td>
                                <td>${vitaminValue} ${unit}</td>
                                <td title="${tooltip}">${getRecommendationIndicator(percentage)}</td>
                            </tr>`;
                    }).join('')}
                </tbody>
            </table>`;
    }
}

// Вызов функции для обновления информации о витаминах
updateVitaminInfo();

// Обновление информации о минералах с учётом процентов от суточной нормы
function updateMineralInfo(weight, factor) {
    const mineralsContainer = card.querySelector(".minerals-container");
    if (mineralsContainer) {
        const essentialMineralsRows = [];
        const toxicMineralsRows = [];

        Object.entries(product.minerals).forEach(([mineral, value]) => {
            if (mineral.endsWith("Units")) {
                return; // Пропускаем поля units
            }

            const unitKey = mineral + 'Units';
            const unit = product.minerals[unitKey] || '';
            const mineralName = mineralTranslations[mineral] || mineral;
            const mineralValue = (value * weight / 100 * factor).toFixed(2);

            // Если значение минерала не является числом
            if (isNaN(mineralValue)) {
                console.error(`Ошибка: mineralValue для ${mineralName} NaN`);
                return '';
            }

            // Получаем рекомендации по минералу
            const recommendation = getMineralRecommendation(mineral);
            const lowerBound = recommendation.lowerBound || 0;
            const upperBound = recommendation.upperBound || Infinity;
            const recommendedUnit = recommendation.unit || '';
            const effect = recommendation.effect || 'неизвестный';

            // Проверка совпадения единиц измерения
            if (unit !== recommendedUnit) {
                console.error(`Несоответствие единиц измерения для ${mineralName}: ${unit} и ${recommendedUnit}`);
                return '';
            }

            // Рассчитываем процент от суточной нормы по верхней границе
            const percentage = upperBound > 0 ? ((mineralValue / upperBound) * 100).toFixed(2) : '0';

            // Проверка на NaN в проценте
            if (isNaN(percentage)) {
                console.error(`Ошибка: percentage для ${mineralName} NaN`);
                return '';
            }

            // Всплывающая подсказка с нижней и верхней границей нормы
            const tooltip = `Норма: ${lowerBound}-${upperBound} ${unit}`;

            // Добавляем строку в соответствующий массив
            if (effect === 'эссенциальный') {
                essentialMineralsRows.push(`
                    <tr>
                        <td>${mineralName}</td>
                        <td>${mineralValue} ${unit}</td>
                        <td title="${tooltip}">${getRecommendationIndicator(percentage)}</td>
                    </tr>`);
            } else if (effect === 'токсичный') {
                toxicMineralsRows.push(`
                    <tr>
                        <td>${mineralName}</td>
                        <td>${mineralValue} ${unit}</td>
                        <td title="${tooltip}">${getRecommendationIndicator(percentage)}</td>
                    </tr>`);
            }
        });

        // Обновляем контейнер с новыми таблицами
        mineralsContainer.innerHTML = `
            <h4>Эссенциальные минералы</h4>
            <table class="minerals-table">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Значение</th>
                        <th>От РСП</th>
                    </tr>
                </thead>
                <tbody>
                    ${essentialMineralsRows.join('')}
                </tbody>
            </table>`;

        if (toxicMineralsRows.length > 0) {
            mineralsContainer.innerHTML += `
                <h4 class ="h-toxic">Токсичные минералы</h4>
                <table class="minerals-table">
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Значение</th>
                            <th>От РСП</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${toxicMineralsRows.join('')}
                    </tbody>
                </table>`;
        }
    }
}

// Вызов функции для обновления информации о минералах
updateMineralInfo(servingWeight * servingsAmount, processingMethods[methodSelect.value] || 1);



// Проверяем наличие натрия и калия в продукте
if (product.minerals && product.minerals.sodium && product.minerals.potassium) {
    // Рассчитываем вес и фактор
    const weight = servingWeight * servingsAmount;
    const factor = processingMethods[methodSelect.value] || 1; // Дефолтный фактор 1, если метод не выбран
    
    // Рассчитываем значения натрия и калия с учетом веса и фактора
    const sodium = (product.minerals.sodium * weight / 100 * factor).toFixed(2);
    const potassium = (product.minerals.potassium * weight / 100 * factor).toFixed(2);
    const sodiumUnits = product.minerals.sodiumUnits || 'mg';
    const potassiumUnits = product.minerals.potassiumUnits || 'mg';
    
    // Создаем виджет баланса натрия и калия
    const balanceWidget = createSodiumPotassiumBalanceWidget(sodium, sodiumUnits, potassium, potassiumUnits);

    // Проверяем, существует ли уже контейнер
    const existingWidget = card.querySelector('.balance-widget-NK');
    if (existingWidget) {
        // Если контейнер уже существует, обновляем его содержимое
        existingWidget.innerHTML = balanceWidget;
    } else {
        // Если контейнера нет, добавляем новый
        card.insertAdjacentHTML('beforeend', balanceWidget);
    }
}

// Функция для обновления виджета баланса натрия и калия
function updateSodiumPotassiumBalanceWidget() {
    const balanceWidget = card.querySelector(".balance-widget-NK");
    if (balanceWidget) {
        // Рассчитываем вес и фактор
        const weight = servingWeight * servingsAmount;
        const factor = processingMethods[methodSelect.value] || 1; // Дефолтный фактор 1, если метод не выбран
        
        // Получаем значения натрия и калия из продукта
        const sodium = (product.minerals.sodium * weight / 100 * factor).toFixed(2);
        const potassium = (product.minerals.potassium * weight / 100 * factor).toFixed(2);
        const sodiumUnit = product.minerals.sodiumUnits || 'mg';
        const potassiumUnit = product.minerals.potassiumUnits || 'mg';

        // Рассчитываем соотношение натрия к калию
        const sodiumPotassiumRatio = potassium > 0 ? (sodium / potassium).toFixed(2) : 0;
        let ratioCategory = '';
        let ratioColor = '';
        let ratioText = '';
        let ratioDescription = '';

        // Определяем категорию соотношения и описание на основе соотношения
        if (sodiumPotassiumRatio < 0.5) {
            ratioCategory = 'низкое';
            ratioColor = '#F44336';
            ratioText = '▲ Гиперкалиемия';
            ratioDescription = 'Высокий уровень калия в продукте (по отношению к натрию) может негативно повлиять на здоровье. Избыточное количество калия может нарушить функции сердца, вызывая аритмии и другие сердечные проблемы. Также может затрудниться работа почек, что приведет к накоплению калия и ухудшению общего состояния организма. Рекомендуется следить за потреблением калия и при необходимости проконсультироваться с врачом.';
        } else if (sodiumPotassiumRatio >= 0.5 && sodiumPotassiumRatio <= 1.5) {
            ratioCategory = 'оптимальное';
            ratioColor = '#4CAF50';
            ratioText = 'Норма';
            ratioDescription = 'Этот уровень калия и натрия в продукте считается оптимальным для поддержания здоровья. Он способствует нормальному функционированию организма и поддерживает энергетический баланс.';
        } else {
            ratioCategory = 'высокое';
            ratioColor = '#F44336';
            ratioText = '▲ Гипернатриемия';
            ratioDescription = 'Высокий уровень натрия в продукте (по отношению к калию) может повышать риск высокого кровяного давления, что в свою очередь увеличивает вероятность сердечно-сосудистых заболеваний. Также это может способствовать задержке жидкости в организме и проблемам с почками. Рекомендуется следить за потреблением натрия для поддержания общего здоровья.';
        }

        // Рассчитываем относительную ширину полосок
        const sodiumWidth = sodiumPotassiumRatio >= 1 ? 100 : (sodiumPotassiumRatio * 100);
        const potassiumWidth = sodiumPotassiumRatio <= 1 ? 100 : (100 / sodiumPotassiumRatio);

        // Обновляем HTML структуры виджета
        balanceWidget.innerHTML = `
            <h4 class="balance-title-NK">Баланс Натрия и Калия</h4>
            <div class="balance-bars-container-NK">
                <div class="balance-bar-NK sodium-bar-NK" style="background-color: #1961a8; width: ${sodiumWidth}%;">
                </div>
                <div class="balance-bar-NK potassium-bar-NK" style="background-color: #4CAF50; width: ${potassiumWidth}%;">
                </div>
            </div>
            
            <div class="buttons-container-NK">
                <button class="mineral-button-NK sodium-button-NK" style="background-color: #1961a8;">
                    Натрий: ${sodium} ${sodiumUnit}
                </button>
                <button class="mineral-button-NK potassium-button-NK" style="background-color: #4CAF50;">
                    Калий: ${potassium} ${potassiumUnit}
                </button>
            </div>
            <div class="ratio-NK">
                <span class ="NK-ratios-header-bottom">Соотношение: ${sodiumPotassiumRatio}:1</span>
                <div class="ratio-indicator-NK" style="background-color: ${ratioColor};">
                    <span>${ratioText}</span>
                    <div class="tooltip-NK">
                        <div class="tooltip-norm-NK">Норма: 0.5-1.5</div>
                        <div class="tooltip-description-NK"><em>${ratioDescription}</em></div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Вызов функции для обновления виджета баланса натрия и калия
updateSodiumPotassiumBalanceWidget();





    // Обновление информации о незаменимых аминокислотах с учётом процентов от суточной нормы
function updateAminoAcidInfo(weight, factor) {
    const aminoAcidsContainer = card.querySelector(".amino-acids-container");
    if (aminoAcidsContainer) {
        aminoAcidsContainer.innerHTML = `
            <h4>Незаменимые аминокислоты</h4>
            <table class="amino-acids-table">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Значение</th>
                        <th>От РСП</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(product.essentialAminoAcids).map(([aminoAcid, value]) => {
                        if (aminoAcid.endsWith("Units")) {
                            return ''; // Пропускаем поля units
                        }
                        const unitKey = aminoAcid + 'Units';
                        const unit = product.essentialAminoAcids[unitKey] || '';
                        const aminoAcidName = essentialAminoAcidsTranslations[aminoAcid] || aminoAcid;
                        const aminoAcidValue = (value * weight / 100 * factor).toFixed(2);

                        // Если значение аминокислоты не является числом
                        if (isNaN(aminoAcidValue)) {
                            console.error(`Ошибка: aminoAcidValue для ${aminoAcidName} NaN`);
                            return '';
                        }

                        // Получаем рекомендации по аминокислоте
                        const recommendation = getAminoAcidRecommendation(aminoAcid);
                        const lowerBound = recommendation.lowerBound || 0;
                        const upperBound = recommendation.upperBound || Infinity;
                        const recommendedUnit = recommendation.unit || '';

                        // Проверка совпадения единиц измерения
                        if (unit !== recommendedUnit) {
                            console.error(`Несоответствие единиц измерения для ${aminoAcidName}: ${unit} и ${recommendedUnit}`);
                            return '';
                        }

                        // Рассчитываем процент от суточной нормы по верхней границе
                        const percentage = upperBound > 0 ? ((aminoAcidValue / upperBound) * 100).toFixed(2) : '0';

                        // Проверка на NaN в проценте
                        if (isNaN(percentage)) {
                            console.error(`Ошибка: percentage для ${aminoAcidName} NaN`);
                            return '';
                        }

                        // Всплывающая подсказка с нижней и верхней границей нормы
                        const tooltip = `Норма: ${lowerBound}-${upperBound} ${unit}`;

                        return `
                            <tr>
                                <td>${aminoAcidName}</td>
                                <td>${aminoAcidValue} ${unit}</td>
                                <td title="${tooltip}">${getRecommendationIndicator(percentage)}</td>
                            </tr>`;
                    }).join('')}
                </tbody>
            </table>`;
    }
}

// Вызов функции для обновления информации о незаменимых аминокислотах
updateAminoAcidInfo(servingWeight * servingsAmount, processingMethods[methodSelect.value] || 1);




    // Обновление информации о жирах с учётом процентов от суточной нормы
function updateFatInfo(weight, factor) {
    const fatsContainer = card.querySelector(".fats-container");
    if (fatsContainer) {
        fatsContainer.innerHTML = `
            <h4>Жиры</h4>
            <table class="fats-table">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Значение</th>
                        <th>От РСП</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(product.fattyAcidsAndCholesterol).map(([fat, value]) => {
                        if (fat.endsWith("Units")) {
                            return ''; // Пропускаем поля units
                        }
                        const unitKey = fat + 'Units';
                        const unit = product.fattyAcidsAndCholesterol[unitKey] || '';
                        const fatName = fattyAcidsAndCholesterolTranslations[fat] || fat;
                        const fatValue = (value * weight / 100 * factor).toFixed(2);

                        // Если значение жира не является числом
                        if (isNaN(fatValue)) {
                            console.error(`Ошибка: fatValue для ${fatName} NaN`);
                            return '';
                        }

                        // Получаем рекомендации по жирам
                        const recommendation = getFatRecommendation(fat);
                        const lowerBound = recommendation.lowerBound || 0;
                        const upperBound = recommendation.upperBound || Infinity;
                        const recommendedUnit = recommendation.unit || '';

                        // Проверка совпадения единиц измерения
                        if (unit !== recommendedUnit) {
                            console.error(`Несоответствие единиц измерения для ${fatName}: ${unit} и ${recommendedUnit}`);
                            return '';
                        }

                        // Рассчитываем процент от суточной нормы по верхней границе
                        const percentage = upperBound > 0 ? ((fatValue / upperBound) * 100).toFixed(2) : '0';

                        // Проверка на NaN в проценте
                        if (isNaN(percentage)) {
                            console.error(`Ошибка: percentage для ${fatName} NaN`);
                            return '';
                        }

                        // Всплывающая подсказка с нижней и верхней границей нормы
                        const tooltip = `Норма: ${lowerBound}-${upperBound} ${unit}`;

                        return `
                            <tr>
                                <td>${fatName}</td>
                                <td>${fatValue} ${unit}</td>
                                <td title="${tooltip}">${getRecommendationIndicator(percentage)}</td>
                            </tr>`;
                    }).join('')}
                </tbody>
            </table>`;
    }
}

// Вызов функции для обновления информации о жирах
updateFatInfo(servingWeight * servingsAmount, processingMethods[methodSelect.value] || 1);

// Обновление информации о сахарах с учётом процентов от суточной нормы
function updateSugarInfo() {
    const sugarsContainer = card.querySelector(".sugars-container");
    if (sugarsContainer) {
        const weight = servingWeight * servingsAmount;
        const factor = processingMethods[methodSelect.value] || 1; // Дефолтный фактор 1, если метод не выбран

        sugarsContainer.innerHTML = `
            <h4>Сахара</h4>
            <table class="sugars-table">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Значение</th>
                        <th>От РСП</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(product.sugars).map(([sugar, value]) => {
                        if (sugar.endsWith("Units")) {
                            return ''; // Пропускаем поля units
                        }
                        const unitKey = sugar + 'Units';
                        const unit = product.sugars[unitKey] || '';
                        const sugarName = sugarsTranslations[sugar] || sugar;
                        const sugarValue = (value * weight / 100 * factor).toFixed(2);

                        // Проверяем корректность значения сахара
                        if (isNaN(sugarValue)) {
                            console.error(`Ошибка: sugarValue для ${sugarName} NaN`);
                            return '';
                        }

                        // Получаем рекомендации по сахару
                        const recommendation = getSugarRecommendation(sugar);
                        const recommendedIntake = recommendation.recommendedIntake || Infinity;
                        const recommendedUnit = recommendation.unit || '';

                        // Проверяем совпадение единиц измерения
                        if (unit !== recommendedUnit) {
                            console.error(`Несоответствие единиц измерения для ${sugarName}: ${unit} и ${recommendedUnit}`);
                            return '';
                        }

                        // Рассчитываем процент от суточной нормы
                        const percentage = recommendedIntake > 0 ? ((sugarValue / recommendedIntake) * 100).toFixed(2) : '0';

                        // Проверяем корректность процента
                        if (isNaN(percentage)) {
                            console.error(`Ошибка: percentage для ${sugarName} NaN`);
                            return '';
                        }

                        // Определяем, использовать ли токсичный индикатор
                        const isToxicSugar = ["sucrose", "fructose", "addedSugars"].includes(sugar);
                        const indicator = isToxicSugar ? getSugarToxicityIndicator(percentage) : getSugarRecommendationIndicator(percentage);

                        // Всплывающая подсказка с рекомендуемым потреблением
                        const tooltip = `Норма: до ${recommendedIntake} ${unit}`;

                        return `
                            <tr>
                                <td>${sugarName}</td>
                                <td>${sugarValue} ${unit}</td>
                                <td title="${tooltip}">${indicator}</td>
                            </tr>`;
                    }).join('')}
                </tbody>
            </table>`;
    }
}

// Вызов функции для обновления информации о сахарах
updateSugarInfo();



// Функция для обновления информации о фитохимических соединениях с учётом процентов от суточной нормы
function updatePhytochemicalInfo() {
    const phytochemicalsContainer = card.querySelector(".phytochemicals-container");
    if (phytochemicalsContainer) {
        const weight = servingWeight * servingsAmount;
        const factor = processingMethods[methodSelect.value] || 1; // Дефолтный фактор 1, если метод не выбран

        phytochemicalsContainer.innerHTML = `
            <h4>Фитохимические соединения</h4>
            <table class="phytochemicals-table">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Значение</th>
                        <th>От РСП</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(product.phytochemicals).map(([phytochemical, value]) => {
                        if (phytochemical.endsWith("Units")) {
                            return ''; // Пропускаем поля Units
                        }
                        const unitKey = phytochemical + 'Units';
                        const unit = product.phytochemicals[unitKey] || '';
                        const phytochemicalName = phytochemicalTranslations[phytochemical] || phytochemical;
                        const phytochemicalValue = (value * weight / 100 * factor).toFixed(2);

                        // Получаем рекомендации по фитохимическому соединению
                        const recommendation = getPhytochemicalRecommendation(phytochemical);
                        const upperBound = recommendation.recommendedIntake || Infinity;
                        const recommendedUnit = recommendation.unit || '';

                        // Проверка совпадения единиц измерения
                        if (unit !== recommendedUnit) {
                            console.error(`Несоответствие единиц измерения для ${phytochemicalName}: ${unit} и ${recommendedUnit}`);
                            return '';
                        }

                        // Рассчитываем процент от суточной нормы
                        const percentage = upperBound > 0 ? ((phytochemicalValue / upperBound) * 100).toFixed(2) : '0';

                        // Всплывающая подсказка с диапазоном нормы
                        const tooltip = `Норма: 0 - ${upperBound} ${recommendedUnit}`;

                        return `
                            <tr>
                                <td>${phytochemicalName}</td>
                                <td>${phytochemicalValue} ${unit}</td>
                                <td title="${tooltip}">${getRecommendationIndicator(percentage)}</td>
                            </tr>`;
                    }).join('')}
                </tbody>
            </table>`;
    }
}

// Вызов функции для обновления информации о фитохимических соединениях
updatePhytochemicalInfo();













        updateVeganInfo() // Обновляем отображение Vegan
        updateRawInfo(); // Обновляем отображение RAW
    
        // Обновляем отображение ГИ
        const methodIndex = Object.keys(processingMethods).indexOf(method);
        updateGlycemicIndexDisplay(methodIndex, product, card);

        updateORPDisplay(product, card); // Обновление ОВП-индикатора
        // Обновление отображения pH
        updatePHDisplay(product, card);
    
        // Обновляем опции порций
        updateServingsOptions(editableWeight);
    }
    
    
    
    
    
    



    

   

    
    

    

    

    
    

    
    weightInput.addEventListener('input', () => {
        updateNutritionalInfo(); // Пересчитываем нутриенты при изменении веса
    });
    methodSelect.addEventListener("change", updateNutritionalInfo);
    servingAmountInput.addEventListener('input', updateNutritionalInfo);
    servingSizeSelect.addEventListener('change', updateNutritionalInfo);
    updateNutritionalInfo(); // Первоначальное обновление информации

    const addToMealButton = card.querySelector(".add-to-meal");
    addToMealButton.addEventListener("click", function() {
        const servingSize = card.querySelector(".serving-size").value;
        const servingAmount = parseFloat(card.querySelector(".serving-amount").value);
        const mealTime = card.querySelector(".meal-time").value;
        const productWeight = parseFloat(weightInput.value) || defaultWeight;

        if (!mealTime) {
            alert("Выберите прием пищи");
            return;
        }

        const servingWeight = servingSize === 'шт.' ? productWeight : product.servings[servingSize];
        const weight = servingAmount * servingWeight;

        const method = methodSelect.value;
        const factor = processingMethods[method] || 1; // Дефолтный фактор 1, если метод не выбран

        const caloriesPerServing = (product.calories * weight / 100 * factor);
        const proteinPerServing = (product.protein * weight / 100 * factor);
        const carbsPerServing = (product.carbs * weight / 100 * factor);
        const fatsPerServing = (product.fats * weight / 100 * factor);
        const waterPerServing = (product.waterContent * weight / 100 * factor);
        const fiberPerServing = (product.fiberContent * weight / 100 * factor);

        const productEntry = {
            name: product.name,
            weight: weight,
            servingSize: servingSize,
            servingAmount: servingAmount,
            calories: caloriesPerServing,
            protein: proteinPerServing,
            carbs: carbsPerServing,
            fats: fatsPerServing,
            fiber: fiberPerServing,
            water: waterPerServing
        };

        if (!mealData[mealTime]) {
            mealData[mealTime] = [];
        }
        mealData[mealTime].push(productEntry);

        updateMealSummary(mealTime, productEntry);
        updateMealTotal(mealTime);
        updateDailySummary();
        
        
        saveMealData();
        
        
        saveScrollPosition(); // Сохранение позиции прокрутки
    location.reload();   // Перезагрузка страницы
    });
}

function saveScrollPosition() {
    localStorage.setItem('scrollPosition', window.scrollY);
}

     // Обновление сводной информации по приему пищи
     // Функция для обновления сводной информации по приему пищи
function updateMealSummary(meal, productEntry) {
    const mealProductsDiv = document.getElementById(`${meal}-products`);

    // Проверяем, нужно ли добавить заголовок таблицы
    if (mealProductsDiv.innerHTML.trim() === '') {
        mealProductsDiv.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Продукт</th>
                        <th>Количество</th>
                        <th>Калории</th>
                        <th>Белки</th>
                        <th>Жиры</th>
                        <th>Углеводы</th>
                        <th>Клетчатка</th>
                        <th>Вода</th>
                        <th>Управление</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        `;

        
    }

    // Добавляем запись о продукте в таблицу
    const tableBody = mealProductsDiv.querySelector('tbody');
    const productRow = document.createElement("tr");
    productRow.classList.add("draggable");
    productRow.draggable = true;
    productRow.dataset.index = mealData[meal].indexOf(productEntry); // Устанавливаем индекс
    productRow.innerHTML = `
        <td>${productEntry.name}</td>
        <td>${productEntry.servingAmount} ${productEntry.servingSize} [${productEntry.weight.toFixed(2)} г]</td>
        <td>${productEntry.calories.toFixed(2)} ккал</td>
        <td>${productEntry.protein.toFixed(2)} г</td>
        <td>${productEntry.fats.toFixed(2)} г</td>
        <td>${productEntry.carbs.toFixed(2)} г</td>
        <td>${productEntry.fiber.toFixed(2)} г</td>
        <td>${productEntry.water.toFixed(2)} мл</td>
        <td><span class="remove-btn">X</span></td>
    `;
    tableBody.appendChild(productRow);

    // Добавляем обработчик для удаления продукта
    productRow.querySelector('.remove-btn').addEventListener('click', () => {
        const index = mealData[meal].indexOf(productEntry);
        if (index > -1) {
            mealData[meal].splice(index, 1); // Удаление элемента из mealData
        }
        tableBody.removeChild(productRow); // Удаление строки из таблицы
        
        // Обновление сводной информации
        mealTotals[meal].calories -= productEntry.calories;
        mealTotals[meal].protein -= productEntry.protein;
        mealTotals[meal].carbs -= productEntry.carbs;
        mealTotals[meal].fats -= productEntry.fats;
        mealTotals[meal].fiber -= productEntry.fiber;
        mealTotals[meal].water -= productEntry.water;
        mealTotals[meal].grams -= productEntry.weight;
        
        updateMealTotal(meal);
        updateDailySummary();
        

        
        
        
        saveMealData(); // Немедленное обновление локального хранилища
        saveProfileData();
        
        
        calculateNutrientNorms(Globalweight);
        
        
    });

    // Добавляем обработчики для перетаскивания
    productRow.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', productRow.dataset.index);
    });

    productRow.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    productRow.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggedIndex = e.dataTransfer.getData('text/plain');
        const targetIndex = productRow.dataset.index;
        if (draggedIndex !== targetIndex) {
            const draggedRow = tableBody.querySelector(`[data-index='${draggedIndex}']`);
            if (draggedRow && draggedRow !== productRow) {
                tableBody.insertBefore(draggedRow, productRow);
                updateMealDataOrder(meal, parseInt(draggedIndex), parseInt(targetIndex));
            }
        }
    });

    mealTotals[meal].calories += productEntry.calories;
    mealTotals[meal].protein += productEntry.protein;
    mealTotals[meal].carbs += productEntry.carbs;
    mealTotals[meal].fats += productEntry.fats;
    mealTotals[meal].fiber += productEntry.fiber;
    mealTotals[meal].water += productEntry.water;
    mealTotals[meal].grams += productEntry.weight;

    updateMealTotal(meal);
    
}

    
    

    

    // Обновление итоговой строки для приема пищи
    function updateMealTotal(meal) {
        const mealTotalEl = document.getElementById(`${meal}-total`);
        mealTotalEl.innerHTML = `
            <table>
            <thead>
                <tr>
                    <th>Итог:</th>
                    <th>${mealTotals[meal].grams.toFixed(2)} г</th>
                    <th>${mealTotals[meal].calories.toFixed(2)} ккал</th>
                    <th>${mealTotals[meal].protein.toFixed(2)} г</th>
                    <th>${mealTotals[meal].fats.toFixed(2)} г</th>
                    <th>${mealTotals[meal].carbs.toFixed(2)} г</th>
                    <th>${mealTotals[meal].fiber.toFixed(2)} г</th>
                    <th>${mealTotals[meal].water.toFixed(2)} мл</th>
                    <th>
                        <button class="copy-meal-btn" data-meal="${meal}">▶</button>
                    </th>
                </tr>
            </thead>
        </table>
    `;

        // Добавляем обработчик для кнопки копирования
    mealTotalEl.querySelector('.copy-meal-btn').addEventListener('click', (e) => {
        const mealType = e.target.dataset.meal;
        openCalendar(mealType);
    });

   

    

    

    }

     // Обновление общей информации за день
    function updateDailySummary() {
        const dailyCaloriesEl = document.getElementById("daily-calories");
        const dailyProteinEl = document.getElementById("daily-protein");
        const dailyCarbsEl = document.getElementById("daily-carbs");
        const dailyFatsEl = document.getElementById("daily-fats");
        const dailyWaterEl = document.getElementById("daily-water");
        const dailyFiberEl = document.getElementById("daily-fiber");

        const totalCalories = Object.values(mealTotals).reduce((sum, meal) => sum + meal.calories, 0);
        const totalProtein = Object.values(mealTotals).reduce((sum, meal) => sum + meal.protein, 0);
        const totalCarbs = Object.values(mealTotals).reduce((sum, meal) => sum + meal.carbs, 0);
        const totalFats = Object.values(mealTotals).reduce((sum, meal) => sum + meal.fats, 0);
        const totalFiber = Object.values(mealTotals).reduce((sum, meal) => sum + meal.fiber, 0);
        const totalWater = Object.values(mealTotals).reduce((sum, meal) => sum + meal.water, 0);

        


        

        dailyCaloriesEl.textContent = totalCalories.toFixed(2);
        dailyProteinEl.textContent = totalProtein.toFixed(2);
        dailyCarbsEl.textContent = totalCarbs.toFixed(2);
        dailyFatsEl.textContent = totalFats.toFixed(2);
        dailyFiberEl.textContent = totalFiber.toFixed(2);
        dailyWaterEl.textContent = totalWater.toFixed(2);

        

        saveProfileData();
        
    }

    

    // Инициализация текущей даты
    updateDateDisplay();
    loadMealData();
    
    
    
});
