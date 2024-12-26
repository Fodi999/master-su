export async function trainModel() {
    console.log('Начинаем обучение модели...');

    const xs = tf.tensor1d([0, 1, 2, 3, 4]);
    const ys = tf.tensor1d([-1, 1, 3, 5, 7]);

    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [1], units: 1 }));

    model.compile({
        loss: 'meanSquaredError',
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

    const prediction = model.predict(tf.tensor1d([5]));
    const predictedValue = prediction.dataSync()[0];
    console.log(`Предсказание для x = 5: y = ${predictedValue}`);

    return `Предсказание для x = 5: y = ${predictedValue}`;
}


