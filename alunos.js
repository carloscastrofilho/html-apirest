const table = document.querySelector('[data-js="informacoes"]');
const filterInput = document.querySelector("#filter");

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateRandomData = () => {
    const data = [];
    const dispositivos = ["DispositivoA", "DispositivoB", "DispositivoC", "DispositivoD"]; 
    for (let i = 0; i < 20; i++) {
        const dispositivo = dispositivos[getRandomInt(0, dispositivos.length - 1)];
        const temperatura = getRandomInt(0, 40); 
        const umidade = getRandomInt(0, 100); 
        const info = {
            id: i + 1,
            dispositivo: dispositivo,
            temperatura: `${temperatura}°C`,
            umidade: `${umidade}%`
        };
        data.push(info);
    }
    return data;
}

const generateTableRows = (data) => {
    return data.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.dispositivo}</td>
            <td>${item.temperatura}</td>
            <td>${item.umidade}</td>
        </tr>
    `).join('');
}

const updateTable = (data) => {
    const rows = generateTableRows(data);
    table.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Dispositivo</th>
            <th>Temperatura</th>
            <th>Umidade</th>
        </tr>
        ${rows}
    `;
}

updateTable(generateRandomData());

const filterData = (search) => {
    const filteredData = generateRandomData().filter(item =>
        item.dispositivo.includes(search) || item.temperatura.includes(search) || item.umidade.includes(search)
    );
    updateTable(filteredData);
}

filterInput.addEventListener('input', event => {
    const inputValue = event.target.value;
    if (inputValue.trim() !== '') {
        filterData(inputValue);
    } else {
        updateTable(generateRandomData());
    }
});