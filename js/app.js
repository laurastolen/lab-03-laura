'use strict';

let mainVariable = 0;

const animalArray = [];
const animalArray2 = [];

function Animal(animalObj) {
  // eslint-disable-next-line camelcase
  this.image_url = animalObj.image_url;
  this.title = animalObj.title;
  this.description = animalObj.description;
  this.keyword = animalObj.keyword;
  this.horns = animalObj.horns;
  if (mainVariable === 0) {
    this.page = 'page1';
    animalArray.push(this);
  }
  else {
    this.page = 'page2';
    animalArray2.push(this);
  }
}

// create and render dropdown
function renderDropdown(animalArray) {

  const tempArray = [];
  $('optgroup').empty();
  animalArray.forEach(animal => {
    if (!tempArray.includes(animal.keyword)) {
      tempArray.push(animal.keyword);
    }
  });
  tempArray.forEach(keyword => {
    const $newSection = $('<option></option>');
    $newSection.text(keyword);
    $('optgroup').append($newSection);
  });
}

Animal.prototype.render = function () {
  let source = document.getElementById('animal-template').innerHTML;
  let template = Handlebars.compile(source);
  return template(this);
};

// get page one data, render HB templates and dropdown
$(document).ready($.get('data/page-1.json', data => {
  data.forEach(animal => {
    new Animal(animal);
  });
  animalArray.forEach(animal => {
    $('main[id=page-one]').append(animal.render());
  });
  renderDropdown(data);
})
);

// get page two data, render HB templates
$(document).ready($.get('data/page-2.json', data => {
  mainVariable = 1;
  data.forEach(animal => {
    new Animal(animal);
  });
  animalArray2.forEach(animal => {
    $('main[id=page-two]').append(animal.render());
  });
})
);

// page one button listener
$('button:first-of-type').on('click', function () {
  ($.get('data/page-1.json', data => {
    renderDropdown(data);
  }));
  $('section').hide();
  $('main[id="page-one"] section').show();
  mainVariable = 0;
});

// page two button listener
$('button:last-of-type').on('click', function () {
  ($.get('data/page-2.json', data => {
    renderDropdown(data);
  }));
  $('section').hide();
  $('main[id="page-two"] section').show();
  mainVariable = 1;
});

// dropdown listener
$(document).ready($('#myselection').on('change', function () {
  $('section').hide();
  if (mainVariable === 0) {
    $(`img[alt=${this.value}][page=page1]`).parent().show();
  }
  else {
    $(`img[alt=${this.value}][page=page2]`).parent().show();
  }
})
);
