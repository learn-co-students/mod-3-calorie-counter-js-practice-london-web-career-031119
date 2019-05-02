// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.

// VAR
CAL_URL = 'http://localhost:3000/calorie_entries'
BMR_URL = 'http://localhost:3000/bmr'
STATE = {
   entries: [],
   selectEntry: null,
   bmr: null,
   cals: null
}

// API
const getEntries = () => fetch(CAL_URL)
   .then(r => r.json()).then((data)=>STATE.entries = data).catch((error)=>alert(error))

const patchEntry = (entry) => fetch(CAL_URL + `/${entry.id}`, {
   method: 'PATCH',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(entry)
}).then(r => r.json()).catch((error)=>alert(error))

const postEntry = (entry) => fetch(CAL_URL, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(entry)
}).then(r => r.json()).catch((error)=>alert(error))

const deleteEntry = (id) => fetch(CAL_URL + `/${id}`, {
   method: 'DELETE' }).catch((error)=>alert(error))

const postBMR = (bmr) => fetch(BMR_URL, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(bmr)
}).then(r => r.json()).catch((error)=>alert(error))

const getBMR = () => fetch(BMR_URL).then(r => r.json()).then((data)=>STATE.bmr = data.bmr).catch((error)=>alert(error))

// Display Agents
const showEntries = entries => entries.forEach(renderEntry)

const renderEntry = entry => {
   const entryLi = document.createElement('li')
   entryLi.className = 'calories-list-item'
   entryLi.innerHTML = `
      <div class="uk-grid">
         <div class="uk-width-1-6">
            <strong>${entry.calorie}</strong>
            <span>kcal</span>
         </div>
         <div class="uk-width-4-5">
            <em class="uk-text-meta">${entry.note}</em>
         </div>
      </div>
      <div class="list-item-menu">
         <a class="edit-button" onclick="editForm(${entry.id})" uk-toggle="target: #edit-form-container">✎</a>
         <a class="delete-button" onclick="deleteEntry(${entry.id}).preventDefault()">✘</a>
      </div>`
   const li = document.querySelector('ul#calories-list')
   li.append(entryLi)
}

const findEntry = id => STATE.entries.find((e)=>e.id === id)

const editForm = (id) => {
   STATE.selectEntry = id
   const entry = findEntry(id)
   const form = document.querySelector('#edit-calorie-form')
   form.elements[0].value = entry.calorie
   form.elements[1].value = entry.note
}

const editEntry = (data) => {
   const entry = {
      id: STATE.selectEntry,
      calorie: parseInt(data[0].value),
      note: data[1].value
   }
   patchEntry(entry)
}

const newEntry = (data) => {
      const entry = {
         calorie: parseInt(data[0].value),
         note: data[1].value
      }
      postEntry(entry)
   }

const calcBMR = (data) => {
   STATE.bmr = Math.round((10*data[0].value) + (6.25*data[1].value) - (5*data[2].value) + 5)
   postBMR({bmr: STATE.bmr})
   renderBMR(STATE.bmr)
}
   // M= BMR = 10W + 6.25H - 5A + 5
   // F= BMR = 10W + 6.25H - 5A - 161
const renderBMR = data => {
   bmr = document.querySelector('span#bmr')
   bmr.innerHTML = data
}

const renderProgress = () => {
   STATE.entries.map((entry) => STATE.cals += entry.calorie)
   const progress = document.querySelector('progress.uk-progress')
   progress.value = (STATE.cals/STATE.bmr)*100
}

// Init

window.addEventListener('DOMContentLoaded', () => {
   getEntries().then(showEntries)
   getBMR().then(renderBMR).then(renderProgress)
})