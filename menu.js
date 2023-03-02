window.addEventListener('load', generateMenu, false)

// för att lägga till fontAwesome 
document.querySelector('head').insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">')

var ref = document.querySelector('script')

// lite styling
let style = document.createElement('style')
style.innerHTML = `
    button{
        float: right
    }
    #addDiv {
        display: flex
    }
    #addDiv {
        flex-direction: column
    }
    .post {
        border: 1px solid #ccc
    }
    .post {
        border-radius: 5px
    }
    .post {
        margin-bottom: 5px
    }
    .post{
        padding: 5px
    }
    .post{
        box-shadow: 4px 2px #ccc
    }
    .checked {
        color: orange
    }
    #primarycontent > div:nth-child(1){
        flex-direction: column
    }
    .mine{
      border: 2px solid black
    }
`
ref.parentNode.insertBefore(style, ref)

// Lägga till scroll smooth
document.querySelector('html').style.scrollBehavior = 'smooth'

/* ################  variables  ################ */
const content = document.querySelector('#receptmeny > div')
const container = document.getElementById('primarycontainer')
// document fragment är snabbare för append inne i en loop
const df = new DocumentFragment()
const log = console.log
let receptTitleList = []
//
//
//
//
//
/* ################  functions  ################ */

//  fetch local data först 
function fetchLocalData () {
  // om det finns, lägg till den i dom
  if (localStorage) {
    for (let i = 0; i < localStorage.length; i++) {
      let title = localStorage.key(i)
      // jag lägger till recept_ till key för att skilja den från rating key
      if (title.substring(0, 7) == 'recept_') {
        let receptTitle = title.slice(7)
        let receptBody = localStorage.getItem(title)

        // skapa en div och lägg till titel och body av recept
        let newRecept = document.createElement('DIV')
        newRecept.setAttribute('class', 'post')
        newRecept.setAttribute('id', receptTitle)
        newRecept.classList.add('mine')
        newRecept.innerHTML = `
                      <h4>
                      ${receptTitle}
                      </h4>
                      <div class="contentarea">
                      <p>
                      ${receptBody}
                      </p>
                      </div>
                      `
        // append i df 
        df.appendChild(newRecept)
      }
    }
  // om localstorage är tom gör inget
  }else {
    log('no data stored yet')
  }

  // och nu append i dom 
  document.querySelector('#primarycontent').appendChild(df)
}

//  gör en lista av alla recepter i sidan
function getAllaRecept () {
  let alla_recept = Array.from(document.getElementById('primarycontent').children)
  return alla_recept
}

//  nu genera menyn 
function generateMenu () {
  // fetch local 
  fetchLocalData()

  // skapa element ul och ge en id
  const ul_list = document.createElement('UL')
  ul_list.setAttribute('id', 'receptList')

  // skapa en li element med länk till recept
  let alla_recept = getAllaRecept()

  // loop igenom alla recept och anropa genli för att skapa en 
  // li element med länk för menyn samt ge alla recept div en id
  alla_recept.forEach((recept, index) => {

    // skicak recept och index som argument
    genLi(recept, index)
  })

  // när loop är färdig, append df till ul_list
  ul_list.appendChild(df)

  // append ul_list till content så att den visas
  content.appendChild(ul_list)

  // nu hämta rating från localStorage om den finns
  fetchRatingData()
}

//  function generar li element med länk till varje post 
// denna funktion anropas en gång för att generera meny länkar 
// andra gång för att skapa länk för att visa i search function

function genLi (recept, index) {
  // spara receptTitle för varje recept
  let receptTitle = recept.children[0].innerText

  // skapa en id från recept titel
  let receptId = receptTitle.replace(/,/g, '').trim()
  receptId = receptId.replace(/\s+/g, '_').toLowerCase()

  // index är mindre än 0 skippa den nedre delen då funktionen har anropats från sök funktionen för att skapa en länk av den matchade ord
  // om index är positiv integer då funktionen har anropats från generatemeny
  // lägg en id till varje recept div i sidan 
  // sen skapa ratingstars och lägg till de vid titel till varje recept div
  if (index >= 0) {
    recept.setAttribute('id', receptId)

    receptTitleList.push(receptTitle)

    recept.children[0].innerHTML =
      `
      ${receptTitle}
    <span id="1" class="fa fa-star" onClick="rating(${index},1)"></span>
    <span id="2" class="fa fa-star" onClick="rating(${index},2)"></span>
    <span id="3" class="fa fa-star" onClick="rating(${index},3)"></span>
    <span id="4" class="fa fa-star" onClick="rating(${index},4)"></span>
    <span id="5" class="fa fa-star" onClick="rating(${index},5)"></span>
    `
  }

  // 
  // skapa en li element 
  const li_elm = document.createElement('LI')

  // skapa en link inne i el element med href till "recept titel id"
  let src = `#${receptId}`
  let Receptlink = `
  <a href="${src}" class="${receptId}"><h4>${receptTitle}</h4></a>`

  li_elm.innerHTML = Receptlink

  li_elm.addEventListener('click', highlight)

  // append den ny skapade el element till df
  df.appendChild(li_elm)

  // return df då den används i den funktion som anropat genli funktionen 
  return df
}

// fetch rating data från localstorage
function fetchRatingData () {
  // om det finns data i localstorage fetch och append i dom
  if (localStorage) {
    for (let i = 0; i < localStorage.length; i++) {
      let title = localStorage.key(i)
      // sparade rating har rating_ i början av key för att skiljas från recept key
      if (title.substring(0, 7) == 'rating_') {
        let rateTitle = title.slice(7)
        log(rateTitle)
        let stars = localStorage.getItem(title)
        log(stars)

        // anropa rating function och skicka div id och antal stars som argument
        rating(rateTitle, stars)
      }
    }
  }
}

//  anropa searchAddDiv för att skapa alla div och append i top of recept
searchAddDiv()

// för att markera recept div när man klickar på menylänk eller matchat ord från sök
function highlight () {
  document.querySelectorAll('.post').forEach(post => {
    post.style.background = ''
    post.style.color = 'black'
    post.childNodes[1].style.textAlign = 'left'
    post.style.paddingTop = ''
  post.style.paddingBottom = ''
  })
  let receptId = `#${this.children[0].className}`
  let post = document.querySelector(receptId)
  post.style.background = '#12343b'
  post.style.color = 'white'
  post.style.paddingTop = '4rem'
  post.style.paddingBottom = '2rem'
  post.childNodes[1].style.textAlign = 'center'
}

// skapa search div samt addrecept div här med alla delar input och button
function searchAddDiv () {
  const searchDiv = document.createElement('DIV')
  searchDiv.setAttribute('id', 'search')
  const searchInput = document.createElement('INPUT')
  searchInput.setAttribute('type', 'text')
  searchInput.placeholder = 'search...'
  const addBtn = document.createElement('button')
  addBtn.innerHTML = 'Add Recept'

  const addDiv = document.createElement('DIV')
  addDiv.setAttribute('id', 'addDiv')
  const titInput = document.createElement('INPUT')
  titInput.setAttribute('type', 'text')
  titInput.setAttribute('id', 'titInput')
  titInput.required = true
  titInput.placeholder = 'title...'

  const receptInput = document.createElement('TEXTAREA')
  receptInput.placeholder = 'recept text...\nUppdatera sidan efter publish,för att se din nya recept'
  receptInput.rows = '6'
  receptInput.setAttribute('id', 'receptInput')
  receptInput.required = true

  const pubBtn = document.createElement('button')
  pubBtn.innerHTML = 'Publish'

  pubBtn.addEventListener('click', addRecept)

  addDiv.style.transition = 'height 900ms ease-in-out;'
  // toggle om man klickar på add recept button och gömma den 
  addBtn.addEventListener('click', function () {
    if (addDiv.style.display === 'flex') {
      addDiv.style.display = 'none'
      addBtn.innerHTML = 'Add Recept'
      receptInput.value = ''
      titInput.value = ''
    }else {
      addDiv.style.display = 'flex'
      addBtn.innerHTML = 'Cancel'
    }
  })

  addDiv.appendChild(titInput)
  addDiv.appendChild(receptInput)
  addDiv.appendChild(pubBtn)
  addDiv.style.display = 'none'

  // prepend så att den hamnar högst upp ovanför alla recept 
  document.querySelector('#primarycontent').prepend(addDiv)

  // eventListener när man skriver ord i sök funktion den anropas display function som i sin tur anropar matcharray function 
  searchInput.addEventListener('keyup', display)

  const hittatDiv = document.createElement('DIV')
  hittatDiv.setAttribute('id', 'hittatDiv')

  searchDiv.appendChild(searchInput)
  searchDiv.appendChild(addBtn)
  searchDiv.appendChild(hittatDiv)

  // prepend searchDiv till top 
  container.prepend(searchDiv)
}

//
// matcharray för ord och recept list som argument och hittar match i recept listan
function matchArray (ord, alla_recept) {
  const regex = new RegExp(ord, 'gi')

  // filter skapar ny array av de matchat ord/recept och sparas i hittatMatch och returnerar 
  // den till display som i sin tur anropar genLi funktion för att skapa en li element med länk 
  let hittatMatch = alla_recept.filter(recept => recept.children[0].innerText.match(regex))
  let hittat = ''
  data.forEach((hittatMatch) => {
    let hittat = hittatMatch.replace(
      hittatMatch,
      `<span style="color:red">${regex}</span>`
    );
  return hittatMatch
})

}

//
// skapa en div element för att append alla hittade match i den div
function display () {
  let alla_recept = getAllaRecept()
  let hittat = matchArray(this.value, alla_recept)
  let hittatDiv = document.getElementById('hittatDiv')
  // först tom lista av hittade match om man raderar ord i sok input
  if (this.value.length === 0) {
    hittat = ''
  }

  // sen tomma div innerhtml så den försvinner
  hittatDiv.innerHTML = ''
  let ul_list = document.createElement('UL')
  ul_list.setAttribute('id', 'soktList')

  // för varje hittade match anropas genLi så den skapar li element med en länk
  hittat.forEach((recept) => {
    genLi(recept, -1)
  })

  ul_list.appendChild(df)
  hittatDiv.appendChild(ul_list)
}

//
// funktiona för att spara rating information i local storage
function addRating (id, i) {
  let ratingTitle = `rating_${id}`

  localStorage.setItem(`${ratingTitle}`, `${i}`)
}

// add recept funktion som anropas när man klickar på publish button 
// funktionen sparar nya receptet i local storage
// om input field är inte tomma
function addRecept () {
  let receptTitle = document.getElementById('titInput').value.toLowerCase()
  receptTitle = receptTitle.replace(' ', '-')
  receptTitle = `recept_${receptTitle}`
  let receptText = document.getElementById('receptInput').value

  if (receptTitle === '' || receptText === '') {
    alert('Please fill in the input')
  }else if (receptTitle === '' && receptText === '') {
    alert('Please fill in the input')
  }else {
    localStorage.setItem(`${receptTitle}`, `${receptText}`)
    document.querySelector('#search > button').click()
  }
}

// ratingstar
// funktionen först anropas när sidan laddas upp då andra funktion hämtar
//  rating info från local storage. i det fallet skickas recept div id som argument
// andra gång när man klickar på rating. i det fallet skickas recept div index som id
function rating (id, i) {
  let titles = getAllaRecept()
  let rated_title = ''

  // om funktionen anropas från klicking på ratingstars då hämta recept div id
  if (typeof (id) === 'number') {
    rated_title = titles[id].id
    log(typeof (rated_title))
  }
  // om funktionen anropas från fetchRatingData (localstorage)
  // då använd id som recept div id
  else if (typeof (id) === 'string') {
    rated_title = id
  }

  // spara alla 5 stars span i stars
  let stars = document.querySelectorAll(`#${rated_title} > h4 > span`)

  // först nolla/radera rating
  stars.forEach(star => star.classList.remove('checked'))
  log(stars)

  // sen uppdatera rating med ny info argument "i"
  for (let x = 0; x < i; x++) {
    stars[x].classList.add('checked')
  }

  // kontrollera att i är integer och sen spara/uppdatera den i local storage
  if (typeof (i) === 'number') {
    addRating(rated_title, i)
  }
}
