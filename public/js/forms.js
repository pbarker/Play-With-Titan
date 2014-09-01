/**
 * Created by Grillz on 9/1/14.
 */
$ ( document ).ready ( function ( ) {   //Save Vertex

    // variable to hold request
    var request ;
    // bind to the submit event of our form
    $ ( "#person" ).submit ( function ( event ) {
        // abort any pending request
        if ( request ) {
            request.abort ( ) ;
        }
        // setup some local variables
        var $form = $ ( this ) ;
        // let's select and cache all the fields
        var $inputs = $form.find ( "input, select, button, textarea" ) ;
        // serialize the data in the form
        var person = $ ( '#person' ).serializeArray ( ).reduce ( function ( obj, item ) {
            obj[ item.name ] = item.value ;
            return obj ;
        }, { } ) ;

        console.log ( person )
        // let's disable the inputs for the duration of the ajax request
        // Note: we disable elements AFTER the form data has been serialized.
        // Disabled form elements will not be serialized.
        $inputs.prop ( "disabled", true ) ;

        // fire off the request to /form.php
        request = $.ajax ( {
            url : "/saveVert",
            type : "post",
            contentType : "application/json",
            data : JSON.stringify ( person )
        } ) ;

        // callback handler that will be called on success
        request.done ( function ( response, textStatus, jqXHR ) {
            // log a message to the console
            console.log(typeof (response))
            console.log ( "Hooray, it worked! " + response  ) ;
            $( '#person' ).each(function(){
                this.reset();
            });
            person["id"] = response
            graph.beginUpdate ( ) ;
            graph.addNode(response, person)
            graph.endUpdate ( ) ;
            $("#vertResult" ).html("Saved person") ;
            $("#vertResult").show().delay(5000).fadeOut();

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
            // reenable the inputs
            $inputs.prop ( "disabled", false ) ;
        } ) ;

        // prevent default posting of form
        event.preventDefault ( ) ;
    } ) ;
} ) ;
$ ( document ).ready ( function ( ) {   //Save Node

    // variable to hold request
    var request ;
    // bind to the submit event of our form
    $ ( "#edge" ).submit ( function ( event ) {
        // abort any pending request
        if ( request ) {
            request.abort ( ) ;
        }
        // setup some local variables
        var $form = $ ( this ) ;
        // let's select and cache all the fields
        var $inputs = $form.find ( "input, select, button, textarea" ) ;
        // serialize the data in the form
        var edge = $ ( '#edge' ).serializeArray ( ).reduce ( function ( obj, item ) {
            obj[ item.name ] = item.value ;
            return obj ;
        }, { } ) ;

        console.log ( edge )
        // let's disable the inputs for the duration of the ajax request
        // Note: we disable elements AFTER the form data has been serialized.
        // Disabled form elements will not be serialized.
        $inputs.prop ( "disabled", true ) ;

        // fire off the request to /form.php
        request = $.ajax ( {
            url : "/saveEdge",
            type : "post",
            contentType : "application/json",
            data : JSON.stringify ( edge )
        } ) ;

        // callback handler that will be called on success
        request.done ( function ( response, textStatus, jqXHR ) {
            // log a message to the console
            console.log ( "Hooray, it worked!" ) ;
            var nodeId1, nodeId2
            graph.forEachNode(function(node){
                if(node.data.name == edge.name1){
                    nodeId1 = node.id
                }
                else if(node.data.name == edge.name2){
                    nodeId2 = node.id
                }
            })
            graph.beginUpdate ( ) ;
            graph.addLink(nodeId1, nodeId2, edge.relation)
            graph.endUpdate ( ) ;

            $( '#edge' ).each(function(){
                this.reset();
            });
            $ ( "#edgeResult" ).html ( "Saved Relation" ) ;
            $("#edgeResult").show().delay(5000).fadeOut();
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
            // reenable the inputs
            $inputs.prop ( "disabled", false ) ;
        } ) ;

        // prevent default posting of form
        event.preventDefault ( ) ;
    } ) ;
} ) ;