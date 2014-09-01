/**
 * Created by Grillz on 9/1/14.
 */
$(document).ready(function(){  //ws Autocomplete
    //Open a WebSocket connection.
    var wsUri = "/echo";

    var websocket = new WebSocket("ws://localhost:9000/Echo");

    //Connected to server
    websocket.onopen = function(ev) {
        console.log('Connected to server ');
    }

    //Connection close
    websocket.onclose = function(ev) {
        console.log('Disconnected');
    };

//            //Message Receved
//            websocket.onmessage = function(ev) {
//                console.log('Message '+ev.data);
//            };

    //Error
    websocket.onerror = function(ev) {
        console.log('Error '+ev.data);
    };

    $( "#t1" ).autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: "http://gd.geobytes.com/AutoCompleteCity",
                dataType: "jsonp",
                data: {
                    q: request.term
                },
                success: function( data ) {
                    console.log("Response" + data)
                    console.dir(data);
                    response( data );
                }
            });
        }
    })
    $( "#name1" ).autocomplete({
        source: function( request, response ) {
            console.log("Request: " + request.term)
            websocket.send(JSON.stringify(request.term));
            websocket.onmessage = function(ev) {
                var par = JSON.parse(ev.data);
                console.dir(par);
                console.log("Response: " + par);
                response(par);
            }

        }
    })
    $( "#name2" ).autocomplete({
        source: function( request, response ) {
            console.log("Request: " + request.term)
            websocket.send(JSON.stringify(request.term));
            websocket.onmessage = function(ev) {
                var par = JSON.parse(ev.data);
                console.dir(par);
                console.log("Response: " + par);
                response(par);
            }

        }
    })
});