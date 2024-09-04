window.fsAttributes = window.fsAttributes || []
window.fsAttributes.push([
    'cmsload', 
    async (listInstances) => {
        console.log('cmsload Successfully loaded!')

        const [listInstance] = listInstances //defines cms list being used
        const [item] = listInstance.items //defines single item from reference list
        const itemTemplate = item.element //defines template using single item

        const cards = await fetchItems() //grabs data from external api
        listInstance.clearItems() //removes placeholder items
        console.log(listInstance)
        const newItems = cards.map(async (card) => await newItem(card, itemTemplate))
        await listInstance.addItems(newItems)
    }
])

const fetchItems = async () => {
    try {
        const res = await fetch('https://x8ki-letl-twmt.n7.xano.io/api:ttv96NIU/items?company=bronco')
        const data = await res.json()

        return data
    } catch(error) {
        return []
    }
}

const newItem = async (item, template) => {
    const { image_url, name, number, inventory, type } = item
    const clone = await template.cloneNode(true)
    const img = await clone.querySelector('[data-element="image"]')
    const title = await clone.querySelector('[data-element="title"]')
    const cardType = await clone.querySelector('[data-element="type"]')
    const cardInventory = await clone.querySelector('[data-element="inventory"]')
    const cardNumber = await clone.querySelector('[data-element="number"]')

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

    return newItem
}