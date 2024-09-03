/* Variables */
const formContent = document.getElementById('form_content');
const formWrapper = document.getElementById('pos-form-container');
const formMain = document.getElementById('pos-form');
const formBtn = document.getElementById('form-btn');
const submitBtn = document.getElementById('submit-btn');
const orderNum = document.getElementById('order-input');
const successNum = document.getElementById('order-number');
const formArr = [];
const cartNumEl = document.getElementById('item-count');
const toggleForm = () => formWrapper.classList.toggle('form-open');
const hideForm = () => formWrapper.classList.remove('form-open');
const uuid = self.crypto.randomUUID();

/* Order Number Info */
orderNum.setAttribute('type','hidden');
orderNum.value = uuid;
successNum.textContent = uuid;

/* Event Listener for Opening/Closing Form */
document.addEventListener('click', (e) => {
    let target = e.target;
    do {
        if (target === formBtn){
            toggleForm();
            return;
        } else if (target === formWrapper){
            //do nothing
            return;
        };
        target = target.parentElement;
    } while (target);
    hideForm();
});

/* Function Declarations */
const createElTag = (tagName, tagClass, tagText) => {
    const myElement = document.createElement(tagName);
    myElement.classList = tagClass;
    myElement.textContent = tagText;
    return myElement;
};
const clearArr = (arr) => {
    arr.splice(0, arr.length);
};
const updateCart = (e) => {
    const value = e.target.value;
    const id = e.target.getAttribute('id');

    if (value < 1){
        const current = formArr.findIndex(item => item.number === id);
        formArr.splice(current, 1);
        renderCart();
    } else {
        const thisObject = formArr.filter(item => item.number === id);
        thisObject[0].inventory = value;
        renderCart();
    };
};
const renderCart = () => {
    let inventoryAmount = 0;
    
    formContent.innerHTML = '';
    if (formArr.length > 0) {
        submitBtn.removeAttribute('disabled');
        for(let [index, item] of formArr.entries()){
            const itemNumber = index + 1;
            const contentItem = createElTag('div', 'pos-form_content-item', '');
            const numDiv = createElTag('div', 'pos-form_content-number', '');
            const numP = createElTag('input','pos-form_input pos-content-input', '');
            numP.setAttribute('type','text');
            numP.setAttribute('data-name',`item${itemNumber}-number`);
            numP.setAttribute('id',`pos-number_${item.number}`);
            numP.value = item.number;
            numDiv.append(numP);

            const titleDiv = createElTag('div', 'pos-form_content-title', '');
            const titleP = createElTag('input', 'pos-form_input pos-content-input', '');
            titleP.setAttribute('type','text');
            titleP.setAttribute('data-name',`item${itemNumber}-name`);
            titleP.setAttribute('id',`pos-number_${item.number}`);
            titleP.value = item.name;
            titleDiv.append(titleP);
            
            const inventoryDiv = createElTag('div', 'pos-form_content-inventory', '');
            const inventoryInput = createElTag('input','w-input pos-form_input inventory-input','');
            inventoryInput.setAttribute('type','number');
            inventoryInput.setAttribute('data-name',`item${itemNumber}-qty`);
            inventoryInput.setAttribute('min','0');
            inventoryInput.setAttribute('max',`${item.max}`);
            inventoryInput.setAttribute('id',`${item.number}`);
            inventoryInput.required = true;
            inventoryInput.value = item.inventory;
            inventoryInput.addEventListener('change',updateCart);
            inventoryDiv.append(inventoryInput);

            contentItem.append(numDiv,titleDiv,inventoryDiv);
            formContent.append(contentItem);
            inventoryAmount += item.inventory;
        };
    } else {
        submitBtn.setAttribute('disabled','');
        formContent.textContent = 'No items in cart';
    };
    cartNumEl.textContent = inventoryAmount;
};
const addToCart = (e) => {
    const parent = e.target.parentElement;
    const title = parent.querySelector('.resource-title').textContent;
    const posNum = parent.querySelector('.resource-number').textContent;
    const maxInventory = parent.querySelector('[wized="inventory_number"]').textContent;
    // const maxInventory = parent.querySelectorAll('.resource-type')[1].textContent;
    
    const object = {
        name: title,
        number: posNum,
        inventory: 1,
        max: maxInventory
    };
            
    if (formArr){
        const thisObject = formArr.filter((item) => item.number === object.number)[0];
        
        if (thisObject){
            thisObject.inventory ++;
            renderCart();
        } else {
            formArr.push(object);
            renderCart();
        };
    } else {
        formArr.push(object);
        renderCart();
    };
};
const delay = () => {
    setTimeout(() => {
        const resourceAddBtns = document.querySelectorAll('.resource-card_add-btn');
        submitBtn.setAttribute('disabled','');
        for(let btn of resourceAddBtns) {
            // Adds Event Listener to 'Plus' Buttons and unhides them
            btn.classList.remove('display-none');
            btn.addEventListener('click', addToCart);
        };
    },1400);
};

/* Initialization */

if(document.readyState == 'complete') {
    delay();
} else {
    document.onreadystatechange = () => delay();
}

// clears cart
renderCart();

// Event Listener for Clearing Out Form
formMain.addEventListener('submit', (e) => {
    setTimeout(() => {
        const inputs = e.target.querySelectorAll('input');
        for(let input of inputs){
            input.value = '';
        };
        clearArr(formArr);
        renderCart();
        alert(`Thank you for your request, your order number is ${uuid}.`);
    }, 600);

    setTimeout(hideForm, 10000);
});