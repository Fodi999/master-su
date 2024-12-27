import { trainModel, saveModelToJson, loadModelFromJson } from './model_training.js';
import { saveModel, loadModel, deleteModel } from './model_storage.js';

let trainingData = [];
let model = null;
let uniqueInputs = [];
let uniqueOutputs = [];

async function fetchData() {
    try {
        const response = await fetch('/data');
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        const data = await response.json();
        trainingData = data;
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

async function saveData() {
    try {
        const response = await fetch('/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(trainingData),
        });
        if (!response.ok) throw new Error('Ошибка сохранения данных');
        console.log('Данные успешно сохранены');
    } catch (error) {
        console.error('Ошибка сохранения данных:', error);
    }
}

async function testTensorFlow() {
    try {
        const input = tf.tensor([1, 2, 3, 4]);
        console.log('Input Tensor:', input.toString());

        const output = input.mul(tf.scalar(2));
        console.log('Output Tensor (multiplied by 2):', output.toString());

        const outputValues = await output.array();
        console.log('Output Values:', outputValues);

        return `TensorFlow работает! Результаты умножения: ${outputValues.join(', ')}`;
    } catch (error) {
        console.error('Ошибка при выполнении TensorFlow.js:', error);
        return 'Ошибка при проверке TensorFlow.js';
    }
}

// Функция для настройки чата
function setupChat() {
    const inputField = document.getElementById('custom-input');
    const sendButton = document.getElementById('send-message');
    const resultDiv = document.getElementById('result');

    if (!inputField || !resultDiv || !sendButton) {
        console.error('Chat elements not found on the page');
        return;
    }

    console.log('Chat elements found and initialized.');

    const sendMessage = async () => {
        const userMessage = inputField.value.trim();
        if (!userMessage) return;

        addChatMessage('Пользователь', userMessage);
        inputField.value = '';

        const botResponse = await getBotResponse(userMessage);
        addChatMessage('Бот', botResponse);
    };

    inputField.addEventListener('keypress', async (event) => {
        if (event.key === 'Enter') {
            await sendMessage();
        }
    });

    sendButton.addEventListener('click', async () => {
        await sendMessage();
    });

    function addChatMessage(sender, message) {
        const chatMessage = document.createElement('div');
        chatMessage.className = 'chat-response';
        chatMessage.innerHTML = `<b>${sender}:</b> ${message}`;
        resultDiv.appendChild(chatMessage);
        resultDiv.scrollTop = resultDiv.scrollHeight;
    }

    async function getBotResponse(question) {
        if (question.toLowerCase().includes('обучить модель')) {
            console.log('Вызов trainModel для вопроса:', question);
            const result = await trainModel(trainingData);
            model = result.model;
            uniqueInputs = result.uniqueInputs;
            uniqueOutputs = result.uniqueOutputs;
            await saveModelToJson(model, uniqueInputs, uniqueOutputs);
            await saveData(); // Сохранение данных на сервере
            return 'Обучение завершено и модель сохранена в localStorage.';
        }

        // Проверка для TensorFlow
        if (question.toLowerCase().includes('tensorflow')) {
            console.log('Вызов testTensorFlow для вопроса:', question);
            return await testTensorFlow();
        }

        // Проверка для загрузки модели из localStorage
        if (question.toLowerCase().includes('загрузить модель')) {
            console.log('Вызов loadModel для вопроса:', question);
            const result = await loadModelFromJson();
            if (result) {
                model = result.model;
                uniqueInputs = result.uniqueInputs;
                uniqueOutputs = result.uniqueOutputs;
                return 'Модель успешно загружена из localStorage.';
            } else {
                return 'Модель не найдена. Возможно, требуется обучение.';
            }
        }

        // Проверка для удаления модели
        if (question.toLowerCase().includes('удалить модель')) {
            console.log('Вызов deleteModel для вопроса:', question);
            await deleteModel();
            model = null;
            uniqueInputs = [];
            uniqueOutputs = [];
            return 'Модель успешно удалена.';
        }

        // Сохранение пользовательских данных для обучения
        const parts = question.split(' это ');
        if (parts.length === 2) {
            const [input, output] = parts;
            trainingData.push({ input: input.trim(), output: output.trim() });
            await saveData(); // Сохранение данных на сервере
            return `Данные "${input.trim()} это ${output.trim()}" добавлены для обучения.`;
        }

        // Предсказание на основе введенных данных
        if (model) {
            const inputIndex = uniqueInputs.indexOf(question);
            if (inputIndex !== -1) {
                const inputTensor = tf.tensor1d([inputIndex], 'float32'); // Преобразование в float32
                const prediction = model.predict(inputTensor);
                const predictedIndex = prediction.argMax(-1).dataSync()[0];
                const predictedValue = uniqueOutputs[predictedIndex];
                return `Предсказание для "${question}": ${predictedValue}`;
            } else {
                return `Извините, я пока не знаю ответа на этот вопрос.`;
            }
        }

        // Серверная обработка остальных вопросов
        try {
            const response = await fetch('/ask-bot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            if (!response.ok) throw new Error('Server error');
            const data = await response.json();
            return data.answer;
        } catch (error) {
            console.error('Error fetching bot response:', error);
            return 'Извините, произошла ошибка.';
        }
    }
}

// Перемещаем определение функции в начало
async function initializePageScripts(page, navBar) {
    const backToMenuButton = document.getElementById('back-to-menu');

    if (page === '/ask') {
        console.log('Initializing chat on /ask page.');
        setupChat();

        // Показать кнопку для возвращения в меню
        if (backToMenuButton) {
            backToMenuButton.style.display = 'inline-block';
        }

        // Скрыть меню навигации
        if (navBar) {
            navBar.style.display = 'none';
        }

        // Обработчик для возврата в меню
        if (backToMenuButton) {
            backToMenuButton.addEventListener('click', () => {
                // Показать меню навигации и скрыть чат
                if (navBar) {
                    navBar.style.display = 'block';
                }
                backToMenuButton.style.display = 'none'; // Скрыть кнопку

                // Вернуть контент страницы (например, главную страницу)
                loadPage('/home');
            });
        }
    } else {
        // Убираем кнопку возврата на других страницах
        if (backToMenuButton) {
            backToMenuButton.style.display = 'none';
        }

        if (navBar) {
            navBar.style.display = 'block'; // Показать меню
        }
    }
}
// Загрузка страницы и ее стили
function loadPage(url, cssFile) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById('main-content').innerHTML = html;

            // Подключение стилей для страницы
            if (cssFile) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssFile;
                document.head.appendChild(link);
            }

            initializePageScripts(url); // Реинициализация скриптов
        })
        .catch(error => console.error(`Error loading page ${url}:`, error));
}
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Navigation script initialized.');

    try {
        console.log('TensorFlow.js version:', tf.version); // Проверка TensorFlow.js
    } catch (error) {
        console.error('TensorFlow.js is not available. Make sure it is included in your project.');
    }

    await fetchData(); // Загрузка данных при инициализации

    const mainContent = document.getElementById('main-content');
    const navBar = document.querySelector('.nav-bar');

    if (!mainContent) {
        console.error('main-content element not found');
        return;
    }

    // Функция для обновления активного элемента
    function updateActiveLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    // Загрузка страницы по умолчанию
    fetch('/home')
        .then(response => response.text())
        .then(html => {
            mainContent.innerHTML = html;
            const defaultLink = document.querySelector('.nav-link[data-page="/home"]');
            if (defaultLink) {
                updateActiveLink(defaultLink);
                initializePageScripts('/home', navBar);
            }
        })
        .catch(error => console.error('Error loading home content:', error));

    // Обработка кликов по ссылкам
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = link.getAttribute('data-page');

            if (!page) {
                console.error('Error: Missing data-page attribute');
                return;
            }

            fetch(page)
                .then(response => response.text())
                .then(html => {
                    mainContent.innerHTML = html;
                    updateActiveLink(link);
                    initializePageScripts(page, navBar);
                    history.pushState(null, '', page);
                })
                .catch(error => console.error(`Error loading page: ${page}`, error));
        });
    });

    // Обработка кнопки "назад" в браузере
    window.addEventListener('popstate', () => {
        const page = location.pathname;

        fetch(page)
            .then(response => response.text())
            .then(html => {
                mainContent.innerHTML = html;
                const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
                if (activeLink) updateActiveLink(activeLink);
                initializePageScripts(page, navBar);
            })
            .catch(error => console.error('Error loading page:', error));
    });
});

