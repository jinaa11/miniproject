// #div class train-top button hover jqeuery
$(document).ready(function(){
    $(".train-top button").hover(function(){
        $(this).css("background-color", "lightblue");
    }, function(){
        $(this).css("background-color", "white");
    });
});