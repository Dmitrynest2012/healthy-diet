document.addEventListener("DOMContentLoaded", function() {
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

    // Создание HTML-кода карточки
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div>
            <h3>${product.name}</h3>
            ${product.description ? `<p>${product.description}</p>` : ''}
            <label>Введите вес продукта (граммы):
                <input type="number" class="product-weight" min="1" step="1" value="${defaultWeight}">
            </label>
            <p>Калории: <span class="calories-info">${product.calories}</span> ккал</p>
            <p>Белки: <span class="protein-info">${product.protein}</span> г</p>
            <p>Жиры: <span class="fats-info">${product.fats}</span> г</p>
            <p>Углеводы: <span class="carbs-info">${product.carbs}</span> г</p>
            <p>Содержание клетчатки: <span class="fiber-info">${product.fiberContent}</span> г</p>
            <p>Содержание воды: <span class="water-info">0.00</span> мл</p>

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
    productsDiv.appendChild(card);

    const weightInput = card.querySelector(".product-weight");
    const methodSelect = card.querySelector(".processing-method");
    const servingSizeSelect = card.querySelector(".serving-size");
    const waterInfo = card.querySelector(".water-info");
    const fiberInfo = card.querySelector(".fiber-info");

    // Установка метода обработки в select
    if (product.processingMethod) {
        const methodOption = methodSelect.querySelector(`option[value="${product.processingMethod}"]`);
        if (methodOption) {
            methodSelect.value = product.processingMethod;
        }
    }

    // Обновление информации о питательных веществах
    function updateNutritionalInfo() {
        const weight = parseFloat(weightInput.value) || defaultWeight;
        const method = methodSelect.value;
        const factor = processingMethods[method] || 1; // Дефолтный фактор 1, если метод не выбран

        card.querySelector(".calories-info").textContent = (product.calories * weight / 100 * factor).toFixed(2);
        card.querySelector(".protein-info").textContent = (product.protein * weight / 100 * factor).toFixed(2);
        card.querySelector(".carbs-info").textContent = (product.carbs * weight / 100 * factor).toFixed(2);
        card.querySelector(".fats-info").textContent = (product.fats * weight / 100 * factor).toFixed(2);
        card.querySelector(".fiber-info").textContent = (product.fiberContent * weight / 100 * factor).toFixed(2);
        card.querySelector(".water-info").textContent = (product.waterContent * weight / 100 * factor).toFixed(2);

        servingSizeSelect.innerHTML = updateServingsOptions(weight);
    }

    weightInput.addEventListener('input', updateNutritionalInfo);
    methodSelect.addEventListener("change", updateNutritionalInfo);
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
    });
}


     // Обновление сводной информации по приему пищи
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
            tableBody.removeChild(productRow);
            const index = mealData[meal].indexOf(productEntry);
            if (index > -1) {
                mealData[meal].splice(index, 1);
            }
            mealTotals[meal].calories -= productEntry.calories;
            mealTotals[meal].protein -= productEntry.protein;
            mealTotals[meal].carbs -= productEntry.carbs;
            mealTotals[meal].fats -= productEntry.fats;
            mealTotals[meal].fiber -= productEntry.fiber;
            mealTotals[meal].water -= productEntry.water;
            mealTotals[meal].grams -= productEntry.weight;
            updateMealTotal(meal);
            updateDailySummary();
            saveMealData();
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
    }

    

    // Инициализация текущей даты
    updateDateDisplay();
    loadMealData();
});




