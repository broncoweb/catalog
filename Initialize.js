async function getItems(company) {
    const apiEndpoint = "https://x8ki-letl-twmt.n7.xano.io/api:ttv96NIU/items"
    const res = await fetch(`${apiEndpoint}?company=${company}`)
    const data = await res.json()
    return data
}

function buildItems(arr, template) {
    const wrapper = document.getElementById('root')
    for(const item of arr){
        const { image_url, name, number, inventory, type } = item
        if(inventory > 0){
            const clone = template.content.cloneNode(true)
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
            title.setAttribute('fs-cmsfilter-field','title')
            cardType.textContent = type
            cardType.setAttribute('fs-cmsfilter-field','type')
            cardInventory.textContent = inventory
            cardNumber.textContent = number
            cardNumber.setAttribute('fs-cmsfilter-field','number')
            wrapper.append(clone)
        }
    }
}

async function initialize(company) {
    if ("content" in document.createElement("template")) {
        const template = document.getElementById('pos-card') || null
        if(template) {
            const dataArr = await getItems(company)
            if(dataArr){
                buildItems(dataArr, template)
            }
        }
    }
}

export default initialize