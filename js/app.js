'use strict';

let mainVariable = 0;

const animalArray = [];
const animalArray2 = [];
const allAnimals = [];

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
  else if (mainVariable === 1) {
    this.page = 'page2';
    animalArray2.push(this);
  } else {
    this.page = 'both-pages';
    allAnimals.push(this);
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

// get page one data, render HB templates
$(document).ready($.get('data/page-1.json', data => {
  data.forEach(animal => {
    new Animal(animal);
  });
  animalArray.forEach(animal => {
    $('main[id=page-one]').append(animal.render());
  });
  $('main[id=page-one] section').hide();
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
  $('main[id=page-two] section').hide();
})
);

// get both page data, render HB templates, show on initial page load, build dropdown
$(document).ready($.get('data/both-pages.json', data => {
  mainVariable = 2;
  data.forEach(animal => {
    new Animal(animal);
  });
  allAnimals.forEach(animal => {
    $('main[id=both-pages]').append(animal.render());
  });
  renderDropdown(data);
})
);

// page one button listener
$('#btn-pg-1').on('click', function () {
  ($.get('data/page-1.json', data => {
    renderDropdown(data);
  }));
  $('section').hide();
  $('main[id="page-one"] section').show();
  mainVariable = 0;
});

// page two button listener
$('#btn-pg-2').on('click', function () {
  ($.get('data/page-2.json', data => {
    renderDropdown(data);
  }));
  $('section').hide();
  $('main[id="page-two"] section').show();
  mainVariable = 1;
});

// show both pages listener
$('#btn-both-pgs').on('click', function () {
  $('section').hide();
  ($.get('data/both-pages.json', data => {
    renderDropdown(data);
    $('main[id="page-one"] section').show();
    $('main[id="page-two"] section').show();
    mainVariable = 2;
  }));
});

// dropdown listener
$(document).ready($('#myselection').on('change', function () {
  $('section').hide();
  if (mainVariable === 0) {
    $(`img[alt=${this.value}][page=page1]`).parent().show();
  }
  else if (mainVariable === 1) {
    $(`img[alt=${this.value}][page=page2]`).parent().show();
  } else if (mainVariable === 2) {
    $(`img[alt=${this.value}][page=both-pages]`).parent().show();
  }
})
);

// sort fx
function sortAndRender(whatToSortBy) {
  $('section').hide();
  if (whatToSortBy === 'Horns') {
    allAnimals.sort((a, b) => {
      return a.horns - b.horns;
    });
  } else if (whatToSortBy === 'Title') {
    allAnimals.sort((a, b) => {
      if (a.keyword < b.keyword) {
        return -1;
      } else if (a.keyword > b.keyword) {
        return 1;
      } else {
        return 0;
      }
    });
  }
  allAnimals.forEach(animal => {
    $('main[id=both-pages]').append(animal.render());
  });
}

// listeners for sortBy buttons with callback of sortAndRender:
$('.sortby').on('click', function (event) {
  if (event.target.id === 'horn-sort') {
    sortAndRender('Horns');
  } else if (event.target.id === 'title-sort') {
    sortAndRender('Title');
  }
});
