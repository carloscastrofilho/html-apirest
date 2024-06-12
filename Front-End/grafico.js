
google.charts.load('current', {'packages': ['corechart', 'bar']});
google.charts.setOnLoadCallback(getData);

let dispositivo = [];
let totalRegistros = [];
let dataApi = [];

async function getData() {
  try {
    const response1 = await fetch('http://localhost:5000/monitoramento');
    if (!response1.ok) throw new Error('Falha na resposta da rede 1');
    dataApi = await response1.json();

    const response2 = await fetch('http://localhost:5000/monitoramento/grafico1');
    if (!response2.ok) throw new Error('Falha na resposta da rede 2');
    const data2 = await response2.json();
    
    data2.forEach(item => {
      dispositivo.push(item.dispositivo);
      totalRegistros.push(item.TotalRegistros);
    });

    drawChart('corechart', 'pie');

    checkCharts();
  } catch (error) {
    console.error('Houve um problema com a operação fetch:', error);
  }
}

function checkCharts() {
  const radioButtons = document.querySelectorAll('input[type="radio"][name="chart-type"]');
  radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', () => {
      displayChart(radioButton.value);
    });
  });
}

function displayChart(chartType) {
  document.querySelector('.charts').style.display = 'block';

  switch (chartType) {
    case 'pie':
      document.getElementById('chart_div').style.display = 'block';
      document.getElementById('barchart_div').style.display = 'none';
      document.getElementById('areachart_div').style.display = 'none';
      drawChart('corechart', 'pie');
      break;
    case 'bar':
      document.getElementById('barchart_div').style.display = 'block';
      document.getElementById('chart_div').style.display = 'none';
      document.getElementById('areachart_div').style.display = 'none';
      drawChart('bar', 'bar');
      break;
    case 'area':
      document.getElementById('areachart_div').style.display = 'block';
      document.getElementById('chart_div').style.display = 'none';
      document.getElementById('barchart_div').style.display = 'none';
      drawChart('corechart', 'area');
      break;
    default:
      console.log('No radio button is checked');
  }
}

function drawChart(package, chartType) {
  google.charts.load('current', {packages: [package]});
  google.charts.setOnLoadCallback(function () {
    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Dispositivo');
    data.addColumn('number', 'Total de Registros');

    if (chartType === 'pie') {
      dataApi.forEach(item => {
        data.addRow([item.dispositivo, parseFloat(item.luminosidade)]);
      });
    } else {
      for (let i = 0; i < dispositivo.length; i++) {
        data.addRow([dispositivo[i], totalRegistros[i]]);
      }
    }

    let options;
    let chart;

    if (chartType === 'pie') {
      options = {
        title: 'Luminosidade por Dispositivo',
        is3D: true,
      };
      chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    } else if (chartType === 'bar') {
      options = {
        chart: {
          title: 'Registros de Dispositivos',
        },
        bars: 'horizontal',
      };
      chart = new google.charts.Bar(document.getElementById('barchart_div'));
    } else if (chartType === 'area') {
      options = {
        title: 'Registros de Dispositivos',
      };
      chart = new google.visualization.AreaChart(document.getElementById('areachart_div'));
    }

    chart.draw(data, options);
  });
}
