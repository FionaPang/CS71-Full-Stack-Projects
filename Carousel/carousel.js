const imgs = [
    'https://mobilecontent.costco.com/live/resource/img/ca-homepage/d-hero-231106-furniture-en.jpg',
    'https://mobilecontent.costco.com/live/resource/img/ca-homepage/d-hero-231107-macbookpro-en.jpg',
    'https://mobilecontent.costco.com/live/resource/img/ca-homepage/d-hero-231106-bridgestone-en.jpg',
    'https://mobilecontent.costco.com/live/resource/img/ca-homepage/d-hero-231106-cubeit-en.jpg',
    'https://mobilecontent.costco.com/live/resource/img/ca-homepage/d-hero-231106-appliances-en.jpg',
]
const desc = [
    'Furniture',
    'iMacs',
    'Tires',
    'Moving',
    'Appliances',
]
console.log('connected')

const data = {
    imgs: imgs,
    desc: desc,
    index: 0,
    timerID: null,
    arrButtons : []
}

const objs = {
    img: document.querySelector('.carousel img'),
    btnBar: document.querySelector('.carousel .btnBar'),
    navPrev : document.querySelector('.btnNav.prev'),
    navNext : document.querySelector('.btnNav.next'),

}

const cbClick = function (evt) {

    let {imgid} = evt.target.dataset
    imgid = Number(imgid)
    objs.img.src = data.imgs[imgid]
    console.log('type of imgid', typeof(imgid))

}

const timerHandler = function() {
    data.index++
    console.log('timer handler index ', data.index)
    if(data.index === data.imgs.length) {
        data.index = 0
    }
   update(data.index)

    
}
const startAnimate = function () {
    data.timerID = setInterval(timerHandler, 2000)
}

const stopAnimate = function () {
    if (data.timerID) {
        clearInterval(data.timerID)
        data.timerID = null
    }
}

const updatedSelected = function(index) {
    data.arrButtons.forEach(function (ele, inx) {
        ele.className = ''
        if(inx === index) {
            data.arrButtons[index].className = 'btnSelected'
        }
        }
    )
}

const cbMouseEnter = function(evt) {
    stopAnimate()
}

const cbMouseLeave = function (evt) {
    startAnimate()
}

const update = function (index) {
    updatedSelected(index)
    objs.img.src = data.imgs[index]
}

const cbPagePrev = function(evnt) {
    if (data.index > 0) {
        data.index --
        update(data.index)
    }
}

const cbPageNext = function(evnt) {
    if (data.index < data.imgs.length -1) {
        data.index ++
        update(data.index)
    }
}

const createCarousel = function() {
    objs.img.src = data.imgs[data.index]
    objs.img.addEventListener('mouseenter', cbMouseEnter)
    objs.img.addEventListener('mouseleave', cbMouseLeave)
    objs.navPrev.addEventListener('click', cbPagePrev)
    objs.navNext.addEventListener('click', cbPageNext)

    for (let i = 0; i < imgs.length; i++) {
        let eleBtn = document.createElement('button')
        eleBtn.innerText = data.desc[i]
        eleBtn.dataset.imgid = i
        eleBtn.addEventListener('click', cbClick)
        objs.btnBar.appendChild(eleBtn)
        data.arrButtons.push(eleBtn)
        if (i === data.index) {
            updatedSelected(i)
        }
    }
}

createCarousel()
startAnimate()







