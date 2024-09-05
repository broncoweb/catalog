window.fsAttributes = window.fsAttributes || []
window.fsAttributes.push(['cmsload', async (listInstances) => {
    console.log('cmsload Successfully loaded!')

    const [listInstance] = listInstances //defines cms list being used
    const [item] = listInstance.items //defines single item from reference list
    const itemTemplate = item.element //defines template using single item
		
    const cards = await fetchItems("bronco") //grabs data from external api
    listInstance.clearItems() //removes placeholder items

    const newItems = cards.map((card) => newItem(card, itemTemplate))
    await listInstance.addItems(newItems)
}])

const fetchItems = async (company) => {
    try {
        const res = await fetch(`https://x8ki-letl-twmt.n7.xano.io/api:ttv96NIU/items?company=${company}`)
        const data = await res.json()

        return data
    } catch(error) {
        return []
    }
}

const newItem = (item, template) => {
    const { image_url, name, number, inventory, type } = item
    const clone = template.cloneNode(true)
    const img = clone.querySelector('[data-element="image"]')
    const title = clone.querySelector('[data-element="title"]')
    const cardType = clone.querySelector('[data-element="type"]')
    const cardInventory = clone.querySelector('[data-element="inventory"]')
    const cardNumber = clone.querySelector('[data-element="number"]')

    if(image_url){
        if(img) {
            clone.querySelector('[data-element="no-image"]').classList.add('display-none')
            img.src = image_url
        }
    } else {
        if(img) img.classList.add('display-none')
    }
    
    if(title) title.textContent = name
    if(cardType) cardType.textContent = type
    if(cardInventory) cardInventory.textContent = inventory
    if(cardNumber) cardNumber.textContent = number

    return clone
}