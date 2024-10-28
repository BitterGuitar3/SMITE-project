//Constants
const form = document.getElementById("frm");
const GodsDBDump = document.getElementById("GodsDBDump");
const godsList = document.getElementById("gods");

// Event Listeners
//When team compositions are established, form submit button should be clicked and this will fetch the necessary data from the database to calculate winning odds
form.addEventListener('submit', (event) => {
    event.preventDefault();
    checkDuplicates();
})

//Initialize
init();

//Functions
function init(){
    returnAllGodsNames();
    returnAllGodsAndStats();
}

//Check duplicate for duplicate gods on the same team
function checkDuplicates() {
    const teams = document.querySelectorAll('.Team')

    teams.forEach((team) => {
        const inputs = team.querySelectorAll('input');
        const values = Array.from(inputs).map(input => input.value);
        const duplicates = values.filter((value, index, self) =>
            self.indexOf(value) !== index);

        if (duplicates.length > 0) {
            alert(`Duplicate found in ${team.querySelector('h2').innerText}: ${duplicates}`);
        } else {
            alert(`${team.querySelector('h2').innerText} has no duplicates`);
        }
    })
}

//For generating the list of gods to select from for the teams
function returnAllGodsNames() {
    fetch('/api/gods/name')
        .then(response => response.json())
        .then(data =>   {
            data.data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.Name;
                godsList.appendChild(option);
            });
        })
}

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

//Used for testing fetching APIs and see the JSON layout\
function returnAllGodsAndStats() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            GodsDBDump.innerHTML = ''; //clear list
            data.data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = JSON.stringify(item);
                GodsDBDump.appendChild(li);
            });
        })
}

//Below is just basic functions to mimic the idea of submitting a team composition and getting a result. NOTE: DOES NOT WORK BECAUSE TEST NAMES ARE NO LONGER IN LIST
function calculateWinner() {
    let p = document.querySelector("p");
    const team1 = calculateTeamScore("team1");
    const team2 = calculateTeamScore("team2");

    if (team1 > team2){
        p.innerHTML = "Team 1 is more likely to win";
    } else if (team1 < team2) {
        p.innerHTML = "Team 2 is more likely to win";
    } else {
        p.innerHTML = "Teams are pretty balanced"
    }
}

function calculateTeamScore(teamId) {
    const inputs = document.querySelectorAll('#${teamId} input');
    return Array.form(inputs).reduce((total, input) => total + addScore(input.value), 0);
}

function addScore(value){
    const scoreMapping = {
        "Thor": 1,
        "Ah Muzen Cab": 2,
        "Odin": 3,
        "Medusa": 4,
        "Fenrir": 5,
        "Geb": 6,
        "Hel": 7,
        "Loki": 8,
        "Hera": 9,
        "Merlin": 10
    };
    return scoreMapping[value] || 0; //Return 0 if value is not in the mapping
}