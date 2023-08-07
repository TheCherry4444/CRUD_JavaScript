
window.addEventListener('DOMContentLoaded', function () {

    var aboveHeight = document.querySelector('p').offsetTop;
    var navbar = document.getElementById('main-nav');

    window.addEventListener('scroll', function () {


        if (window.scrollY >= aboveHeight) {

            navbar.style.position = 'fixed';


        } else {

            navbar.style.position = 'relative';

        }
    });
});