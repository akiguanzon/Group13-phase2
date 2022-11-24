function leftScroll() {
    const left = document.querySelector(".scrolling-wrapper");
    left.scrollBy(-500, 0);
}
function rightScroll() {
    const right = document.querySelector(".scrolling-wrapper");
    right.scrollBy(500, 0);
}

function leftScroll2() {
    const left = document.querySelector("#scrolling-wrapper-latest");
    left.scrollBy(-500, 0);
}
function rightScroll2() {
    const right = document.querySelector("#scrolling-wrapper-latest");
    right.scrollBy(500, 0);
}


$(function () {
    var scrollLeftPrev = 0;
    $('#scrolling-wrapper').scroll(function () {
        // console.log($('#scrollquestion').width());
        // console.log($('#scrollquestion').scrollLeft());
        var $elem = $('#scrolling-wrapper');
        var newScrollLeft = $elem.scrollLeft(),
            width = $elem.outerWidth(),
            scrollWidth = $elem.get(0).scrollWidth;
        if (scrollWidth - newScrollLeft == width) {
            document.querySelector('#featured-right').classList.add('button-gone');
        }
        else {
            document.querySelector('#featured-right').classList.remove('button-gone');
        }
        if (newScrollLeft === 0) {
            document.querySelector('#featured-left').classList.add('button-gone');
        }
        else {
            document.querySelector('#featured-left').classList.remove('button-gone');
        }

        scrollLeftPrev = newScrollLeft;
    });
});

$(function () {
    var scrollLeftPrev = 0;
    $('#scrolling-wrapper-latest').scroll(function () {
        // console.log($('#scrollquestion').width());
        // console.log($('#scrollquestion').scrollLeft());
        var $elem = $('#scrolling-wrapper-latest');
        var newScrollLeft = $elem.scrollLeft(),
            width = $elem.outerWidth(),
            scrollWidth = $elem.get(0).scrollWidth;
        if (scrollWidth - newScrollLeft == width) {
            document.querySelector('#latest-right').classList.add('button-gone');
        }
        else {
            document.querySelector('#latest-right').classList.remove('button-gone');
        }
        if (newScrollLeft === 0) {
            document.querySelector('#latest-left').classList.add('button-gone');
        }
        else {
            document.querySelector('#latest-left').classList.remove('button-gone');
        }

        scrollLeftPrev = newScrollLeft;
    });
});

ScrollReveal().reveal('.featured-post', { delay: 100 })
ScrollReveal().reveal('.scroll-case', { delay: 100 })
ScrollReveal().reveal('.box-divider', { delay: 100 })

function viewPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}