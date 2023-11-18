// 1. get all the relative dom elements to use for rendering
//2. fetch pictures from backend
//3. render them
let objs = {
    body: null,
    inputCity: null,
    btnSearch:null,
    carousel:null,
    preUrl:null, // this variable is used to save the previous url while 'mouseenter' event happened(temp. changed background img)
                  // and then it can be used in the mouseleave event to change the background back to the previous img

    btnPrev:null,
    btnNext:null,
    page: {
        cursor:1,
        total: 1
    }
}

console.log('js connected')
//access key from unsplash
const unsplashKey = 'zqgdN-0FzhLbm3wdfF6lZHjDwDUZvFNsUD44PF3EOd8'
const strClassSelected = 'selected'  // since we used class.Name = 'selected' in many places, we can assign it to a variable

//get dom
objs.body = document.querySelector('body')
objs.inputCity = document.querySelector('.searchBar input')
objs.btnSearch = document.querySelector('.searchBar button')
objs.carousel= document.querySelector('.gallery')
objs.btnPrev= document.querySelector('.btnNac.prev')
objs.btnNext= document.querySelector('.btnNav.next')

//function to fetch data after user input
//1. fetch
//trim() is used to clean out invalid input like ; or space, then tolowerCase() is used to set all to lowercase
// set a condition --> if user only input space and no character, set default pic keyword to macbook
// after using fetch, need to use .then() to consume data since fetch is a promise return
//convert to object with .json(), then you will receive another promise return, so use .then() again to get data
//making sure the fetch is good with print result in console and start render carousel
//2. render carousel by function renderImage(),
// inside renderImage(), we setup background image and use create carousel function
//create renderImage function and use it after fetch, but need to set condition to avoid error or invalid input

// setKeyEvent function is used to set events relates to key, it is used in the fetchData function

const cbInput = function (evt) {
    //input keyup event to trigger fetch while user pressed enter key instead of click search button (2nd way to search)
    if (evt.key === 'Enter' && objs.inputCity.value.trim().length) {
        fetchData()
        console.log('good!')
    }
}
const setKeyEvent = function () {
    // we can add more key event here...
    objs.body.addEventListener('keyup', function(evt) {
        if(evt.key === 'ArrowLeft') {
            prevPage()
        }
        if(evt.key === 'ArrowRight') {
            nextPage()
        }
    })

    let arrEle = [objs.inputCity, objs.btnPrev, objs.btnNext]
    let evtName =  ['keyup','click', 'click']
    let arrCB = [cbInput,prevPage, nextPage]

    arrEle.forEach(function(ele,index) {
        ele.addEventListener(evtName[index],arrCB[index])
    })
}


const prevPage= function () {
    if(objs.page.cursor >1) {
        objs.page.cursor--
        fetchData()
    }
}

const nextPage= function () {
    if(objs.page.cursor < objs.page.total) {
        objs.page.cursor++
        fetchData()
    }


}

const fetchData = function() {
    //get input value
    const newCity = objs.inputCity.value.trim().toLowerCase() || 'macbook'//trim is used to filter invalid input style, and set all to lower case
    // fetch data
    fetch(`https://api.unsplash.com/search/photos?client_id=${unsplashKey}&query=${newCity}&orientation=landscape&page=${objs.page.cursor}`)
        .then(response => response.json()) //get all data from response and convert it to json, which is another promise, need .then again
        .then(data => {
            console.log('data fetch:', data)
            //create carousel
            console.log('data raw', data) // while developing, this is used for debug or show log to supervisor. but all the log has to be deleted before open to public
            //use renderImages function, function is written separately
            //if () -- a condition could be set here to tolerance error before rendering
            renderImages(data.results)
            objs.page.total = data.total_pages
        })

}

//after getting image data from fetch, pass it to renderImage function
// set the background with the 1st image of the image array
//pass  image array data to creatCarousel function
const renderImages = function (arrImages) {
    //1.set background image with the new data
    //get the url of the 1st image from the array, and set it to full image, store to variable img
    //an advantage of setting a variable img is when you have to use the same thing over and over again, you can use update once if the source
    //need to be changed, for ex, in future if array data is no longer obtained from url, and need to be changed to src, then you just need to change the variable
    const img = arrImages[0].urls.full
    objs.body.style.background = `url('${img}') no-repeat center center fixed` // update all properties of background image


    //2. pass the image array ftp
    createCarousel(arrImages)
}

// a function used inside the createCarousel function for background update with each click on carousel item
const updateBackgroundImage = function (url) {
    objs.body.style.background = `url('${url}') no-repeat center center fixed`
    console.log('image updated')
}

// function used to highlight the clicked img, used in click event function
// since we have initially set the 1st img to background, so we also need to make sure
//the relative carousel item is already highlighted(this is done in the creatCarousel function)
const setImageSelected = function(eleImage) {
    //to clear the highlight
    let images = document.querySelectorAll('[data-index]')
    images.forEach(function (ele) {
        ele.className = ''
    })

    eleImage.className = strClassSelected // 'selected'
}

const createCarousel = function (arrImages) {
    // since we want to replace 10 pics each fetch, so we need to set initial carousel as null to clean up before next fetch
    objs.carousel.innerHTML = ''

    //create carousel item and style each item, then append it to html file
    for (let i = 0; i< arrImages.length; i++) {
        let item = document.createElement('div') //create an element
        // create a class for styling and define properties for all carousel item
        //set condition to make sure the 1st pic is highlighted
        if (i===0) {
            item.className = strClassSelected  //'selected'
        }

        const img = arrImages[i].urls.regular
        item.style.background = `url('${img}') no-repeat center center fixed ` // can loot it up by google "css background"
        item.dataset.index = i // assign index to each pic we fetched, which showed as data-index in the browser element property
        item.dataset.url = arrImages[i].urls.full // this is used in the updateBackgroundImage function, it matches the url with click event via index
        objs.carousel.appendChild(item) // add it to html. if we dont set initial innerHTML as null, it will keep adding 10 pics each fetch

        //add event to each carousel item so that we can update background image with each click on the carousel item
        item.addEventListener('click', function(evt){
            console.log('evt clicked', evt.target.dataset.url) // it is used to check what browser returned after event happened in the console (target -> dataset)
            updateBackgroundImage(evt.target.dataset.url)
            //then the img is clicked, highlight it out
            setImageSelected(evt.target)

        })
        // create mouse event for preview
        item.addEventListener('mouseenter', function(evt) {
            //when mouse hover the carousel item, temperately change the background
            let newUrl = evt.target.dataset.url
            if (!objs.preUrl) {  // when the value is null, it means the pic never updated
                //save the current img url before replacement
                let str = objs.body.style.background
                //console.log('str bkg:', str) --> it return url address with quotation marks around
                //therefore, use indexof() to look up the index position of quotation
                let iStart = str.indexOf('"');
                let iEnd = str.indexOf('"', iStart + 1);
                //then use slice() to cut out the url (to get rid of quotation marks)
                str = str.slice(iStart+1, iEnd)
                objs.reUrl = str  //save the previous url address to dom
                console.log('str substr bkg:', str)
                objs.preUrl = str
                updateBackgroundImage(newUrl)
            }

        })
        item.addEventListener('mouseleave', function(evt) {
            console.log('preUrl:', objs.preUrl)
            if(objs.preUrl ) {  // when preUrl is not null--> objs.preUrl!==null
                //recover to previous img after mouse leave the carousel item
                console.log('the preUrl is:', objs.preUrl)
                updateBackgroundImage(objs.preUrl)
                objs.preUrl = null  // after recover, also need to reset the preUrl as null
            }
        })
    }
}
fetchData()
setKeyEvent()
//when click search button, trigger fetchData function
objs.btnSearch.addEventListener('click', fetchData)