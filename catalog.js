const wrapperEl = document.getElementById('pos-wrapper')
const url = 'https://api.airtable.com/v0'
const posToken = ${{ secrets.API_TOKEN }}
const posBaseId = 'appnP2hrGHs3uGTQ1'
const posTableId = 'tblfb53l2JHHJODli'
const posUrl = `${url}/${posBaseId}/${posTableId}?view=Grid%20view`

function createElTag(tagName, tagClass, tagText) {
    const myElement = document.createElement(tagName)
    myElement.classList = tagClass
    myElement.textContent = tagText  
    return myElement
}

function createImgTag(tagClass, tagAlt, tagSrc){
  const myImage = document.createElement("img")
  myImage.classList = tagClass
  myImage.src = tagSrc
  myImage.alt = tagAlt
  return myImage
}

const emptyList = () => wrapperEl.innerHTML = ''

async function getAirtable(){
    const headers = {
        "Authorization": `Bearer ${posToken}`,
        "Content-Type": "application/json"
    }
    
    const options = {
        headers: headers,
        method: "GET"
    }
    
    let resultArr = []
    const response = await fetch(posUrl, options)
    const result = await response.json()
    const offset = result.offset
    
    for(let record of result.records){
        const companies = record.fields.company
        const inventory = record.fields.inventory
        if (companies && inventory > 0){
            resultArr.push(record)
        }
    }
    
    const nextResponse = await fetch(`${posUrl}&offset=${offset}`, options)
    const nextResult = await nextResponse.json()
    const newOffset = nextResult.offset
    
    for(let record of nextResult.records){
        const companies = record.fields.company
        const inventory = record.fields.inventory
        if (companies && inventory > 0){
            resultArr.push(record)
        }
    }
    
    const lastResponse = await fetch(`${posUrl}&offset=${newOffset}`, options)
    const lastResult = await lastResponse.json()
    
    for(let record of lastResult.records){
        const companies = record.fields.company
        const inventory = record.fields.inventory
        if (companies && inventory > 0){
            resultArr.push(record)
        }
    }
    
    return resultArr
}

function buildItem(item, wrapper){
    const { name, number, type, inventory} = item.fields
    const src = item.fields.image[0].url
    
    const resourceItem = createElTag('div','resource-item','')
    resourceItem.setAttribute('fs-cms-element','item')
    const resourceCardContent = createElTag('div','resource-card-content-main pos-item','')
    const resourceTopWrap = createElTag('div','resource-card-content_top','')
    const resourceImgWrap = createElTag('div','resource-image-wrapper','')
    const img = createImgTag('resource-image',name,src)
    const imgTextWrapper = createElTag('div','resource-image-text-wrapper','')
    const noImgText = createElTag('p','resource-image-message','No Image to Display')
    imgTextWrapper.append(noImgText)
    resourceImgWrap.append(img,imgTextWrapper)
    const title = createElTag('p','resource-title',name)
    title.setAttribute('fs-cmsfilter-field','title')
    resourceTopWrap.append(resourceImgWrap,title)
    const resourceBottomWrap = createElTag('div','resource-card-content_bottom','')
    const resourceInfoWrap = createElTag('div','resource-info-wrapper','')
    const resourceTypeWrap = createElTag('div','resource_type-wrapper pos-type')
    const resourceType = createElTag('p','resource-type',type)
    resourceType.setAttribute('fs-cmsfilter-field','type')
    resourceTypeWrap.append(resourceType)
    const resourceInvWrap = createElTag('div','resource_type-wrapper','')
    const inv = createElTag('p','resource-type',`${inventory} Left`)
    resourceInvWrap.append(inv)
    resourceInfoWrap.append(resourceTypeWrap,resourceInvWrap)
    const resourceNum = createElTag('p','resource-number',number)
    resourceNum.setAttribute('fs-cmsfilter-field','number')
    resourceBottomWrap.append(resourceInfoWrap,resourceNum)
    const addBtn = createElTag('button','resource-card_add-btn','+')
    addBtn.setAttribute('aria-label',`Add ${name} to cart form`)
    resourceCardContent.append(resourceTopWrap,resourceBottomWrap,addBtn)
    resourceItem.append(resourceCardContent)
    
    wrapper.append(resourceItem)
}

const initializeBronco = async () => {
    const arr = await getAirtable()
    const filteredArr = arr.filter(item => item.fields.company.includes('Bronco'))
    emptyList()
    for(let item of filteredArr){
        buildItem(item, wrapperEl)
    }
}

const initializeClassic = async () => {
    const arr = await getAirtable()
    const filteredArr = arr.filter(item => item.fields.company.includes('Classic'))
    emptyList()
    for(let item of filteredArr){
        buildItem(item, wrapperEl)
    }
}

initializeClassic()
