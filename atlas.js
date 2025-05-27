const continent = document.getElementById('continent');
const modal = new bootstrap.Modal(document.getElementById('windowCountry'));
const modalBody = document.getElementById("modal-body-content");
const modalHeader = document.getElementById("modal-header-content");
const ModalFooter = document.getElementById("modal-footer-content");

function getCapitals(country, type) {
  if (type === 'capital') {
    if (Array.isArray(country.capital) && country.capital.length > 1) {
      return country.capital.join(', ');
    } else if (Array.isArray(country.capital) && country.capital.length === 1) {
      return country.capital[0];
    } else {
      return 'Žádné hlavní město';
    }
  }
  else if (type === 'borders') {
    if (Array.isArray(country.borders) && country.borders.length > 1) {
      return country.borders.join(', ');
    } else if (Array.isArray(country.borders) && country.borders.length === 1) {
      return country.borders[0];
    } else {
      return 'Žádné sousední státy';
    }
  }
}

async function getData(region) {
    const url = `https://restcountries.com/v3.1/region/${region}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);
      let blocks = '';
      json.forEach((country) => {
        blocks += `
            <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">                
                <div class="card bgColorForContainer" style="margin-bottom: 20px;" id="edit-card">
                    <img class="card-img-top" src="${country.flags.png}" alt="Vlajka" style="height: 180px; object-fit: cover; aling-items: center;">
                    <div class="card-body">
                      <h4 class="card-title"><b>${country.name.common} (${country.cca3}</b>)</h4>
                      <p class="card-text">Počet obyvatel: ${country.population.toLocaleString('cs-CZ')}</p>
                      <a href="#" class="btn btn-info card-link" 
                        data-name="${country.name.common}" 
                        data-code="${country.cca3}">Informace
                      </a>
                    </div>
                </div>
            </div>            
        `;
      });
      listCountries.innerHTML = blocks;
      document.querySelectorAll('[data-name]').forEach(button => {
        button.addEventListener('click', () => {
          console.log('pokus');
          let countryCode = button.getAttribute('data-code');
          if (countryCode === 'TWN') {
            countryCode = 'CHN';
            //U Taiwanu je potřeba použít kód Číny, protože Taiwan je považován za součást Číny v databázi. 100%.
          }
          modalHeader.innerHTML = '';
          modalBody.innerHTML = '<div class="text-center">Načítám...</div>';
          ModalFooter.innerHTML = '';
          modal.show();
          fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
          .then(res => res.json())
          .then(data => {
            const country = data[0];
            if (!country) {
              modalHeader.innerHTML = `<h3><strong>Neznámý stát</strong></h3>`;
              modalBody.innerHTML = `<ul class="list-group"><li>Data nejsou dostupná.</li></ul>`;
              ModalFooter.innerHTML = "";
              return;
            }
            const subregion = country.subregion ? country.subregion : 'Žádný region';
            const region = country.region ? country.region : 'Žádný kontinent';
            const area = country.area
              ? country.area.toLocaleString('cs-CZ') + ' km²'
              : 'Žádné území';
            const languages = country.languages
              ? Object.values(country.languages).join(', ')
              : 'Žádný jazyk';
            const currency = country.currencies
              ? Object.values(country.currencies)
              .map(cur => `${cur.name} (${cur.symbol})`)
              .join(', ')
              : 'Žádná měna';
            console.log(country);
            modalHeader.innerHTML = `
              <h3 class = "modal-class-edit"><strong>${country.name.official}</strong></h3>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Zavřít
              </button>
            `;
            modalBody.innerHTML = `
              <ul class="list-group textStyle">
                <li class="list-group-item modal-item-edit">
                  <h4>Hlavní město: ${getCapitals(country, 'capital')}</h4>
                </li>
                <li class="list-group-item modal-item-edit">
                  <h4>Obyvatelstvo: ${country.population.toLocaleString('cs-CZ')}</h4>
                </li>
                <li class="list-group-item modal-item-edit">
                  <h4>Jazyk: ${languages}</h4>
                </li>
                <li class="list-group-item modal-item-edit">
                  <h4>Měna: ${currency}</h4>
                </li>
                <li class="list-group-item modal-item-edit">
                  <h4>Rozloha: ${area}</h4>
                </li>
                <li class="list-group-item modal-item-edit">
                  <h4>Nachází se v ${region}, specificky v ${subregion}</h4>
                </li>
                <li class="list-group-item modal-item-edit">
                  <h4>Sousední státy: ${getCapitals(country, 'borders')}</h4>
                </li>
                <li class="list-group-item modal-item-edit">
                  <h4>Časové pásma: ${country.timezones.join(', ')}</h4>
                </li>
              </ul>
            `;
            ModalFooter.innerHTML = `
              <div id="footer-modal-edit" class="w-100 p-0 m-0">
                <img src="${country.flags.png}" alt="Vlajka" style="height: 165px; object-fit: cover; aling-items: center;">
              </div>
            `;
          })
          .catch(error => {
            console.log(`Nastala chyba: ${error}`);
          });
        });
      });

    } catch (error) {
      //console.error(error.message);
    }
  }

continent.addEventListener('change', ()=> {
    getData(continent.value);
});

getData('europe');
