//const { response } = require("express");

const form = document.getElementById("frm");
const dataList = document.getElementById("datalist");

//When team compositions are established, form submit button should be clicked and this will fetch the necessary data from the database to calculate winning odds
form.addEventListener('submit', (event) => {
    event.preventDefault();
})

/*  Basic idea of POST if user is submitting ifo into DB. WON'T BE NEEDED AS USERS ARE NOT ADDING TO A DATABASE, ONLY NEED GETS
form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;

  fetch('/api/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, age })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    fetchDatabaseData(); // Refresh the displayed data
  })
  .catch(error => {
    console.error('Error:', error);
  });
});
*/

//Used for testing fetching APIs and see the JSON layout
function returnAllGodsAndStats() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            dataList.innerHTML = ''; //clear list
            data.data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = JSON.stringify(item);
                dataList.appendChild(li);
            });
        })
}

returnAllGodsAndStats();


//Below is just basic functions to mimic the idea of submitting a team composition and getting a result
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