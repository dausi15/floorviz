var index = {}; // roomname ↦ {"tag" ↦ TAG, "data" ↦ KEY ↦ VALUE}
var uuid2roomname = {}; // uuid ↦ roomname

perform_subscriptions = function () {
}

new_view = function (view_name) {
}

populate_view_choices = function () {
}

extract_views = function () {
}

hoddb_query_room = function (hoddb_url, callback) {
    if (callback) callback();
}

hoddb_query_building = function (hoddb_url, callback) {
    if (callback) callback();
}

new_model = function (hoddb_url, callback) {
    hoddb_query_building(hoddb_url, function () {
        hoddb_query_rooms(hoddb_url, function () {
            extract_views();
            populate_view_choices();
            if (callback) callback();
        });
    });
}

colorize = function (tag, color) {
    // read
    var attrs = tag.getAttribute("style").split(";");
    var d = {};
    for (var i=0 ; i<attrs.length; i++) {
        var elements = attrs[i].split(":");
        d[elements[0]] = elements[1];
    }
    
    // modify
    d["fill"] = color;
    
    // write
    attrs = "";
    for (var key in d) {
        if (attrs!="") attrs += ";";
        attrs += key+":"+d[key];
    }
    tag.setAttribute("style", attrs);
}

window.onload = function () {
    var o = document.getElementById("building");
    var svgdoc = o.contentDocument;
    var item = svgdoc.getElementById("path817");
    colorize(item, "#ff0000");
    
    ids = svgdoc.getElementsByTagName('*');
    console.log(ids);
    
    // generate index
    tags = svgdoc.querySelectorAll('[id^=encoded]');
    console.log(tags);
    for (var i=0 ; i<tags.length; i++) {
        tag = tags[i];
        elements = tag.getAttribute("id").split(":");
        if (elements.length != 2 || elements[0]!="encoded") {
            console.log("error in id match (len="+(elements.length)+", element0='"+elements[0]+"'):");
            console.log(tag);
        }
        
        d = {}
        pairs = elements[1].split(",");
        for (var j=0 ; j<pairs.length; j++) {
            parts = pairs[j].split("=");
            d[parts[0]] = parts[1];
        }
        if ("room" in d) {
            console.log("inside");
            index[d["room"]] = {
                "tag": tag,
                "data": d,
            }
        }
    }
    
    console.log(index);
    
    // https://hpbn.co/xmlhttprequest/
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://volta.sdu.dk/backend/republish', true); // true for asynchronous
    xhr.setRequestHeader("User-Agent", "floorviz");
    xhr.seenBytes = 0;
    
    xhr.onreadystatechange = function() { 
        if(xhr.readyState > 2) {
            var json_strings = xhr.responseText.substr(xhr.seenBytes).split("\r");
            console.log("elements = "+json_strings.length);
            for (var i=0 ; i<json_strings.length; i++) {
//                console.log("element "+i+" ...");
                json_string = json_strings[i];
                console.log(json_string);
                o = JSON.parse(json_string);
//                console.log(o);
            }
            xhr.seenBytes = xhr.responseText.length; 
        }
    };
    xhr.send("Metadata/Location/Building=\"OU44\" and Metadata/Media=\"air\"");
}

