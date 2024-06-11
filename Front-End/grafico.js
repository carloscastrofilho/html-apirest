google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

async function drawChart() {
  try {
    const response = await fetch('http://192.168.1.7:5000/monitoramento');
    if (!response.ok) {
      throw new Error('Falha na resposta da rede');
    }
    const dataApi = await response.json();

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Dispositivo');
    data.addColumn('number', 'Luminosidade');

    dataApi.forEach(function(item) {
      data.addRow([item.dispositivo, parseFloat(item.luminosidade)]);
    });

    var options = {
      title: 'Luminosidade por Dispositivo',
      is3D: true,
    };

    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  } catch (error) {
    console.error('Houve um erro com a operação fetch:', error);
  }
}