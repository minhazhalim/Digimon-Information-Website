const digimonList = document.querySelector('#digimon-list');
const digimonInfoLeftContainer = document.querySelector('#left-digimon-info');
async function fetchDigimons(){
     const url = 'https://digi-api.com/api/v1/digimon?pageSize=500';
     const response = await fetch(url);
     const digimonData = await response.json();
     const digimons = digimonData.content;
     return digimons;
}
function renderDigimonName(object){
     const digimonName = object.name.toUpperCase();
     const digimonNameContainer = document.querySelector('#digimonName');
     digimonNameContainer.innerHTML = "";
     digimonNameContainer.append(digimonName);
}
function renderDigimonTypes(object){
     if(object.types.length > 0){
          const digimonType = object.types[0].type;
          const digimonTypeBox = document.querySelector('#type-box-type');
          digimonTypeBox.innerHTML = 'Type: ' + "";
          digimonTypeBox.append(digimonType);
     }else {
          const digimonTypeBox = document.querySelector('#type-box-type');
          digimonTypeBox.innerHTML = 'N/A - No Type Found';
     }
}
function renderDigimonAttributes(object){
     if(object.attributes.length > 0){
          const digimonAttributes = object.attributes[0].attribute;
          const digimonAttributeBox = document.querySelector('#type-box-attribute');
          digimonAttributeBox.innerHTML = 'Attribute: ' + "";
          digimonAttributeBox.append(digimonAttributes);
     }else {
          const digimonAttributeBox = document.querySelector('#type-box-attribute');
          digimonAttributeBox.innerHTML = 'N/A - No Attribute Found';
     }
}
function renderDigimonDescription(object){
     const englishDescription = object.descriptions.find((description) => {
          return description.language === 'en_us';
     });
     if(englishDescription != undefined){
          const digimonDescriptionBox = document.querySelector('#digimon-description');
          const p = document.createElement('p');
          p.textContent = englishDescription.description;
          digimonDescriptionBox.innerHTML = "";
          digimonDescriptionBox.append(p);
     }else {
          const digimonDescriptionBox = document.querySelector('#digimon-description');
          const p = document.createElement('p');
          p.textContent = 'N/A - No Description Found';
          digimonDescriptionBox.innerHTML = "";
          digimonDescriptionBox.append(p);
     }
}
function renderDigimonYear(object){
     const digimonYearBox = document.querySelector('#yearReleased');
     const digimonYear = object.releaseDate;
     digimonYearBox.innerHTML = 'Year Released: ' + "";
     digimonYearBox.append(digimonYear);
}
function getDigimon(event){
     let url = 'https://digi-api.com/api/v1/digimon/';
     let digimonID = event.target.id;
     let digimonData = fetch(url + digimonID)
     .then(response => response.json()).then((data) => {
          const img = document.createElement('img');
          img.src = data.images[0].href;
          img.alt = 'Failed to Get Image';
          const imageContainer = document.querySelector('#image-container');
          imageContainer.innerHTML = "";
          imageContainer.appendChild(img);
          renderDigimonTypes(data);
          renderDigimonAttributes(data);
          renderDigimonDescription(data);
          renderDigimonYear(data);
          renderDigimonName(data);
          digimonInfoLeftContainer.classList.remove('none');
     });
}
async function initialize(){
     const digimons = await fetchDigimons();
     let filterDigimons = [...digimons];
     const FilteredDigimonData = () => {
          digimonList.innerHTML = "";
          filterDigimons.forEach(element => {
               const span = document.createElement('span');
               span.className = 'digimonNameList';
               span.innerText = element.name;
               span.id = element.id;
               span.addEventListener('mouseover',getDigimon);
               digimonList.appendChild(span);
          });
     };
     FilteredDigimonData();
     function resetContainer(){
          const imageContainer = document.querySelector('#image-container');
          imageContainer.innerHTML = "";
          const digimonNameContainer = document.querySelector('#digimonName');
          digimonNameContainer.innerHTML = "";
          const digimonTypeBox = document.querySelector('#type-box-type');
          digimonTypeBox.innerHTML = "";
          const digimonAttributeBox = document.querySelector('#type-box-attribute');
          digimonAttributeBox.innerHTML = "";
          const digimonDescriptionBox = document.querySelector('#digimon-description');
          digimonDescriptionBox.innerHTML = "";
          const digimonYearBox = document.querySelector('#yearReleased');
          digimonYearBox.innerHTML = "";
          digimonInfoLeftContainer.classList.add('none');
     }
     const searchInput = document.querySelector('#input');
     const searchButton = document.querySelector('#searchButton');
     const sortButton = document.querySelector('#sortButton');
     const sortButtonOriginalValue = document.querySelector('#sortButton').innerHTML;
     searchButton.addEventListener('click',() => {
          resetContainer();
          filterDigimons = digimons.filter((digimon) => {
               return digimon.name.toLowerCase().includes(searchInput.value.toLowerCase());
          });
          sortButton.innerHTML = sortButtonOriginalValue;
          if(filterDigimons.length === 0){
               digimonList.innerHTML = `No Digimon with the name "${searchInput.value}" found. Please try another Digimon or click the "Refresh" button!`;
          }else {
               digimonList.innerHTML = "";
               FilteredDigimonData();
          }
     });
     const refreshButton = document.querySelector('#refreshButton');
     refreshButton.addEventListener('click',() => {
          resetContainer();
          filterDigimons = [...digimons];
          sortButton.innerHTML = sortButtonOriginalValue;
          digimonList.innerHTML = "";
          FilteredDigimonData();
     });
     const sortAscendingButton = document.querySelector('#sortAscendingButton');
     sortAscendingButton.addEventListener('click',() => {
          resetContainer();
          filterDigimons.sort((a,b) => {
               return a.name.localeCompare(b.name);
          });
          sortButton.innerHTML = 'Sort ' + '&uarr;';
          FilteredDigimonData();
     });
     const sortDescendingButton = document.querySelector('#sortDescendingButton');
     sortDescendingButton.addEventListener('click',() => {
          resetContainer();
          filterDigimons.sort((a,b) => {
               return b.name.localeCompare(a.name);
          });
          sortButton.innerHTML = 'Sort ' + '&darr;';
          FilteredDigimonData();
     });
}
document.addEventListener('DOMContentLoaded',initialize);