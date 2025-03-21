//Constants
const form = document.getElementById("frm");
const GodsDBDump = document.getElementById("GodsDBDump");
var selectedGodName;
var selectedGodImg;

//Initialize
init();

//Functions
function init(){
    createDropdown();
    returnAllGodsAndStats();
}

// Event Listeners
//When team compositions are established, form submit button should be clicked and this will fetch the necessary data from the database to calculate winning odds
form.addEventListener('submit', (event) => {
    event.preventDefault();
    checkDuplicates();
    calculateWinner()
})

//Adding click listeners to each god selection box to open up the list of god choices
document.querySelectorAll('.selected-option').forEach(option => {
    option.addEventListener('click', function() {
        closeAllDropdowns();
        const optionsList = this.nextElementSibling; // Get the corresponding options list
        optionsList.classList.toggle('active'); // Toggle visibility
        selectedGodName = this.textContent;
        selectedGodImg = `url('/God_images/${selectedGodName}.png')`;
    });
});

//Close dropdowns when user doesn't click an option selection box
document.addEventListener('click', function(event) {
    if (!event.target.closest('.custom-select')) {
        document.querySelectorAll('.options-list').forEach(list => {
            list.classList.remove('active'); // Close all dropdowns
        });
    }
});

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

//For generating the list of gods to select from for the teams. Only needs names and images
function createDropdown() {
    fetch('/api/gods/name_and_portrait')
        .then(response => response.json())
        .then(data => {
            for (let i = 1; i <= 10; i++){ //Loop through each dropdown selection adding all the gods to make the list
                const godsList = document.getElementById(`gods${i}`);
                data.data.forEach(item => {
                    const li = createOptionItem(item);
                    godsList.appendChild(li);
                })
            }
        })
        .catch(error => console.error('Error fetching god names:', error));
}

//Create a li that contains a God's image and name that, once clicked, closes the dropdown and sets that god as the value
function createOptionItem(item) {
    const li = document.createElement('li');
    li.classList.add('option-item');

    
    const img = document.createElement('img');
    img.src = item.ImgFilePath;
    img.alt = item.Name;
    img.classList.add('option-image');

    const span = document.createElement('span');
    span.textContent = item.Name;

    li.appendChild(img);
    li.appendChild(span);

    // When li is selected, updated the hidden value (for the javascript), and updates the selectedOption's name and image of what the player selected
    li.addEventListener('click', () => {
        const selectedOption = li.parentElement.previousElementSibling;
        const hiddenInput = li.parentElement.nextElementSibling
        selectedOption.textContent = item.Name;
        hiddenInput.value = item.Name; // Set the hidden input value
        selectedGodName = item.Name;
        selectedGodImg = item.ImgFilePath;
        closeAllDropdowns();
        updateSelectedImage(li.parentElement.parentElement, item.ImgFilePath);
    })

    //Updates the image of what is selected with what the user highlights
    li.addEventListener('mouseenter', () => {
        const customSelect = li.parentElement.parentElement;
        const selectedOption = li.parentElement.previousElementSibling;
        customSelect.style.backgroundImage = `url('${item.ImgFilePath}')`;
        selectedOption.textContent = item.Name;
    })

    // Returns the image and name back to what the pl;ayer originally selected with a click
    li.addEventListener('mouseleave', () => {
        const customSelect = li.parentElement.parentElement;
        const selectedOption = li.parentElement.previousElementSibling;
        customSelect.style.backgroundImage = selectedGodImg;
        selectedOption.textContent = selectedGodName;
    })

    return li;
}

function closeAllDropdowns(){
    const allOptionLists = document.querySelectorAll('.options-list');
    allOptionLists.forEach (list => {
        list.classList.remove('active'); //Close the dropdown
    })
}

function updateSelectedImage(customSelect, path) {
    customSelect.style.backgroundImage = `url('${path}')`;
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

//Basic idea of caluclating which team is better. OBviously not at all a good indicator, but just using this as a prototype
async function calculateWinner() {
    let p = document.querySelector("p");
    let team1Arr = [0,0,0,0,0,0,0,0];
    let team2Arr = [0,0,0,0,0,0,0,0];
    await calculateAverages(team1Arr, "team1");
    await calculateAverages(team2Arr, "team2");

    let result = compareTeams(team1Arr, team2Arr);
    if (result > 0){
        console.log("Team 1");
        p.innerHTML = "Team 1 is more likely to win";
    } 
    else if (result < 0) {
        console.log("Team 2");
        p.innerHTML = "Team 2 is more likely to win";
    } 
    else {
        console.log("neither");
        p.innerHTML = "Teams are fairly balanced";
    }
}
async function calculateAverages(teamArr, teamID) {
    let inputs = document.querySelectorAll(`#${teamID} input`);
    let currGod;

    for (let input of inputs) {
        currGod = input.value;
        await addStats(currGod, teamArr);
    }
    for(let i = 0; i < teamArr.length; i++) {
        teamArr[i] /= 5;
    }
}
async function addStats(god, teamArr){
    try {
        //Make the fetch request and wait for response
        const response = await fetch(`/api/gods/${god}`)//Feteches the data of the god that has been input
        const data = await response.json();
     
        if (data.message === 'success') {
            const values = data.data;
            for (let i = 0; i < teamArr.length; i++) {
                teamArr[i] += values[i];
            }
        }
        else {
            alert(data.message) //If god aint found
        }
    } catch (error) {
        console.error('Error fetching data:', error);
            alert('Something went wrong. Please try again later.');
    }
}
function compareTeams(team1, team2){
    let result = 0;
    for(let i = 0; i < team1.length; i++) {
        if(team1[i] > team2[i]) {
            result++;
        } else if (team1[i] < team2[i]) {
            result--;
        }
    }

    return result;
}
