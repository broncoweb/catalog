/* 
    Variables 
        */

    const formWrapper = document.getElementById('pos-form-container')
    const formMain = document.getElementById('pos-form')
    const formBtn = document.getElementById('form-btn')
    const submitBtn = document.getElementById('submit-btn')
    const orderNum = document.getElementById('order-input')
    const successNum = document.getElementById('order-number')
    const formArr = []
    const cartNumEl = document.getElementById('item-count')
    const uuid = self.crypto.randomUUID()
    
    /*
        Attributes API CMSLoad Script
             */
    
    window.fsAttributes = window.fsAttributes || []
    window.fsAttributes.push(['cmsload', async (listInstances) => {
        console.log('cmsload Successfully loaded!')
    
        const [listInstance] = listInstances //defines cms list being used
        const [item] = listInstance.items //defines single item from reference list
        const itemTemplate = item.element //defines template using single item
            
        const cards = await fetchItems("bronco") //grabs data from external api
        listInstance.clearItems() //removes placeholder items
    
        const newItems = cards.map((card) => newItem(card, itemTemplate)) //creates new items using template and api data
        await listInstance.addItems(newItems) //adds new items to wrapper
    }])
    
    /* 
        Order Number Info 
            */
    
    if(orderNum) {
        orderNum.setAttribute('type','hidden')
        orderNum.value = uuid
        successNum.textContent = uuid
    }
    
    /* 
        Event Listener for Opening/Closing Form 
            */
    
    document.addEventListener('click', (e) => {
        let target = e.target
        do {
            if (target === formBtn){
                toggleForm()
                return
            } else if (target === formWrapper){
                //do nothing
                return
            };
            target = target.parentElement
        } while (target)
        hideForm()
    })
    
    /* 
        Function Declarations 
            */
    
    const toggleForm = () => formWrapper.classList.toggle('form-open') // toggles form
    const hideForm = () => formWrapper.classList.remove('form-open') // hides form
    
    // general purpose create element function
    const createElTag = (tagName, tagClass, tagText) => {
        const myElement = document.createElement(tagName)
        myElement.classList = tagClass
        myElement.textContent = tagText
        return myElement
    }
    
    // clear array function
    const clearArr = (arr) => {
        arr.splice(0, arr.length)
    }
    
    // update cart function
    const updateCart = (e) => {
        const value = e.target.value
        const id = e.target.getAttribute('id')
    
        if (value < 1){
            const current = formArr.findIndex(item => item.number === id)
            formArr.splice(current, 1)
            renderCart()
        } else {
            const thisObject = formArr.filter(item => item.number === id)
            thisObject[0].inventory = value
            renderCart()
        }
    }
    
    // render cart function
    const renderCart = () => {
        let inventoryAmount = 0
        const formContent = document.getElementById('form_content')
        
        if (formContent) formContent.innerHTML = ''
        if (formArr.length > 0) {
            submitBtn.removeAttribute('disabled')
            for(let [index, item] of formArr.entries()){
                const itemNumber = index + 1
                const contentItem = createElTag('div', 'pos-form_content-item', '')
                const numDiv = createElTag('div', 'pos-form_content-number', '')
                const numP = createElTag('input','pos-form_input pos-content-input', '')
                numP.setAttribute('type','text')
                numP.setAttribute('data-name',`item${itemNumber}-number`)
                numP.setAttribute('id',`pos-number_${item.number}`)
                numP.value = item.number
                numDiv.append(numP)
    
                const titleDiv = createElTag('div', 'pos-form_content-title', '')
                const titleP = createElTag('input', 'pos-form_input pos-content-input', '')
                titleP.setAttribute('type','text')
                titleP.setAttribute('data-name',`item${itemNumber}-name`)
                titleP.setAttribute('id',`pos-number_${item.number}`)
                titleP.value = item.name
                titleDiv.append(titleP)
                
                const inventoryDiv = createElTag('div', 'pos-form_content-inventory', '')
                const inventoryInput = createElTag('input','w-input pos-form_input inventory-input','')
                inventoryInput.setAttribute('type','number')
                inventoryInput.setAttribute('data-name',`item${itemNumber}-qty`)
                inventoryInput.setAttribute('min','0')
                inventoryInput.setAttribute('max',`${item.max}`)
                inventoryInput.setAttribute('id',`${item.number}`)
                inventoryInput.required = true
                inventoryInput.value = item.inventory
                inventoryInput.addEventListener('change',updateCart)
                inventoryDiv.append(inventoryInput)
    
                contentItem.append(numDiv,titleDiv,inventoryDiv)
                formContent.append(contentItem)
                inventoryAmount += Number(item.inventory)
            }
        } else {
            submitBtn.setAttribute('disabled','')
            formContent.textContent = 'No items in cart'
        }
        cartNumEl.textContent = inventoryAmount
    }
    
    // add item to cart function
    const addToCart = (e) => {
        const parent = e.target.parentElement
        const title = parent.querySelector('.resource-title').textContent
        const posNum = parent.querySelector('.resource-number').textContent
        const maxInventory = parent.querySelector('[wized="inventory_number"]') ? parent.querySelector('[wized="inventory_number"]').textContent : parent.querySelector('[data-element="inventory"]').textContent
        
        const object = {
            name: title,
            number: posNum,
            inventory: 1,
            max: Number(maxInventory)
        }
                
        if (formArr){
            const thisObject = formArr.filter((item) => item.number === object.number)[0]
            
            if (thisObject){
                if(thisObject.inventory < Number(thisObject.max)) thisObject.inventory ++
                renderCart()
            } else {
                formArr.push(object)
                renderCart()
            };
        } else {
            formArr.push(object)
            renderCart()
        }
    }
    
    // fetch items from catalog api function
    const fetchItems = async (company) => {
        try {
            const res = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:ttv96NIU/items?company=${company}`)
            const data = await res.json()
    
            return data.filter(item => item.inventory > 0)
        } catch(error) {
            return []
        }
    }
    
    // create pos items builder function
    const newItem = (item, template) => {
        const { image_url, name, number, inventory, type } = item
        const clone = template.cloneNode(true)
        const img = clone.querySelector('[data-element="image"]')
        const title = clone.querySelector('[data-element="title"]')
        const cardType = clone.querySelector('[data-element="type"]')
        const cardInventory = clone.querySelector('[data-element="inventory"]')
        const cardNumber = clone.querySelector('[data-element="number"]')
        const addBtn = clone.querySelector('[data-element="add-btn"]')
    
        if(image_url){
            if(img) {
                img.src = image_url
            }
        } else {
            if(img) img.classList.add('display-none')
            clone.querySelector('[data-element="no-image"]').classList.toggle('display-none')
        }
        
        if(title) title.textContent = name
        if(cardType) cardType.textContent = type
        if(cardInventory) cardInventory.textContent = inventory
        if(cardNumber) cardNumber.textContent = number
        if(addBtn) {
            addBtn.addEventListener('click', addToCart)
            addBtn.classList.remove('display-none')
        }
    
        return clone
    }
    
    // clears cart
    renderCart()
    
    // Event Listener for Clearing Out Form
    formMain.addEventListener('submit', (e) => {
        setTimeout(() => {
            const inputs = e.target.querySelectorAll('input')
            for(let input of inputs){
                input.value = ''
            };
            clearArr(formArr)
            renderCart()
            alert(`Thank you for your request, your order number is ${uuid}.`)
        }, 600)
    
        setTimeout(hideForm, 10000)
    })