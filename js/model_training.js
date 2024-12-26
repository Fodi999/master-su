export async function trainModel(trainingData) {
    console.log('Начинаем обучение модели...');

    // Преобразование данных в числовые значения
    const inputs = trainingData.map(data => data.input);
    const outputs = trainingData.map(data => data.output);

    const uniqueInputs = [...new Set(inputs)];
    const uniqueOutputs = [...new Set(outputs)];

    const inputIndices = inputs.map(input => uniqueInputs.indexOf(input));
    const outputIndices = outputs.map(output => uniqueOutputs.indexOf(output));

    const xs = tf.tensor1d(inputIndices, 'int32');
    const ys = tf.tensor1d(outputIndices, 'int32');

    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [1], units: uniqueOutputs.length, activation: 'softmax' }));

    model.compile({
        loss: 'sparseCategoricalCrossentropy',
        optimizer: 'sgd',
    });

    await model.fit(xs, ys, {
        epochs: 200,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                if ((epoch + 1) % 50 === 0) {
                    console.log(`Эпоха ${epoch + 1}: Потери = ${logs.loss}`);
                }
            },
        },
    });

    return { model, uniqueInputs, uniqueOutputs };
}

export async function saveModelToJson(model, uniqueInputs, uniqueOutputs) {
    try {
        console.log('Сохраняем модель в localStorage...');
        await model.save('localstorage://my-model');
        localStorage.setItem('uniqueInputs', JSON.stringify(uniqueInputs));
        localStorage.setItem('uniqueOutputs', JSON.stringify(uniqueOutputs));
        console.log('Модель успешно сохранена в localStorage!');
    } catch (error) {
        console.error('Ошибка при сохранении модели в localStorage:', error);
    }
}

export async function loadModelFromJson() {
    try {
        console.log('Пытаемся загрузить модель из localStorage...');
        const model = await tf.loadLayersModel('localstorage://my-model');
        const uniqueInputs = JSON.parse(localStorage.getItem('uniqueInputs'));
        const uniqueOutputs = JSON.parse(localStorage.getItem('uniqueOutputs'));
        console.log('Модель успешно загружена из localStorage!');
        return { model, uniqueInputs, uniqueOutputs };
    } catch (error) {
        console.warn('Модель не найдена. Возможно, требуется обучение:', error);
        return null;
    }
}


