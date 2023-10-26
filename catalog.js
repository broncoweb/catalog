const wrapperEl = document.getElementById('pos-wrapper')
const url = 'https://api.airtable.com/v0'
const posToken = 'patLkaQGaci95XsiP.3856171d1bcdcd1c788c364c20605239f3cf114daa5052055c4b92addf0ce8bd'
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

    resultArr.sort((a,b) => {
        const nameA = a.fields.name.toUpperCase()
        const nameB = b.fields.name.toUpperCase()
        
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
    })
    
    return resultArr
}

function buildItem(item, wrapper){
    const { name, number, type, inventory} = item.fields
    const src = item.fields.image[0].url
    
    const resourceItem = createElTag('div','resource-item','')
    resourceItem.setAttribute('fs-cms-element','item')
    resourceItem.setAttribute('w-el-list-display','block')
    const resourceCard = createElTag('div','resource-card','')
    const resourceCardContent = createElTag('div','resource-card-content-main pos-item','')
    const resourceTopWrap = createElTag('div','resource-card-content_top','')
    const resourceImgWrap = createElTag('div','resource-image-wrapper','')
    const img = createImgTag('resource-image',name,src)
    const imgTextWrapper = createElTag('div','resource-image-text-wrapper','')
    const noImgText = createElTag('p','resource-image-message','No Image to Display')
    if(src){
        imgTextWrapper.classList.add('display-none')
    } else {
        img.classList.add('display-none')
    }
    imgTextWrapper.append(noImgText)
    resourceImgWrap.append(img,imgTextWrapper)
    const title = createElTag('p','resource-title',name)
    title.setAttribute('fs-cmsfilter-field','Title')
    title.setAttribute('w-el-text','Title')
    resourceTopWrap.append(resourceImgWrap,title)
    const resourceBottomWrap = createElTag('div','resource-card-content_bottom','')
    const resourceInfoWrap = createElTag('div','resource-info-wrapper','')
    const resourceTypeWrap = createElTag('div','resource_type-wrapper pos-type')
    const resourceType = createElTag('p','resource-type',type)
    resourceType.setAttribute('fs-cmsfilter-field','Type')
    resourceType.setAttribute('w-el-text','Type')
    resourceTypeWrap.append(resourceType)
    const resourceInvWrap = createElTag('div','resource_type-wrapper','')
    const inv = createElTag('p','resource-type',`${inventory} Left`)
    resourceInvWrap.append(inv)
    resourceInfoWrap.append(resourceTypeWrap,resourceInvWrap)
    const resourceNum = createElTag('p','resource-number',number)
    resourceNum.setAttribute('fs-cmsfilter-field','Number')
    resourceNum.setAttribute('w-el-text',number)
    resourceBottomWrap.append(resourceInfoWrap,resourceNum)
    const addBtn = createElTag('button','resource-card_add-btn w-button','+')
    addBtn.setAttribute('aria-label',`Add ${name} to cart form`)
    resourceCardContent.append(resourceTopWrap,resourceBottomWrap,addBtn)
    resourceCard.append(resourceCardContent)
    resourceItem.append(resourceCard)
    
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
