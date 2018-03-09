function callback(data) {
    let parsedData = JSON.parse(data.responseText); // válaszüzenet a paraméterben (JSON fájl tartalma)
    console.log(parsedData);
    let moviesObj = parsedData.movies; //selecting movies object in parsedData
    console.log('Lefutott a callback');
    //function starters here

    sortMoviesByTitle(moviesObj);
    editCategoryName(moviesObj);
    displayMoviesAll(moviesObj);

    document.getElementById('search').addEventListener('click', function () {
        searchForMovie(moviesObj);
    });
    document.getElementById('delete').addEventListener('click', function () {
        deleteMovies(moviesObj);
    });



    sumMoviesLength(moviesObj);
    countMoviesOfActors(moviesObj);
    countCategories(moviesObj);


}

function ajaxReq(method, url) { //.open-től kapja a metódust és url-t
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {  //eseményfigyelő, amikor megváltozott az állapota
        switch (xmlhttp.readyState) {            //readyState 0-4-ig ad vissza eredményt az alábbiak alapján
            case 0: console.log("A kérelem nem inicializált");
                break;
            case 1: console.log('A kapcsolat létrejött');
                break;
            case 2: console.log('A kérelem feldolgozva');
                break;
            case 3: console.log('A kérelem feldolgozása folyamatban');
                break;
            case 4: console.log('A kérelem feldolgozva, válasz kész');  // ez a case a lényeg, a többi csak magunknak ellenőrzés
                if (xmlhttp.status == 200) {         //200-as kód: siker
                    callback(xmlhttp);              //minden rendben - meghívjuk a callback-et
                }
                else {
                    console.log('Hiba: ' + xmlhttp.status);     //statusban 300, 303 << kliens hibák, 400, 404-es hibák stb.
                }
                break;
            default: console.log('Súlyos hiba');
        }
    }
    //xmlhttp.open(method, url[, async, user, password])
    xmlhttp.open('GET', url);  // ajaxReq-nek küldjük metódust és url-t
    xmlhttp.send();
}

ajaxReq('GET', '../json/movies.json');

// ------------------------------ 2. Sort by Title ---------------------------------------------------------

function sortMoviesByTitle(data) {
    data.sort(function (a, b) {
        var titleA = a.title.toLowerCase();
        var titleB = b.title.toLowerCase();
        if (titleA < titleB) {
            return -1;
        }
        if (titleA > titleB) {
            return 1;
        }

        return 0;
    });
    console.log(data);

    //characterLister(data);  //userDatas továbbadása characterLister-nek
}
/*
//nem teljesen jó még
function editCategoryName(data) {
    for (let k in data) {
        for (let key in data[k].categories){
            data[k].categories[key] = data[k].categories[key].toUpperCase();
        }
    }
    console.log(data);

}*/
// ---------------------------- 3. Capitalize category names -------------------------------
function editCategoryName(data) {
    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
    for (let k in data) {
        for (let key in data[k].categories) {
            data[k].categories[key] = data[k].categories[key].capitalize();
        }
    }
    console.log(data);

}

// ---------------------- 4. Display Movies -------------------------------------

function displayMoviesAll(data) {
    const movieDivOpen = `<div class="movieDiv">`;
    const divClose = "</div>";
    let displayAll = "";
    let title = "";
    let picture = "";
    let time = "";
    let year = "";
    let categories = "";
    let directors = [];
    let cast = [];

    for (let k in data) {
        picture = `<img src="./img/covers/${formatStringToFilename(data[k].title)}.jpg"></img>`;
        title = `<p>Cím<br><span class="title">${data[k].title}<span></p>`;
        time = `<span class="time">Hossz: ${data[k].timeInMinutes} perc</span>`;
        year = `<span class="year">Premier: ${data[k].premierYear}</span>`;
        categories = pushCategories(data, k, 'categories');
        directors = pushCategories(data, k, 'directors');
        //cast = pushCategories(data,k,'cast', 'name');

        displayAll += `${movieDivOpen}<div class="outerDiv">${title}${picture}<div class="dataDisp">
        ${time}<br>${year}<br>Kategória: ${categories}<br>Rendező: ${directors}</div></div>`;
        displayAll += `${displayCast(data[k].cast)}${divClose}`;
    }
    document.getElementsByClassName('mainContainer')[0].innerHTML = displayAll;
}

function pushCategories(data, index, key) {
    let categories = [];
    for (let i in data[index][key]) {
        categories.push(data[index][key][i]);
    }
    return categories.join(', ');
}




// ----------------------- Get filename from name ----------------------
function formatStringToFilename(str) {
    const hunChars = {
        á: 'a',
        é: 'e',
        í: 'i',
        ó: 'o',
        ú: 'u',
        ö: 'o',
        ő: 'o',
        ü: 'u',
        ű: 'u'
    }
    str = str.toLocaleLowerCase()
        .replace(/[\?:;,\.\+\*\&\']/g, '') //removing special characters
        .replace(/[áéíóúöőüű]/g, char => hunChars[char])  //function (char) {hunChars[char]}
        .replace(/[ -]+/g, '-');

    return str;
}
//---------------

function displayCast(cast) {
    let castAll = "";
    for (let k in cast) {
        castAll += `<div class="castDisplay"><img class="actorImg" src="/img/actors/${formatStringToFilename(cast[k].name)}.jpg">`;
        castAll += `<div><p><span class="castName1">${cast[k].name} </span><br> (${cast[k].characterName})</p>`;
        castAll += `<p>Szül.: ${cast[k].birthYear}, ${cast[k].birthCountry}</p></div></div>`;
    }
    return castAll;
}
//----------

//------------------------ SEARCHING -------------------------------

function searchForMovie(data) {
    let searchType = document.getElementById('userSelect').value.toLowerCase();
    let userInput = document.getElementById('inputBox').value.toLowerCase();

    let filteredData = [];
    switch (searchType) {
        case 'title':
            for (let k in data) {
                if (data[k][searchType].toLowerCase().indexOf(userInput) > -1) {
                    filteredData.push(data[k]);
                }
            }
            break;
        case 'directors':
            for (let k in data) {
                for (let i in data[k][searchType]) {
                    if (data[k][searchType][i].toLowerCase().indexOf(userInput) > -1) {
                        filteredData.push(data[k]);
                        break;
                    }
                }
            }
            break;
        case 'cast':
            for (let k in data) {
                for (let i in data[k][searchType]) {
                    if (data[k][searchType][i].name.toLowerCase().indexOf(userInput) > -1) { //.name
                        filteredData.push(data[k]);
                        break;
                    }
                }
            }
            break;

    }
    displayMoviesAll(filteredData);
}

// STATISTICS ---------------------------

function sumMoviesLength(data) {
    let sum = 0;
    for (let k in data) {
        sum += parseInt(data[k].timeInMinutes);
    }
    sum /= 60;
    let avg = sum / data.length;
    sum = sum.toFixed(2);
    avg = avg.toFixed(2);

    document.getElementById('sumLength').innerHTML = `Filmek hossza összesen: <strong>${sum}</strong> óra`;
    document.getElementById('avgLength').innerHTML = `Filmek hossza átlagosan: <strong>${avg}</strong> óra`;


}

//---------------------------

function countMoviesOfActors(data) {
    let movieMap = new Map()
    for (let i = 0; i < data.length; i++) {
        for (let k in data[i].cast) {
            if (movieMap.has(data[i].cast[k].name)) {
                let currentValue = movieMap.get(data[i].cast[k].name);
                movieMap.set(data[i].cast[k].name, currentValue + 1);

            } else {
                movieMap.set(data[i].cast[k].name, 1);

            }
        }
    }
    for (let i of movieMap) {
        document.getElementById('actorList').innerHTML +=
            (`<p class="actorListPara">${i[0]}: ${i[1]} film <p>`);
    }
}

//------------------

function countCategories(data) {
    let categoryMap = new Map()
    for (let i = 0; i < data.length; i++) {
        for (let k = 0; k < data[i].categories.length; k++) {
            if (categoryMap.has(data[i].categories[k])) {
                let currentValue = categoryMap.get(data[i].categories[k]);
                categoryMap.set(data[i].categories[k], currentValue + 1);

            } else {
                categoryMap.set(data[i].categories[k], 1);

            }
        }
    }
    for (let i of categoryMap) {
        document.getElementById('category').innerHTML +=
            (`<p>${i[0]}: ${i[1]} db <p>`);
    }
}

//-------------------

/*function deleteMovies(data) {
    for (let k in data) {
        if (data.premierYear < 1990) {
            data[k].
        }
    }
}*/