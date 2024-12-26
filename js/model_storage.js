// model_storage.js

import * as tf from '@tensorflow/tfjs';

// Функция для сохранения модели
export async function saveModel(model) {
    try {
        console.log('Сохраняем модель в localStorage...');
        await model.save('localstorage://my-model');
        console.log('Модель успешно сохранена!');
    } catch (error) {
        console.error('Ошибка при сохранении модели:', error);
    }
}

// Функция для загрузки модели
export async function loadModel() {
    try {
        console.log('Пытаемся загрузить модель из localStorage...');
        const model = await tf.loadLayersModel('localstorage://my-model');
        console.log('Модель успешно загружена!');
        return model;
    } catch (error) {
        console.warn('Модель не найдена. Возможно, требуется обучение:', error);
        return null;
    }
}

// Функция для удаления сохранённой модели
export async function deleteModel() {
    try {
        console.log('Удаляем сохранённую модель из localStorage...');
        await tf.io.removeModel('localstorage://my-model');
        console.log('Модель успешно удалена!');
    } catch (error) {
        console.error('Ошибка при удалении модели:', error);
    }
}
