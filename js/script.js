//////////// Actions ////////////
// 1 - move rim from col1 to col2
// 2 - move rim from col1 to col3
// 3 - move rim from col2 to col1
// 4 - move rim from col2 to col3
// 5 - move rim from col3 to col1
// 6 - move rim from col3 to col2
/////////////////////////////////
//var allAvailableActions = 6;
var initialRims = [
    [1,2,3,4,5,6,7,8],
    [],
    []
];
var currentRims = []; // current rims positions for drawing
var actionTree = [];
var turn; // number of turn. 0 - is start position
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
var currentNode;
var direction; // forward or backward
var currentAvailableActions = []; // Actions available for current node (Reverse action isn't available)
function node(action) { // node is one action
    this.availableActions = [], // children nodes
    this.parent = null,
    this.action = action;
}
$( document ).ready(function() {
    init();
    $( '.next' ).on( "click", function() {
        // console.log('next');
        if(routine()) {
            alert ("Congratulations! You've resolved the puzzle!");
            return;
        }
    })
});

var routine = () => {
    // Increase turn
    turn++;
    console.log('--- TURN: ' + turn + ' ---');
    var previousAction = currentNode.action;
    console.log('Prev action: ' + previousAction);
    if(direction == 'forward') {
        // Need to get actions availability (first time or returned from dead end branch)
        console.log("Need to get actions availability");
        getActionsAvailability();
        removeReverseAction(previousAction);
        // if there are children go there
        // if no move back
    } else if (direction == 'backward') {
        // Mark node that we returned as dead end


        // If the array with available actions (clildren) is not empty,
        // proceed traversal 
        if(Array.isArray(currentNode.availableActions) && currentNode.availableActions.length) {
            // Not first checking of this node
            console.log("Not first checking of this node");
            // move forw
        } else {
            // Need to proceed go backward to parent node
            console.log("Need to proceed go backward to parent node");
            //move back
        }
    }
    
    drawRims();

    if(checkIsSuccess()) {
        return true;
    }

    return false;
}

var init = () => {
    currentRims = initialRims;
    currentNode = new node(null);
    turn = 0;
    direction = 'forward';
    currentAvailableActions = [];
    actionTree.push(currentNode); // Push root node to tree
    console.log(actionTree);
    drawRims();
}

var getActionsAvailability = () => {
    var col1 = currentRims[0];
    var top1 = col1[col1.length - 1];
    if(typeof top1 === 'undefined') {
        top1 = 0;
    }
    var col2 = currentRims[1];
    var top2 = col2[col2.length - 1];
    if(typeof top2 === 'undefined') {
        top2 = 0;
    }
    var col3 = currentRims[2];
    var top3 = col3[col3.length - 1];
    if(typeof top3 === 'undefined') {
        top3 = 0;
    }
    //console.log(currentRims, top1, top2, top3);

    if(top1 > top2) {
        currentAvailableActions.push(1);
    }
    if(top1 > top3) {
        currentAvailableActions.push(2);
    }
    if(top2 > top1) {
        currentAvailableActions.push(3);
    }
    if(top2 > top3) {
        currentAvailableActions.push(4);
    }
    if(top3 > top1) {
        currentAvailableActions.push(5);
    }
    if(top3 > top2) {
        currentAvailableActions.push(6);
    }
}

var removeReverseAction = (reverseAction) => {
    currentAvailableActions.splice(currentAvailableActions.indexOf(reverseAction), 1);
}

var checkIsSuccess = () => {
    var column = 0;
    if(currentRims[1].length == initialRims[0].length) {
        column = 1;
    }
    if(currentRims[2].length == initialRims[0].length) {
        column = 2;
    }
    if(column == 0) {
        // Not all rims are on one column
        return false;
    }
    for(var i = 1; i <= initialRims[0].length; i++) {
        if(currentRims[column][i] != initialRims[0][i]) {
            // gotten not equal element it is not solution
            return false;
        }
    }

    // the end of array has reached and all elements are equal so it is proper solution
    return true;
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