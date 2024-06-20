const clearBtn = document.querySelector('#button-addon1');
const searchBar = document.querySelector('#searchBar');
const searchBtn = document.querySelector('#button-addon2');
const form = document.querySelector('form');

clearBtn.addEventListener('click', function (e) {
    e.preventDefault();
    searchBar.value = "";
    form.submit();
});

searchBtn.addEventListener('click', function (e) {
    e.preventDefault();
    form.submit();
});
