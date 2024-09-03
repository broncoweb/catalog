async function getItems(company) {
    const apiEndpoint = "https://x8ki-letl-twmt.n7.xano.io/api:ttv96NIU/items"
    const res = await fetch(`${apiEndpoint}?company=${company}`)
    const data = await res.json()
    return data
}

async function loadItems(company) {
    if ("content" in document.createElement("template")) {
        const wrapper = document.getElementById('root')
        const template = document.getElementById('pos-card') || null
        if(template) {
            const dataArr = await getItems(company)
            
            for(const item of dataArr){
                const clone = template.content.cloneNode(true)
                const { image_url, name, number, inventory, type } = item
                const img = clone.querySelector('.resource-image')
                const title = clone.querySelector('.resource-title')
                const cardType = clone.querySelectorAll('.resource-type')[0]
                const cardInventory = clone.querySelectorAll('.resource-type')[1]
                const cardNumber = clone.querySelector('.resource-number')
                if(image_url){
                    clone.querySelector('.resource-image-text-wrapper').style.display = "none"
                    img.src = image_url
                } else {
                    img.style.display = "none"
                }
                title.textContent = name
                cardType.textContent = type
                cardInventory.textContent = inventory
                cardNumber.textContent = number
                wrapper.append(clone)
            }
        }
    }
}

loadItems("bronco")