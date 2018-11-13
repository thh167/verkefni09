// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
  let results;

  function displayError(error) {
    const container = results.querySelector('.results');
    container.classList.remove('loading');

    if (container != null) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
    container.appendChild(document.createTextNode(error));
  }

  function dagsIso(date) {
    const dagsetning = new Date(date);
    const isoDagsetning = dagsetning.toISOString();
    return isoDagsetning.substring(0, 10);
  }

  function birta(objectData) {
    const [{
      address, email, domain, registered, lastChange,
      expires, registrantname, country,
    }] = objectData;
    const registeredIso = dagsIso(registered);
    const lastChangeIso = dagsIso(lastChange);
    const expiresIso = dagsIso(expires);
    const arr = [domain, registeredIso, lastChangeIso, expiresIso,
      registrantname, email, address, country];
    const texti = ['Lén', 'Skráð', 'Seinast breytt', 'Rennur út', 'Skráningaraðili', 'Netfang', 'Heimilisfang', 'Land'];

    const dl = document.createElement('dl');
    for (let i = 0; i < 4; i++) {  /* eslint-disable-line */
      document.createElement('dt');
      const element = document.createElement('dt');
      element.appendChild(document.createTextNode(texti[i]));
      dl.appendChild(element);

      const valueElement = document.createElement('dd');
      valueElement.appendChild(document.createTextNode(arr[i]));
      dl.appendChild(valueElement);
    }
    for (let i = 4; i < 8; i++) {  /* eslint-disable-line */
      if (arr[i] !== '') {
        document.createElement('dt');
        const element = document.createElement('dt');
        element.appendChild(document.createTextNode(texti[i]));
        dl.appendChild(element);

        const valueElement = document.createElement('dd');
        valueElement.appendChild(document.createTextNode(arr[i]));
        dl.appendChild(valueElement);
      }
    }

    const container = results.querySelector('.results');
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(dl);
  }

  function showData(domainList) {
    if (domainList.length === 0) {
      displayError('Lén er ekki skráð');
      return;
    }
    birta(domainList);
  }

  function empty(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  function loadingGif() {
    const container = document.querySelector('div');
    empty(container);
    const x = document.createElement('IMG');
    x.setAttribute('src', 'loading.gif');
    x.setAttribute('alt', 'Leita að léni');
    container.classList.add('loading');
    container.appendChild(x);
    container.appendChild(document.createTextNode('   Leita að léni..'));
  }

  function fetchData(domain) {
    loadingGif();
    fetch(`${API_URL}${domain}`)
      .then((result) => {
        if (result.status === 200) {
          return result.json();
        }
        throw new Error('Something went wrong on api server!');
      })
      .then((data) => {
        showData(data.results);
      })
      .catch((error) => {
        displayError('Villa við að sækja gögn');
        console.error(error);
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('input');
    if (input.value === '') {
      displayError('Lén verður að vera strengur');
      throw new Error('Villa');
    }
    fetchData(input.value);
  }

  function init(_domains) {
    results = _domains;
    const form = results.querySelector('form');
    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const domains = document.querySelector('.domains');
  program.init(domains);
});
