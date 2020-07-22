/* Last.fm API Credentials */
var lastfm = new LastFM({
    apiKey: 'd2d3e918d196fbaffb1757975d812815',
    apiSecret: 'abf446b4dbc03411ce029ff8401fd158',
    cache: null
});

function Init() {

    /* input field */
    var filter = document.getElementById('filter');
    var csvFile = document.getElementById('csvFile');
    var userNameField = document.getElementById('usernameField');

    /* radio buttons */
    var csv = document.getElementById('csv');
    var api = document.getElementById('api');

    /* input field containers */
    var csvContainer = document.getElementById('csvContainer');
    var apiContainer = document.getElementById('apiContainer');

    filter.addEventListener("blur", function() {
        parseDataAndCreateRows();
    });

    filter.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            parseDataAndCreateRows();
        }
    });

    csvFile.addEventListener("change", function() {
        parseDataAndCreateRows();
    });

    csv.addEventListener("change", function() {
        ShowElement(csvContainer.id);
        HideElement(apiContainer.id);
    });

    api.addEventListener("change", function() {
        ShowElement(apiContainer.id);
        HideElement(csvContainer.id);
    });

    userNameField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getRecentTracks(userNameField.value);
        }
    });
}

function parseDataAndCreateRows() {

    // clear table
    document.getElementById('scrobbleTable').getElementsByTagName('tbody')[0].textContent = "";

    var data = null;
    var file = csvFile.files[0];

    Papa.parse(file, {
        header: false,
        dynamicTyping: true,
        complete: function(results) {
            data = results;
            //console.log(data);

            for (var key in data) {

                var obj = data[key];
                for (i = 0; i < obj.length; i++) {
                    addRow(obj[i]);
                }
            }
        }
    });
}


function addRow(obj) {
    try {
        var tbody = document.getElementById('scrobbleTable').getElementsByTagName('tbody')[0];
        var filter = document.getElementById("filter").value.toLowerCase();

        var artist = obj[0] || "";
        var album = obj[1] || "";
        var track = obj[2] || "";
        var timestamp = obj[3] || "";

        var row = document.createElement("tr");
        row.setAttribute("onclick", "window.location='" + GetLastFmTrackURL(artist, album, track) + "'");

        var artistNode = document.createElement("td");
        artistNode.appendChild(document.createTextNode(artist));

        var albumNode = document.createElement("td");
        albumNode.appendChild(document.createTextNode(album));

        var trackNode = document.createElement("td");
        trackNode.appendChild(document.createTextNode(track));

        var timestampNode = document.createElement("td");
        timestampNode.appendChild(document.createTextNode(timestamp));

        row.appendChild(artistNode);
        row.appendChild(trackNode);
        row.appendChild(albumNode);
        row.appendChild(timestampNode);

        if (filter == "" || filter == null) {
            tbody.appendChild(row);
            return;
        }

        if (filterScrobble(artist, album, track)) {
            tbody.appendChild(row);
        }
    } catch (e) {

    }
}


function addRowAPI(obj) {
    try {
        var tbody = document.getElementById('scrobbleTable').getElementsByTagName('tbody')[0];

        var track = obj.name;
        var artist = obj.artist["#text"]
        var album = obj.album["#text"];
        var timestamp = obj.date["#text"]

        var row = document.createElement("tr");
        row.setAttribute("onclick", "window.location='" + GetLastFmTrackURL(artist, album, track) + "'");

        var artistNode = document.createElement("td");
        artistNode.appendChild(document.createTextNode(artist));

        var albumNode = document.createElement("td");
        albumNode.appendChild(document.createTextNode(album));

        var trackNode = document.createElement("td");
        trackNode.appendChild(document.createTextNode(track));

        var timestampNode = document.createElement("td");
        timestampNode.appendChild(document.createTextNode(timestamp));

        row.appendChild(artistNode);
        row.appendChild(trackNode);
        row.appendChild(albumNode);
        row.appendChild(timestampNode);
        tbody.appendChild(row);
        return;
    } catch (e) {

    }
}



function filterScrobble(artist, album, track) {
    try {
        var filter = document.getElementById("filter").value.toLowerCase();

        artist = artist.toLowerCase();
        album = album.toLowerCase();
        track = track.toLowerCase();

        if (artist.includes(filter) || album.includes(filter) || track.includes(filter)) {
            return true;
        }

        return false;

    } catch (e) {}
}


function getRecentTracks(userName) {

    document.getElementById('scrobbleTable').getElementsByTagName('tbody')[0].textContent = "";

    lastfm.user.getRecentTracks({ user: userName, limit: 200 }, {
        success: function(data) {

            for (var key in data) {

                var obj = data[key].track;
                for (i = 0; i < obj.length; i++) {
                    addRowAPI(obj[i]);
                }
            }

        },
        error: function(code, message) {
            alert("hoitas do hods wos: " + message);
        }
    });
}