function calculateWinner() {
    let p = document.querySelector("p");
    let x = document.getElementById("frm");
    let team1 = 0;
    let team2 = 0

    for(var i = 0; i < x.length; i++) {
        if (x.elements[i].parentNode.id === "team1") {
            team1 += addScore(x.elements[i].value, team1)
        } else {
            team2 += addScore(x.elements[i].value, team2)
        }
    }

    if (team1 > team2){
        p.innerHTML = "Team 1 is more likely to win";
    } else if (team1 < team2) {
        p.innerHTML = "Team 2 is more likely to win";
    } else {
        p.innerHTML = "Teams are pretty balanced"
    }
}

function addScore(value, team){
    let y = 0;
    switch(value) {
        case "Thor":
            y += 1;
            break;
        case "Ah Muzen Cab":
            y += 2;
            break;
        case "Odin":
            y += 3;
            break;
        case "Medusa":
            y += 4;
            break;
        case "Fenrir":
            y += 5;
            break;
        case "Geb":
            y += 6;
            break;
        case "Hel":
            y += 7;
            break;
        case "Loki":
            y += 8;
            break;
        case "Hera":
            y += 9;
            break;
        case "Merlin":
            y += 10;
            break;
    }
    return y;
}