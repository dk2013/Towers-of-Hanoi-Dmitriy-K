//////////// Actions ////////////
// 1 - move rim from col1 to col2
// 2 - move rim from col1 to col3
// 3 - move rim from col2 to col1
// 4 - move rim from col2 to col3
// 5 - move rim from col3 to col1
// 6 - move rim from col3 to col2
/////////////////////////////////
var initialRims = [
    [1,2,3,4,5,6,7,8],
    [],
    []
];
var currentRims = []; // current rims positions for drawing
var actionTree = [];
/*
actionTree.prototype.addNode = function(node) {
}
*/

/*
var node = { // node is one action
    availableActions : {}, // children nodes
    parent : null,
    action : null
};
*/
var currentNode = null;
var direction = 'forward'; // or backward

function node(action) { // node is one action
    this.availableActions = [], // children nodes
    this.parent = null,
    this.action = action;
}
$( document ).ready(function() {
    init();
    $( '.next' ).on( "click", function() {
        // console.log('next');
        routine();
    })
});

var routine = () => {
    //console.log(rims);
    if(direction == 'forward') {

    }
    if(currentNode.availableActions.le)

    drawRims();
}

var init = () => {
    currentRims = initialRims;
    currentNode = new node(null);
    // Push root node to tree
    actionTree.push(currentNode);
    console.log(actionTree);
    drawRims();
}

var drawRims = () => {
    $("#col1, #col2, #col3").find('div').remove();
    currentRims.forEach(function (value, index) {
        if(Array.isArray(value)) {
            value.forEach(function (v, i) {
                //console.log(i, v);
                $('#col' + (index + 1)).append('<div id="rim' + v + '" class="rim">' + v + '</div>');
            })
        }
    })
}