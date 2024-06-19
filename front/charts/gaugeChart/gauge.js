let gaugeData = [['Label', 'Value']];

function getData() {
  fetch('http://127.0.0.1:5000/monitoramento/graficomedidor')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data[0].MED_LUMINOSIDADE);
      gaugeData = [
        ['Label', 'Value'],
        ['Temperatura', data[0].MED_TEMPERATURA],
        ['Umidade', data[0].MED_UMIDADE],
        ['Luz', data[0].MED_LUMINOSIDADE],
      ];
      drawCharts();
    })
    .catch((error) => console.error('Erro ao obter dados:', error));
}

function loadGoogleCharts(callback) {
  google.charts.load('current', { packages: ['corechart', 'bar', 'gauge'] });
  google.charts.setOnLoadCallback(callback);
}

function drawCharts() {
  loadGoogleCharts(() => {
    renderGauge();
  });
}

function renderGauge() {
  const data = google.visualization.arrayToDataTable(gaugeData);
  console.log(data);
  const options = {
    width: 400,
    height: 120,
    redFrom: 90,
    redTo: 100,
    yellowFrom: 75,
    yellowTo: 90,
    minorTicks: 5,
  };

  const chart = new google.visualization.Gauge(
    document.getElementById('gauge_chart')
  );

  chart.draw(data, options);

  // If you want to update the chart at intervals, you can set the intervals here
  // setInterval(function () {
  //   fetch('http://127.0.0.1:5000/monitoramento/graficomedidor')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       gaugeData = [
  //         ['Label', 'Value'],
  //         ['Luminosidade', data.MED_LUMINOSIDADE],
  //         ['Temperatura', data.MED_TEMPERATURA],
  //         ['Umidade', data.MED_UMIDADE],
  //       ];
  //       chart.draw(data, options);
  //     })
  //     .catch((error) => console.error('Erro ao obter dados:', error));
  // }, 10000);
}

document.addEventListener('DOMContentLoaded', getData);
