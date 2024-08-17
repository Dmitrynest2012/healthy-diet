

document.addEventListener("DOMContentLoaded", function() {

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
    button.innerHTML = '&#9650;';
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

            // Обновление текста элемента с дневными калориями
            dailyCaloriesElement.nextSibling.textContent = ` ккал / Норма: ${globalBMR} ккал [${GlobalpercentageBMR}% от нормы]`;
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
    
}

    globalBMR = localStorage.getItem('globalBMR') ? localStorage.getItem('globalBMR') : 'N/A'; // Обратите внимание на значение по умолчанию



// Функция для обновления процентного выполнения нормы
function updateDailySummary2() {
    const dailyProtein = parseFloat(document.getElementById('daily-protein').textContent);
    const dailyFats = parseFloat(document.getElementById('daily-fats').textContent);
    const dailyCarbs = parseFloat(document.getElementById('daily-carbs').textContent);
    const dailyFiber = parseFloat(document.getElementById('daily-fiber').textContent);
    const dailyWater = parseFloat(document.getElementById('daily-water').textContent);

    const proteinPercentage = (dailyProtein / globalProteinNorm * 100).toFixed(2);
    const fatsPercentage = (dailyFats / globalFatsNorm * 100).toFixed(2);
    const carbsPercentage = (dailyCarbs / globalCarbsNorm * 100).toFixed(2);
    const fiberPercentage = (dailyFiber / globalFiberNorm * 100).toFixed(2);
    const waterPercentage = (dailyWater / globalWaterNorm * 100).toFixed(2);

    const savedData = JSON.parse(localStorage.getItem('userProfile'));
    const Globalweight = parseFloat(savedData.weight) || 0;
    calculateNutrientNorms(Globalweight);
    

    // Обновление HTML
    document.getElementById('daily-protein').nextSibling.textContent = ` г / Норма: ${globalProteinNorm} г [${proteinPercentage}% от нормы]`;
    document.getElementById('daily-fats').nextSibling.textContent = ` г / Норма: ${globalFatsNorm} г [${fatsPercentage}% от нормы]`;
    document.getElementById('daily-carbs').nextSibling.textContent = ` г / Норма: ${globalCarbsNorm} г [${carbsPercentage}% от нормы]`;
    document.getElementById('daily-fiber').nextSibling.textContent = ` г / Норма: ${globalFiberNorm} г [${fiberPercentage}% от нормы]`;
    document.getElementById('daily-water').nextSibling.textContent = ` мл / Норма: ${globalWaterNorm} мл [${waterPercentage}% от нормы]`;

    
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

            
        
        if (Globalweight > 0) {
            
            setInterval(calculateNutrientNorms(Globalweight), 1000);
            // Запуск обновления сводки за день раз в секунду
    setInterval(updateDailySummary2, 1000); // Обновляем сводку за день
        }
        
        

        GlobalpercentageBMR = localStorage.getItem('globalPercentageBMR') || '?';

        const dailyCaloriesElement = document.getElementById('daily-calories');
        if (dailyCaloriesElement && globalBMR) {
            if (!dailyCaloriesElement.nextSibling.textContent.includes('/ Норма:')) {
                dailyCaloriesElement.nextSibling.textContent += ` / Норма: ${globalBMR} ккал [${GlobalpercentageBMR}% от нормы]`;
            }
        }
    }
}
    
    // Загрузка сохраненных данных при загрузке страницы
    loadProfileData();

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
                    option.textContent = product.name;
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

// Функция для обновления отображения ГИ
function updateGlycemicIndexDisplay(methodIndex, product, card) {
    const glycemicIndex = getGlycemicIndex(methodIndex, product);
    const giContainer = card.querySelector(".glycemic-index-container");
    const giValue = giContainer.querySelector(".glycemic-index-value");
    const giTooltip = giContainer.querySelector(".glycemic-index-tooltip");

    if (glycemicIndex !== null) {
        giContainer.style.display = 'inline-block';
        giValue.textContent = `ГИ: ${glycemicIndex}`;
        giContainer.style.backgroundColor = getGlycemicIndexColor(glycemicIndex);

        // Определение класса для подсказки
        let lowGiClass = '';
        let mediumGiClass = '';
        let highGiClass = '';

        if (glycemicIndex <= 55) {
            lowGiClass = 'low-gi';
        } else if (glycemicIndex >= 56 && glycemicIndex <= 69) {
            mediumGiClass = 'medium-gi';
        } else if (glycemicIndex >= 70) {
            highGiClass = 'high-gi';
        }

        giTooltip.innerHTML = `
            <p><b>Нормы ГИ:</b><br>[Гликемического индекса]</p>
            <p class="${lowGiClass}">0-55 (Низкий)</p>
            <p class="${mediumGiClass}">56-69 (Средний)</p>
            <p class="${highGiClass}">70+ (Высокий)</p>
        `;
    } else {
        giContainer.style.display = 'none';
    }
}



    // Отображение карточки продукта
function displayProductCard(product) {
    productsDiv.innerHTML = '';

    const card = document.createElement("div");
    card.classList.add("product-card");

    // Функция для обновления опций порций
    const updateServingsOptions = (productWeight) => {
        return Object.keys(product.servings).map(serving => {
            let servingWeight = serving === 'шт.' ? productWeight : product.servings[serving];
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
            <h3>${product.name}</h3>
            ${product.manufacturerOrSeller ? `<p><span class="manufacturerOrSeller"><b>Производитель/Продавец:</b> ${product.manufacturerOrSeller}</span></p>` : ''}
            ${product.description ? `<p><b>Описание:</b>  ${product.description}</p>` : ''}

            <!-- Контейнер для индикаторов -->
            <div class="indicators-container">

            <!-- Добавляем Vegan, если продукт является веганским -->
            ${product.vegan ? `<p class="vegan-info"><b>Vegan</b></p>` : ''}

            <!-- Добавляем сюда RAW, он будет динамически управляться -->
            <p class="raw-info" style="display: none;"><b>RAW</b></p>

              <!-- Контейнер для ГИ -->
            <div class="glycemic-index-container">
                    <span class="glycemic-index-value"></span>
                    <div class="glycemic-index-tooltip"></div>
                </div>
            
            </div>

            <label>Введите вес продукта (граммы):
                <input type="number" class="product-weight" min="1" step="1" value="${defaultWeight}">
            </label>
            <p><b>Калории:</b> <span id="calories-info" class="calories-info">${product.calories}</span> ккал</p>
            <p><b>Белки:</b> <span class="protein-info">${product.protein}</span> г</p>
            <p><b>Жиры:</b> <span class="fats-info">${product.fats}</span> г</p>
            <p><b>Углеводы:</b> <span class="carbs-info">${product.carbs}</span> г</p>
            <p><b>Содержание клетчатки:</b> <span class="fiber-info">${product.fiberContent}</span> г</p>
            <p><b>Содержание воды:</b> <span class="water-info">0.00</span> мл</p>

            

            <label>Метод обработки:
                <select class="processing-method">
                    ${Object.keys(processingMethods).map(method => 
                        `<option value="${method}">${method}</option>`
                    ).join('')}
                </select>
            </label>

            <select class="serving-size">
                ${updateServingsOptions(defaultWeight)}
            </select>

            <input type="number" class="serving-amount" placeholder="Количество порций" min="1" step="1">
            <select class="meal-time">
                <option value="">Выберите прием пищи</option>
                ${mealsOptions}
            </select>
            <button class="add-to-meal">Добавить в прием пищи</button>
        </div>
    `;

    // Добавляем контейнер для витаминов только если есть витамины
    if (product.vitamins && Object.keys(product.vitamins).length > 0) {
        const vitaminsContainer = document.createElement("div");
        vitaminsContainer.classList.add("vitamins-container");
        vitaminsContainer.innerHTML = '<h4>Витамины</h4>' +
            Object.entries(product.vitamins).map(([vitamin, value]) => {
                if (vitamin.endsWith("units")) {
                    return ''; // Пропускаем поля units
                }
                const unitKey = vitamin + 'units';
                const unit = product.vitamins[unitKey] || '';
                const vitaminName = vitaminTranslations[vitamin] || vitamin;
                const vitaminValue = (value * defaultWeight / 100).toFixed(2);
                return `<p><b>${vitaminName}:</b> ${vitaminValue} ${unit}</p>`;
            }).join('');
        card.appendChild(vitaminsContainer);
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

    // Обновление отображения элемента RAW
    function updateRawInfo() {
        const method = methodSelect.value;
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

    let initialWeightForUnits = null; // Переменная для хранения исходного веса для типа 'шт.'

function updateNutritionalInfo() {
    const selectedServing = servingSizeSelect.value; // Получаем выбранный тип порции
    const servingsAmount = parseFloat(servingAmountInput.value) || 1; // По умолчанию 1 порция
    if (servingAmountInput.value == 0) {
    servingAmountInput.value = 1; // Устанавливаем значение по умолчанию 1
    }
    let servingWeight = 0;

    if (selectedServing === 'шт.') {
        if (initialWeightForUnits === null) {
            // Сохраняем начальное значение веса при первом выборе типа 'шт.'
            initialWeightForUnits = parseFloat(weightInput.value) || defaultWeight;
        }
        servingWeight = initialWeightForUnits;

        // Обновляем поле ввода веса на сохраненное начальное значение
        weightInput.value = initialWeightForUnits;
    } else {
        // Используем вес из списка порций для других типов порций
        servingWeight = product.servings[selectedServing] || defaultWeight;
        
        // Обновляем weightInput только если тип порции не 'шт.'
        weightInput.value = servingWeight;
    }

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

    // Пересчет витаминов
    const vitaminsContainer = card.querySelector(".vitamins-container");
    if (vitaminsContainer) {
        vitaminsContainer.innerHTML = '<h4>Витамины</h4>' +
            Object.entries(product.vitamins).map(([vitamin, value]) => {
                if (vitamin.endsWith("units")) {
                    return ''; // Пропускаем поля units
                }
                const unitKey = vitamin + 'units';
                const unit = product.vitamins[unitKey] || '';
                const vitaminName = vitaminTranslations[vitamin] || vitamin;
                const vitaminValue = (value * weight / 100 * factor).toFixed(2);
                return `<p><b>${vitaminName}:</b> ${vitaminValue} ${unit}</p>`;
            }).join('');
    }

    updateRawInfo(); // Обновляем отображение RAW

    // Обновляем отображение ГИ
    const methodIndex = Object.keys(processingMethods).indexOf(method);
    updateGlycemicIndexDisplay(methodIndex, product, card);
}
    
    



    

   

    
    

    

    

    
    

    
    weightInput.addEventListener('input', updateNutritionalInfo);
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












