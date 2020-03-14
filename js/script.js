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
// var currentAvailableActions = []; 
function node(action) { // node is one action
    // Actions available for current node (Reverse action isn't available) - children nodes 
    this.availableActions = {}, 
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
    //var currentAction = currentNode.action;
    console.log('Prev action: ' + currentNode.action);

    // If the array with available actions (clildren) is not empty,
    // proceed traversal 
    if(Object.keys(currentNode.availableActions).length > 0) {
 
        //console.log("Not first checking of this node");
        // move forw
    } else {
           
        
    }
    // if there are children go to first child
    // if no move back
    getDirection();
    console.log(direction);
    
    

    if(direction == 'forward') {
        // Moving forward here
        console.log('Moving forward');

        moveForward();
    } else if (direction == 'backward') {
        // Mark node that we returned from as dead end

        // Need to proceed go backward to parent node
        console.log("Need to proceed go backward to parent node");
        //move back
        
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
    determineActionsAvailability();
    turn = 0;
    direction = 'forward';
//    currentAvailableActions = [];
    actionTree.push(currentNode); // Push root node to tree
    console.log(actionTree);
    drawRims();
}

var moveForward = () => {
    var nextAction = parseInt(Object.keys(currentNode.availableActions)[0]); //currentNode.availableActions[0];
    console.log(nextAction);
    var parent = currentNode;
    currentNode = new node(nextAction);
    // Set parent node
    currentNode.parent = parent;
    console.log(parent);
    console.log(currentNode);
    // Set children
    parent.availableActions[nextAction] = currentNode;

    // Need to get actions availability (first time)
    console.log("Need to get actions availability");
    determineActionsAvailability();
    removeReverseAction();
    console.log('Current available actions: '); 
    console.log(currentNode.availableActions);

    moveRims(nextAction);
}

var moveRims = (action) => {
    var col1 = currentRims[0];
    var col2 = currentRims[1];
    var col3 = currentRims[2];

    switch(action) {
        case 1:
            col2.push(col1.pop());
            break;
        case 2:
            col3.push(col1.pop());
            break;
        case 3:
            col1.push(col2.pop());
            break;
        case 4:
            col3.push(col2.pop());
            break;
        case 5:
            col1.push(col3.pop());
            break;
        case 2:
            col2.push(col3.pop());
    }
    console.log(col1, col2, col3);
}

var getDirection = () => {
    if (Object.keys(currentNode.availableActions).length > 0) {
        // there are available actions
        direction = 'forward'
    } else {
        direction = 'backward'
    }
} 

var determineActionsAvailability = () => {
    var currentAvailableActions = {};
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
        currentAvailableActions[1] = null;
    }
    if(top1 > top3) {
        currentAvailableActions[2] = null;
    }
    if(top2 > top1) {
        currentAvailableActions[3] = null;
    }
    if(top2 > top3) {
        currentAvailableActions[4] = null;
    }
    if(top3 > top1) {
        currentAvailableActions[5] = null;
    }
    if(top3 > top2) {
        currentAvailableActions[6] = null;
    }

    currentNode.availableActions = currentAvailableActions;
}

var removeReverseAction = () => {
    //currentNode.availableActions.splice(currentNode.availableActions.indexOf(currentNode.action), 1);
    delete currentNode.availableActions[currentNode.action]
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
    $("#col1, #col2, #col3").find('div.col-box div').remove();
    currentRims.forEach(function (value, index) {
        if(Array.isArray(value)) {
            value.forEach(function (v, i) {
                console.log(index, i, v);
                $('#col' + (index + 1)).find('div.col-box').prepend('<div id="rim' + v + '" class="rim">' + v + '</div>');
            })
        }
    })
}