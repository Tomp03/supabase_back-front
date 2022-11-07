// Auth
var supabase = supabase.createClient("https://apbftpkyduywihpstvhv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwYmZ0cGt5ZHV5d2locHN0dmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjY2OTk3OTksImV4cCI6MTk4MjI3NTc5OX0.cKGsXOIAbdU32DBd-ruhJp8JgdHQZ2VAwWZM4g3J7yQ");

window.userToken = null;

document.addEventListener("DOMContentLoaded", function (event) {
  var signUpForm = document.querySelector("#sign-up");
  signUpForm.onsubmit = signUpSubmitted.bind(signUpForm);

  var logInForm = document.querySelector("#log-in");
  logInForm.onsubmit = logInSubmitted.bind(logInForm);

  var logoutButton = document.querySelector("#logout");
  logoutButton.onclick = logoutSubmitted.bind(logoutButton);
});

const signUpSubmitted = (event) => {
  event.preventDefault();
  const email = event.target[0].value;
  // const password = event.target[1].value;
  const password = "123456";

  supabase.auth
    .signUp({ email, password })
    .then((response) => { response.error ? alert(response.error.message) : setToken(response) })
    .catch((err) => { console.log(err) });
};

const logInSubmitted = (event) => {
  event.preventDefault();
  const email = event.target[0].value;
  // const password = event.target[1].value;
  const password = "123456";

  supabase.auth
    .signIn({ email, password })
    .then((response) => { response.error ? alert(response.error.message) : setToken(response) })
    .catch((err) => { console.log(err.response.text) });
};

const logoutSubmitted = (event) => {
  event.preventDefault();

  supabase.auth
    .signOut()
    .then((_response) => {
      document.querySelector(".display").style.display = "none";
      console.log("Logout successful");
    })
    .catch((err) => { console.log(err.response.text) });
};

function setToken(response) {
  if (response.user.confirmation_sent_at && !response?.session?.access_token) {
    console.log("Confirmation Email Sent");
  } else {
    document.querySelector(".display").style.display = "block";
    console.log("Logged in as " + response.user.email);
  }
}

// CRUD

function getAllNotes() {
  fetch("http://localhost:3000/api/v1/")
    .then((res) => res.json())
    .then((data) => displayAllNotes(data.data));
}

function date(date) {
  // 2022-11-03T15:23:02.138208+00:00
  let day = date.slice(8, 10);
  let month = date.slice(5, 7);
  let year = date.slice(0, 4);
  let hour = date.slice(11, 13);
  let minutes = date.slice(14, 16);
  let b = "";

  switch (month) {
    case "1": b = "Janvier";
      break;
    case "2": b = "Février";
      break;
    case "3": b = "Mars";
      break;
    case "4": b = "Avril";
      break;
    case "5": b = "Mai";
      break;
    case "6": b = "Juin";
      break;
    case "7": b = "Juillet";
      break;
    case "8": b = "Août";
      break;
    case "9": b = "Septembre";
      break;
    case "10": b = "Octobre";
      break;
    case "11": b = "Novembre";
      break;
    case "12": b = "Décembre";
      break;
  }

  hour == "23" ? (hour = "00") : hour++;

  return `Le ${day} ${b} ${year} à ${hour}:${minutes}`;
}

function displayAllNotes(notes) {
  let total = document.querySelector("#total");
  total.innerText = notes.length;
  let tbody = document.getElementById("tbody");
  let tr = "";
  for (var i in notes) {
    tr += `<tr>
      <td>${notes[i].id}</td>
      <td>${notes[i].notes}</td>
      <td>${date(notes[i].created_at)}</td>
      <td><button id='update' onclick='updateNote(${notes[i].id})'>Edit</button></td>
      <td><input type="text" name="edit-note" id="${notes[i].id}"></td>
      <td><button onclick='deleteNote(${notes[i].id})'>Delete</button></td>
      </tr>`;
  }
  tbody.innerHTML = tr;
}

getAllNotes();

document.querySelector("#save").addEventListener("click", async function addNote() {
    try {
      const response = await fetch("http://localhost:3000/api/v1/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: document.querySelector("#note").value,
          uid: supabase.auth.user().id,
        }),
      });

      const data = await response.json();
      data.status == "201" ? console.log({ method: "POST", res: "Created" }) : console.log({ method: "POST", res: data });
    } catch (error) {
      console.log(error);
    }

    getAllNotes();
  });

async function updateNote(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes: document.getElementById(id).value,
        uid: supabase.auth.user().id,
      }),
    });

    const data = await response.json();
    data.status == "204" ? console.log({ method: "PATCH", id: id, res: "Updated" }) : console.log({ method: "PATCH", id: id, res: data });
  } catch (error) {
    console.log(error);
  }

  getAllNotes();
}

async function deleteNote(id) {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: supabase.auth.user().id }),
    });

    const data = await response.json();
    data.status == "204" ? console.log({ method: "DELETE", id: id, res: "Deleted" }) : console.log({ method: "DELETE", id: id, res: data });
  } catch (error) {
    console.log(error);
  }

  getAllNotes();
}
