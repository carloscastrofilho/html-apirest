// artigo base : https://diegomagalhaes-dev.medium.com/como-consumir-uma-api-rest-utilizando-javascript-e2728c207eb

const table = document.querySelector('.showData');

const filterImput = document.querySelector('#filter');

const timeStamp = Date.now().toString();

const getData = async (param) => {
  const response = await fetch(`http://localhost:8000/monitoramento`);
  return response.json();
};

const dataToList = (alunos) =>
  alunos
    .map(
      (item) => `
    <tr>
        <td>${item.temperatura}</td>
        <td>${item.umidade}</td>
        <td>${item.luminosidade}</td>
        <td>${item.dispositivo}</td>
    </tr>
`
    )
    .join('');

const alunosFromSearch = (data) =>
  data
    .map(
      (item) => `
      <tr>
        <td>${item.temperatura}</td>
        <td>${item.umidade}</td>
        <td>${item.luminosidade}</td>
        <td>${item.dispositivo}</td>
    </tr>
`
    )
    .join('');

const earlyFedd = async () => {
  const dataFromApi = await getData('');
  const dataTemplate = dataToList(dataFromApi);
  table.innerHTML = dataTemplate;
};

const searchAlunosIntoDOM = async (search) => {
  const dataFromApi = await getData(`${'dispositivo='}${search}`);
  const dataTemplate = alunosFromSearch(dataFromApi);
  console.log(dataTemplate);
  table.innerHTML = dataTemplate;
};

// funçção que verifica o input "pesquisar alunos"
const modifyInputValue = (event) => {
  const inputvalue = event.target.value.toLowerCase();
  if (inputvalue != '') {
    searchAlunosIntoDOM(inputvalue);
  } else if (inputvalue == '' || inputvalue == null) {
    earlyFedd();
  }
};

earlyFedd();

filterImput.addEventListener('input', modifyInputValue);
