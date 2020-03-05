var rims = [
    [1,2,3,4,5,6,7,8],
    [],
    []
]

$( document ).ready(function() {
    drawRims();
    $( '.next' ).on( "click", function() {
        // console.log('next');
        
        routine();
    })
});

var routine = () => {
    //console.log(rims);
    
}

var drawRims = () => {
    $("#col1, #col2, #col3").find('div').remove();
    rims.forEach(function (value, index) {
        if(Array.isArray(value)) {
            value.forEach(function (v, i) {
                console.log(i, v);
                $('#col' + (index + 1)).append('<div id="rim' + v + '" class="rim">' + v + '</div>');
            })
        }
    })
}