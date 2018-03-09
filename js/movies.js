function callback(data) {
    let parsedData = JSON.parse(data.responseText); // válaszüzenet a paraméterben (JSON fájl tartalma)
    console.log(parsedData);
    let moviesObj = parsedData.movies; //selecting movies object in parsedData
    console.log('Lefutott a callback');
    //function starters here
    
    sortMoviesByTitle(moviesObj);
    editCategoryName(moviesObj);
    displayMoviesAll(moviesObj);
   
    
    

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
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
for (let k in data) {
    for (let key in data[k].categories){
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
    let title="";
    let picture ='';
    for (let k in data) {
        picture = `<img src="./img/covers/${formatStringToFilename(data[k].title)}.jpg"></img>`;
        title = `<p>Cím<br><span class="title">${data[k].title}<span></p>`
        displayAll += `${movieDivOpen}${title}${picture}${divClose}`;
    }
    document.getElementsByClassName('mainContainer')[0].innerHTML = displayAll;
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