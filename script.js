const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearItem = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const addItemBtn = itemForm.querySelector("button");
let editeState = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach((item) => addItemToDOM(item));

  checkUI();
}

function addItem(e) {
  e.preventDefault();

  const inputValue = itemInput.value;
  if (inputValue === "") {
    alert("Please add an Item!");
  } else {
    if (!editeState) {
      appendItemToList(inputValue);
    } else {
      updateItem(inputValue);
    }
  }
}

function updateItem(inputValue) {
  const itemToEdit = itemList.querySelector(".edit-mode");

  itemList.removeChild(itemToEdit);

  removeItemFromStorage(itemToEdit.textContent);

  appendItemToList(inputValue);
}

function appendItemToList(value) {
  const itemsFromStorage = getItemsFromStorage();
  const itemTextLC = value.toLowerCase();

  const lCItems = [];

  itemsFromStorage.forEach((item, index) => {
    const itemTxt = item.toLowerCase();
    lCItems.push(itemTxt);
  });

  if (lCItems.includes(itemTextLC)) {
    alert("Item already exists!");
    return;
  }

  addItemToDOM(value);
  addItemToStorage(value);

  checkUI();

  itemInput.value = "";
}

function addItemToDOM(item) {
  // creating new element append the text node as a child
  const newItem = document.createElement("li");
  newItem.appendChild(document.createTextNode(item));

  // create Button for the item
  const button = createButton("remove-item btn-link text-red");

  newItem.appendChild(button);

  itemList.appendChild(newItem);
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;

  // creating icon
  const icon = createIcon("fa-solid fa-xmark");

  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function addItemToStorage(newItem) {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(newItem);

  localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function onClickItem(e) {
  const button = e.target.closest(".remove-item");

  if (button) {
    removeItem(button);
  } else {
    editItem(e.target);
  }
}

function removeItem(button) {
  if (confirm("Are you sure?")) {
    itemList.removeChild(button.parentNode);

    removeItemFromStorage(button.parentNode.innerText);
    checkUI();
  }
}

function editItem(target) {
  editeState = true;

  // assign text to form input
  itemInput.value = target.innerText;

  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  // change the style of the item
  target.classList.add("edit-mode");

  // change the html of the addItemBtn
  addItemBtn.innerHTML = '<i class="fa-solid fa-pencil"></i> Update Item';
  addItemBtn.style.backgroundColor = "#808080";
}

function removeItemFromStorage(itemText) {
  const itemsFromStorage = getItemsFromStorage();
  const itemTextLC = itemText.toLowerCase();

  itemsFromStorage.forEach((item, index) => {
    const itemTxt = item.toLowerCase();

    if (itemTxt === itemTextLC) {
      itemsFromStorage.splice(index, 1);

      localStorage.setItem("items", JSON.stringify(itemsFromStorage));
    }
  });
}

function clearItems() {
  // itemList.innerHTML = ''

  // Better way
  if (itemList.firstChild) {
    if (confirm("Are you sure?")) {
      while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
      }

      clearItemsFromStorage();
      checkUI();
    }
  } else {
    alert("There is no more elemnts!");
  }
}

function clearItemsFromStorage() {
  localStorage.removeItem("items");
}

function checkUI() {
  itemInput.value = "";

  const items = itemList.querySelectorAll("li");

  if (items.length === 0) {
    clearItem.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearItem.style.display = "block";
    itemFilter.style.display = "block";
  }

  editeState = false;

  addItemBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  addItemBtn.style.backgroundColor = "#333";
}

function filterItemList(e) {
  const input = e.target.value.toLowerCase();

  [...itemList.children].forEach((child) => {
    const childTxt = child.innerText.toLowerCase();
    if (childTxt.includes(input)) {
      child.style.display = ""; // Show the matching items
    } else {
      child.style.display = "none"; // Hide non-matching items
    }
  });
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromStorage;
}

function focusInput(e) {
  itemInput.style.boxShadow = "2px 1px #ccc";
}
function blurInput(e) {
  itemInput.style.boxShadow = "";
}

// initialize app
function init() {
  itemForm.addEventListener("submit", addItem);
  itemInput.addEventListener("focus", focusInput);
  itemInput.addEventListener("blur", blurInput);
  itemList.addEventListener("click", onClickItem);
  clearItem.addEventListener("click", clearItems);
  itemFilter.addEventListener("input", filterItemList);
  document.addEventListener("DOMContentLoaded", displayItems);

  checkUI();
}

init();
