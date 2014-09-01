/**
 * Created by Grillz on 9/1/14.
 */
/*global Viva*/
var graph, renderer;
var inc = 0;
var nodeArray= [];


function updateNodes ( graph, vertData ) {
    graph.beginUpdate ( ) ;

    vertData.forEach( function (arrayItem)
    {
        graph.addNode(arrayItem.id, arrayItem)
    });
    graph.endUpdate ( ) ;

}
function updateEdges (graph, edgeData){
    graph.beginUpdate ( ) ;

    edgeData.forEach( function (arrayItem)
    {
        graph.addLink(arrayItem.start, arrayItem.end, arrayItem.label)
    });
    graph.endUpdate ( ) ;
}

function onLoad() {
    graph = Viva.Graph.graph ( ) ;

    var layout = Viva.Graph.Layout.forceDirected ( graph, {
        springLength : 10,
        springCoeff : 0.0008,
        dragCoeff : 0.02,
        gravity : - 10
    } ) ;

    var svgGraphics = Viva.Graph.View.svgGraphics();

    showNodeProps = function(node){

        var nodeText = "Name: " + node.data.name + "<span style='color: black'>&nbsp|&nbsp</span> Age: " + node.data.age + "<span style='color: black'>&nbsp|&nbsp</span> Id: " + node.data.id + " <span style='color: black'>&nbsp|&nbsp</span> ";
        var linkText = ""
        graph.forEachLinkedNode(node.id, function(node, link){
            var relate = link.data
            var pers = node.data.name.toString ( )
            var string = relate + ": " + pers + "<span style='color: black'>&nbsp|&nbsp</span> "
            linkText += string
        });

        console.log(nodeText)
        console.log(linkText)
        $('#nodeInfo' ).html("<h4 style='color: #5BC0DE'>" + nodeText + "</h4> <br /> <h4 style='color:#F0AD4E'>   " + linkText + "</h4>" )
    }
    highlightRelatedNodes = function(nodeId, isOn) {
        // just enumerate all realted nodes and update link color:
        graph.forEachLinkedNode(nodeId, function(node, link){
            var linkUI = svgGraphics.getLinkUI(link.id);
            if (linkUI) {
                // linkUI is a UI object created by graphics below
                linkUI.attr('stroke', isOn ? 'red' : 'gray');
            }
        });
    };

    svgGraphics.node(function(node) {
        var circle = Viva.Graph.svg('circle')
            .attr('r', 8)
            .attr('stroke', '#fff')
            .attr('stroke-width', '.5px')
            .attr("fill", "#5CB85C");

        circle.append('title').text(node.id);

        $(circle).hover(function() { // mouse over
            showNodeProps(node)
            highlightRelatedNodes(node.id, true);
        }, function() { // mouse out
            highlightRelatedNodes(node.id, false);
        });
        return circle;

    }).placeNode(function(nodeUI, pos){
        nodeUI.attr( "cx", pos.x).attr("cy", pos.y);
    });

    svgGraphics.link(function(link){
        return Viva.Graph.svg('line')
            .attr('stroke', '#999')
            .attr('stroke-width', "2px")
    });

    renderer = Viva.Graph.View.renderer ( graph, {
        layout : layout,
        graphics : svgGraphics,
        container : document.getElementById ( 'graphContainer' ),
        renderLinks : true
    } ) ;

    renderer.run ( 50 ) ;

    //beginAddNodes ( graph ) ;
    refreshGraph();
    l = layout ;
}
function queryGraphVerticies(){
    var request = $.ajax ( {
        url : "/jsonVerticies",
        type : "GET",
        contentType : "application/json"
    } ) ;

    // callback handler that will be called on success
    request.done ( function ( response, textStatus, jqXHR ) {
        // log a message to the console
        console.log(response)
        console.log ( "Hooray, it worked!" ) ;
        nodeArray = response
        updateNodes(graph, response)
        //var obj = JSON.parse(response);
        // console.log(obj)
    } ) ;

    // callback handler that will be called on failure
    request.fail ( function ( jqXHR, textStatus, errorThrown ) {
        // log the error to the console
        console.error (
                "The following error occured: " +
                textStatus, errorThrown
        ) ;
    } ) ;

    // callback handler that will be called regardless
    // if the request failed or succeeded
    request.always ( function ( ) {
        console.log("always")
    } ) ;
}
function queryGraphEdges(){
    var request = $.ajax ( {
        url : "/jsonEdges",
        type : "GET",
        contentType : "application/json"
    } ) ;

    // callback handler that will be called on success
    request.done ( function ( response, textStatus, jqXHR ) {
        // log a message to the console
        console.log ( "Hooray, it worked!" ) ;
        console.log(response);
        updateEdges ( graph, response ) ;

        //var obj = JSON.parse(response);
        //console.log(obj)
    } ) ;

    // callback handler that will be called on failure
    request.fail ( function ( jqXHR, textStatus, errorThrown ) {
        // log the error to the console
        console.error (
                "The following error occured: " +
                textStatus, errorThrown
        ) ;
    } ) ;

    // callback handler that will be called regardless
    // if the request failed or succeeded
    request.always ( function ( ) {
        console.log("always")
    } ) ;
}
function refreshGraph(){
    queryGraphVerticies();
    setTimeout(queryGraphEdges ,900);
    //queryGraphEdges();

}