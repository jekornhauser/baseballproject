
function queryassembly() {
    // fetch data
    var query="";


    if (teams.length>0) {
        var teamcombo = teams.join(" OR Team =");
        query += " (Team=" + teamcombo + ")";  
    };
    if (seasons.length>0 && teams.length>0) {
        var seasonscombo = seasons.join(" OR Year =");
        query += " & (Year=" + seasonscombo + ")";
    };
    if (seasons.length>0 && teams.length===0) {
        var seasonscombo = seasons.join(" OR Year =");
        query += " (Year=" + seasonscombo + ")"; 
    };
    if (leagues.length>0 && teams.length>0) {
        var leaguescombo = leagues.join();
        query += " & (League=" + leaguescombo + ")";   
    };
    if (leagues.length>0 && seasons.length>0) {
        var leaguescombo = leagues.join();
        query += " & (League=" + leaguescombo + ")";
    };
    if (leagues.length>0 && teams.length===0 && seasons.length===0) {
        var leaguescombo = leagues.join();
        query += " (League=" + leaguescombo + ")";   
    };
    
    let URL = "query/SELECT Name, Year, "+ metrics + " FROM players WHERE" + query;

    if (leagues.length===0 && teams.length===0 && seasons.length===0) {
        URL = "query/SELECT Name, Year, "+ metrics + " FROM players ";
    };
    
    if(metrics[0].includes("OBP")) {
        URL = URL + "AND ('Hits' > 80) "
    };
    if(metrics[0].includes("OPs")) {
        URL = URL + "AND ('Hits' > 80) "
    };
    if(metrics[0].includes("Batting")) {
        URL = URL + "AND ('Hits' > 80) "
    };

    if( metrics[0].includes("Total")) {
        URL = URL + "GROUP BY Name, DOB";
    };
    URL = URL + " ORDER BY " + metrics + " DESC LIMIT 50";
    var regex = /=([A-Z]{3})/gm;
    var subst = `='$1'`;
    URL = URL.replace(regex, subst);
    var regex2 = /=([A-Z]{2})/gm;
    var subst2 = `='$1'`;
    URL = URL.replace(regex2, subst2);
    
    
    d3.json(URL).then(function(data) {
        let names = data[0];
        let year = data[1];
        let values = data[2]
        console.log(names);
        console.log(values);
        console.log(year);
        console.log(data)
        let tbody = d3.select("#QueryTable");
        tbody.html("");
        for (i=0; i<names.length; i++) {
            let row = tbody.append("tr");
            let cell = row.append("td");
            cell.text(names[i])
            let cell2 = row.append("td");
            cell2.text(year[i])
            let cell3 = row.append("td");
            cell3.text(values[i])

        };
    });
};

function queryparamclear() {
    //reset query parameters and parameter lists button code
    lists = ["teamlist", "seasonlist", "leaguelist"];
    for( var x = 0; x<lists.length; x++) {
        var table = document.getElementById(lists[x]);
        for (var i = 0; i < table.rows.length; i++) {
            for (var j = 0; j < table.rows[i].cells.length; j++){
                console.log(table.rows[i].cells[j].innerHTML)
                table.rows[i].cells[j].style.backgroundColor="white";
            };
        };
    };
     teams = [];
     seasons = [];
     leagues = [];
};

function teamdropdownlist() {
    //fetch team data
    let URL = '/teamlist/';
    d3.json(URL).then(function(data) {
        //set data to teamnames and then build a table of those names
        let teamnames = data;
        console.log(teamnames);
        console.log(teamnames.length)
        let tbody = d3.select("#teamlist");
        tbody.html("");
        for (i=0; i<teamnames.length; i++) {
            let row = tbody.append("tr");
            let cell = row.append("td");
            cell.text(teamnames[i]);
        };
        //select the table by id and give it click functionality
        var teamtable = document.getElementById("teamlist");
            for (var i = 0; i < teamtable.rows.length; i++) {
                for (var j = 0; j < teamtable.rows[i].cells.length; j++){
                    console.log(teamtable.rows[i].cells[j].innerHTML)
                    teamtable.rows[i].cells[j].style.backgroundColor="white";
                    teamtable.rows[i].cells[j].onclick = function () {
                        teamlistchange(this);
                    };
                };
            };
    });
};

function teamlistchange(tableCell) {
    //using switch, detect if a button has been pressed before.
    switch(tableCell.style.backgroundColor) {
        //if it has not, grab the element and add it to a list for future where query conditionals.  add a color indicating selection
        case "white":
            teams.push(tableCell.innerHTML);
            console.log(teams);
            console.log(tableCell.style.backgroundColor);
            tableCell.style.backgroundColor ="aqua";
            console.log(tableCell.style.backgroundColor);
            break;
        case "aqua":
            //if it has been selected before, unselect the element and remove it from the query list.  remove the color indicating selection
            console.log("Working?")
            console.log(teams);
            let index = teams.indexOf(tableCell.innerHTML)
            if (index > -1) {
                teams.splice(index, 1) 
            };
            console.log(teams);
            tableCell.style.backgroundColor ="white";
            break;
    };   
};

function seasondropdownlist() {
    //fetch season data
    let URL = '/seasonlist/';
    d3.json(URL).then(function(data) {
        //set data to seasons and then build a table of those names
        let seasons = data;
        console.log(seasons);
        console.log(seasons.length)
        let tbody = d3.select("#seasonlist");
        tbody.html("");
        for (i=0; i<seasons.length; i++) {
            let row = tbody.append("tr");
            let cell = row.append("td");
            cell.text(seasons[i]);
        };
        //select the table by id and give it click functionality
        var seasontable = document.getElementById("seasonlist");
            for (var i = 0; i < seasontable.rows.length; i++) {
                for (var j = 0; j < seasontable.rows[i].cells.length; j++){
                    console.log(seasontable.rows[i].cells[j].innerHTML)
                    seasontable.rows[i].cells[j].style.backgroundColor="white";
                    seasontable.rows[i].cells[j].onclick = function () {
                        seasonlistchange(this);
                    };
                };
            };
    });
};

function seasonlistchange(tableCell) {
    //using switch, detect if a button has been pressed before.
    switch(tableCell.style.backgroundColor) {
        //if it has not, grab the element and add it to a list for future where query conditionals.  add a color indicating selection
        case "white":
            seasons.push(tableCell.innerHTML);
            console.log(seasons);
            console.log(tableCell.style.backgroundColor);
            tableCell.style.backgroundColor ="aqua";
            console.log(tableCell.style.backgroundColor);
            break;
        case "aqua":
            //if it has been selected before, unselect the element and remove it from the query list.  remove the color indicating selection
            console.log("Working?")
            console.log(seasons);
            let index = seasons.indexOf(tableCell.innerHTML)
            if (index > -1) {
                seasons.splice(index, 1) 
            };
            console.log(seasons);
            tableCell.style.backgroundColor ="white";
            break;
    };   
};

function leaguedropdownlist() {
    //fetch league data
    let URL = '/leaguelist/';
    d3.json(URL).then(function(data) {
        //set data to leaguenames and then build a table of those names
        let leaguenames = data;
        console.log(leaguenames);
        console.log(leaguenames.length)
        let tbody = d3.select("#leaguelist");
        tbody.html("");
        for (i=0; i<leaguenames.length; i++) {
            let row = tbody.append("tr");
            let cell = row.append("td");
            cell.text(leaguenames[i]);
        };
        //select the table by id and give it click functionality
        var leaguetable = document.getElementById("leaguelist");
            for (var i = 0; i < leaguetable.rows.length; i++) {
                for (var j = 0; j < leaguetable.rows[i].cells.length; j++){
                    console.log(leaguetable.rows[i].cells[j].innerHTML)
                    leaguetable.rows[i].cells[j].style.backgroundColor="white";
                    leaguetable.rows[i].cells[j].onclick = function () {
                        leaguelistchange(this);
                    };
                };
            };
    });
};

function leaguelistchange(tableCell) {
    //using switch, detect if a button has been pressed before.
    switch(tableCell.style.backgroundColor) {
        //if it has not, grab the element and add it to a list for future where query conditionals.  add a color indicating selection
        case "white":
            leagues.push(tableCell.innerHTML);
            console.log(leagues);
            console.log(tableCell.style.backgroundColor);
            tableCell.style.backgroundColor ="aqua";
            console.log(tableCell.style.backgroundColor);
            break;
        case "aqua":
            //if it has been selected before, unselect the element and remove it from the query list.  remove the color indicating selection
            console.log("Working?")
            console.log(leagues);
            let index = leagues.indexOf(tableCell.innerHTML)
            if (index > -1) {
                leagues.splice(index, 1) 
            };
            console.log(leagues);
            tableCell.style.backgroundColor ="white";
            break;
    };   
};

//Available metrics to search from
metrics=["RBIs","Total RBIs","Homeruns","Total Homeruns", '"Batting Average"', "OBP","Slugging%","OPS","Triples","Total Triples","Doubles","Total Doubles", "Hits","Total Hits", "Runs", "Total Runs"]
//Add these metrics to Metric Table
let tbody = d3.select("#Metric");
        tbody.html("");
        let row = tbody.append("tr");
        for (i=0; i<metrics.length; i++) {
            let cell = row.append("td");
            cell.text(metrics[i]);
        };
//select the table by id and give it click functionality
var metrictable = document.getElementById("Metric");
for (var i = 0; i < metrictable.rows.length; i++) {
    for (var j = 0; j < metrictable.rows[i].cells.length; j++){
        console.log(metrictable.rows[i].cells[j].innerHTML)
        metrictable.rows[i].cells[j].style.backgroundColor="white";
        metrictable.rows[i].cells[j].onclick = function () {
            metriclistchange(this);
        };
    };
};
function metriclistchange(tableCell) {
    //using switch, detect if a button has been pressed before.
    switch(tableCell.style.backgroundColor) {
        //if it has not, grab the element and add it to a list for future where query conditionals.  add a color indicating selection
        case "white":
            metrics.push(tableCell.innerHTML);
            console.log(metrics);
            console.log(tableCell.style.backgroundColor);
            tableCell.style.backgroundColor ="aqua";
            console.log(tableCell.style.backgroundColor);
            break;
        case "aqua":
            //if it has been selected before, unselect the element and remove it from the query list.  remove the color indicating selection
            console.log("Working?")
            console.log(metrics);
            let index = metrics.indexOf(tableCell.innerHTML)
            if (index > -1) {
                metrics.splice(index, 1) 
            };
            console.log(metrics);
            tableCell.style.backgroundColor ="white";
            break;
    };   
};


function dupename() {
    let URL = '/random/';
    d3.json(URL).then(function(data) {
        let names = data[0];
        let rbis = data[1];
        console.log(names);
        console.log(rbis);
    });
};


//lists of selected elements for where conditional queries
var teams = [];
var seasons = [];
var leagues = [];
var metrics = [];

var ranks = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
var allwinpercents = [.6256,.6169,.6082,.5995,.5908,.5821,.5734,.5648,.5561,.5474,.5387,.53,.5213,.5126,.504,.4953,.4866,.4779,.4692,.4605,.4519,.4432,.4345,.4258,.4171,.4084,.3997,.3911,.3824,.3737]
var alwinpercents = [.6312, .6221, .6129, .6038, .5946, .5855, .5763, .5672, .558, .5489, .5397, .5306, .5214, .5123, .5031, .494, .4848, .4757, .4665, .4574, .4482, .4391, .4299, .4208, .4116, .4025, .3933, .3842, .375, .3659]
var nlwinpercents = [.6216, .6132, .6049, .5966, .5882, .5799, .5715, .5632, .5549, .5465, .5382, .5299, .5215, .5132, .5048, .4965, .4882, .4798, .4715, .4631, .4548, .4465, .4381, .4298, .4215, .4131, .4048, .3964, .3881, .3798]

let perctbody = d3.select("#WinPercents");
perctbody.html("");
    for (z=0; z<ranks.length; z++) {
        let percrow = perctbody.append("tr");
        let perccell = percrow.append("td");
        perccell.text(ranks[z])
        let perccell2 = percrow.append("td");
        perccell2.text(allwinpercents[z])
        let perccell3 = percrow.append("td");
        perccell3.text(alwinpercents[z]);
        let perccell4 = percrow.append("td");
        perccell4.text(nlwinpercents[z]);
    };

function init(){  

    teamdropdownlist();
    seasondropdownlist();
    leaguedropdownlist();
    dupename();

};

init();