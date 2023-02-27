const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const itemFilter = document.querySelector('#filter');
const formBtn = itemForm.querySelector('.btn');
let isEditMode = false;

// Functions
function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
  });
  updateUI();
}

function onAddItemSubmit(e) {
  // console.log(e);
  e.preventDefault();

  const newItem = itemInput.value;
  // validate input
  if (newItem === '') {
    alert('Please add an item.');
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem.toLowerCase())) {
      alert('That item already exists!');
      return;
    }
  }

  // create item dom element
  addItemToDOM(newItem);

  // add item to local storage
  addItemToStorage(newItem);

  itemInput.value = '';
  updateUI();
}

function addItemToDOM(item) {
  // create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const btn = createButton('remove-item btn-link text-red');
  li.appendChild(btn);

  itemList.appendChild(li);
}

function createButton(classes) {
  const btn = document.createElement('button');
  btn.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  btn.appendChild(icon);
  return btn;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(item);

  // convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
  console.log(itemsFromStorage);
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function onClickItem(e) {
  // detects if we are clicking on the X button
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  console.log(formBtn);
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
  formBtn.style.backgroundColor = '#228B22';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm('Are you sure you want to delete this?')) {
    item.remove();
    removeItemFromStorage(item.textContent);
    updateUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  localStorage.removeItem('items');
  updateUI();
}

function filterItems(e) {
  const filter = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');

  items.forEach((item) => {
    const itemText = item.firstChild.textContent.toLowerCase();
    if (itemText.indexOf(filter) !== -1) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }
  });

  console.log(itemList.querySelectorAll('li'));
  updateUI();
}

// refresh UI to match state
function updateUI() {
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.classList.add('hidden');
    itemFilter.classList.add('hidden');
  } else {
    clearBtn.classList.remove('hidden');
    itemFilter.classList.remove('hidden');
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
  isEditMode = false;
}

// Init app to prevent items being in global scope
function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  // check state and update UI
  updateUI();
}

init();
