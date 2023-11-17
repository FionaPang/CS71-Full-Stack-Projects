// 1. get all the relative dom elements to use for rendering
//2. fetch pictures from backend
//3. render them
let objs = {
    body: null,
    inputCity: null,
    btnSearch:null,
    carousel:null
}
console.log('js connected')
//access key from unsplash
const unsplashKey = 'zqgdN-0FzhLbm3wdfF6lZHjDwDUZvFNsUD44PF3EOd8'
//get dom
objs.body = document.querySelector('body')
objs.inputCity = document.querySelector('.searchBar input')
objs.btnSearch = document.querySelector('.searchBar button')
objs.carousel= document.querySelector('.carousel')

//function to fetch data after user input
//1. fetch
//trim() is used to clean out invalid input like ; or space, then tolowerCase is used to set all to lowercase
// set a condition --> if user only input space and no character, set default pic keyword to macbook
// after using fetch, need to use .then() to consume data since fetch is a promise return
//convert to object with .json(), then you will receive another promise return, so use .then() again to get data
//making sure the fetch is good with print result in console and start render carousel
//2. render carousel by function renderImage(),
// inside renderImage(), we setup background image and use create carousel function
//create renderImage function and use it after fetch, but need to set condition to avoid error or invalid input

const fetchData = function() {
    //get input value
    const newCity = objs.inputCity.value.trim().toLowerCase() || 'macbook'//trim is used to filter invalid input style, and set all to lower case
    // fetch data
    fetch(`https://api.unsplash.com/search/photos?client_id=${unsplashKey}&query=${newCity}&orientation=landscape`)
        .then(response => response.json()) //get all data from response and convert it to json, which is another promise, need .then again
        .then(data => {
            console.log('data fetch:', data)
            //create carousel
            console.log('data raw', data) // while developing, this is used for debug or show log to superviser. but all the log has to be deleted before open to public
            //use renderImages function, function is written seperatly
            //if () -- a condition could be set here to tolerance error before rendering
            renderImages(data.results)

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


const createCarousel = function (arrImages) {
    for (let i = 0; i< arrImages.length; i++) {
        let item = document.createElement('div') //create an element
        item.className = 'imgContainer'  //create a class for styling, and define properties in css file
        const img = arrImages[i].urls.regular
        item.style.background = `url('${img}') no-repeat center center fixed` // can loot it up by google "css background"
        item.dataset.index = i
        objs.carousel.appendChild(item) // add it to html
        item.addEventListener('click', function(evt){ console.log('clicked...')})
    }
}
fetchData()

console.log('over')