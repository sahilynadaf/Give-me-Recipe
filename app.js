const searchFrom = document.querySelector('form');
const seachDivUI = document.querySelector('.search-result');
const continer = document.querySelector('.container');
const moreBtn = document.querySelector('.morebtn');
const previousBtn = document.querySelector('.previousbtn');
const countdown = document.querySelector('.countdown');
const alertDiv = document.querySelector('.alert');

let searchedRecipe = '';
const APP_ID = 'fe547a07';
const APP_KEY = '0b4674e4d7fc3b1de46a08dbfc87b593';

let from = 0;
let to = 6;
let count;
let requests = 5;

alertDiv.classList.add('Hide');

searchFrom.addEventListener('submit', e => {
    e.preventDefault();
    searchedRecipe = e.target.querySelector('input').value;
    fetchAPI(from, to);
    let startingTime = 60;
    let startInterval = setInterval(() => {
        startingTime--;
        if (startingTime < 0) {
            requests = 5;
            countdown.textContent = `Requests Per Min Left :  ${requests}`;
            alertDiv.classList.add('Hide');
            clearInterval(startInterval);
        }
    }, 1000)
})

async function fetchAPI(from, to) {
    requests--;
    countdown.textContent = `Requests Per Min Left :  ${requests}`;
    if (requests == 0) {
        alertMsg();
    }
    if (to >= count) {
        to = count;
    }
    if (from <= 0) {
        from = 0;
    }
    let baseUrl = `https://api.edamam.com/search?q=${searchedRecipe}&app_id=${APP_ID}&app_key=${APP_KEY}&from=${from}&to=${to}`;
    const response = await fetch(baseUrl);
    const data = await response.json();
    // console.log(data);
    count = data.count;
    // console.log(count);
    generateHTML(data.hits);
}

function generateHTML(results) {
    continer.classList.remove('initial');
    moreBtn.classList.remove('Hide');
    previousBtn.classList.remove('Hide');
    if (to >= count) {
        moreBtn.classList.add('Hide');
    }
    if (from <= 0) {
        previousBtn.classList.add('Hide');
    }

    let generatedHTML = ''
    if (results.length <= 0) {
        generatedHTML = '<h1 style="color:white">Oops , Nothing Found !!!</h1>'
    } else {
        results.forEach(result => {
            generatedHTML += `
            <div class="item">
                <img src="${result.recipe.image}">
                <div class="flex-container">
                    <h1 class='title'>${result.recipe.label}</h1>
                    <a href="${result.recipe.url}" class="view-button" target="_blank">View Recipe</a>
                </div>
                <p class="item-data">Calories : ${result.recipe.calories.toFixed(2)}</p>
                <p class="item-data">Diet Labels : ${result.recipe.dietLabels.length > 0 ? result.recipe.dietLabels : 'no data found'}</p>
                <p class="item-data">Health Labels : ${result.recipe.healthLabels}</p>
                <p class="item-data">Ingredients : ${result.recipe.ingredientLines}</p>
            </div>
        `
        });
    }
    seachDivUI.innerHTML = generatedHTML;

}

moreBtn.addEventListener('click', e => {
    e.preventDefault();
    from += 6;
    to += 6;
    fetchAPI(from, to);
    document.documentElement.scrollTop = 0;
    let startingTime = 60;
    let startInterval = setInterval(() => {
        startingTime--;
        if (startingTime < 0) {
            requests = 5;
            countdown.textContent = `Requests Per Min Left :  ${requests}`;
            alertDiv.classList.add('Hide');
            clearInterval(startInterval);
        }
    }, 1000)
})

previousBtn.addEventListener('click', e => {
    e.preventDefault();
    from -= 6;
    to -= 6;
    fetchAPI(from, to);
    document.documentElement.scrollTop = 0;
    let startingTime = 60;
    let startInterval = setInterval(() => {
        startingTime--;
        if (startingTime < 0) {
            requests = 5;
            countdown.textContent = `Requests Per Min Left :  ${requests}`;
            alertDiv.classList.add('Hide');
            clearInterval(startInterval);
        }
    }, 1000)
})

function alertMsg() {
    countdown.classList.add('Hide');
    alertDiv.classList.remove('Hide');
    let time = 60;
    let interval = setInterval(() => {
        time--;
        if (time <= 0) {
            clearInterval(interval);
            alertDiv.classList.add('Hide');
            countdown.classList.remove('Hide');
            requests = 5;
            countdown.textContent = `Requests Per Min Left :  ${requests}`;
            return;
        } else {
            alertDiv.textContent = `Please Wait For ${time} seconds`;
        }
    }, 1000);
}