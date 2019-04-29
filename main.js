// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.

// Existing List
CAL_ENTRIES_URL = 'http://localhost:3000/api/v1/calorie_entries'

// API
const getEntries = () => fetch(CAL_ENTRIES_URL)
   .then(r => r.json())

const updateEntry = (entry) => fetch(CAL_ENTRIES_URL + `/${entry.id}`, {
   method: 'PATCH',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(entry)
})

const addEntry = (entry) => fetch(CAL_ENTRIES_URL, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(entry)
}).then(r => r.json())

const deleteEntry = (id) => fetch(CAL_ENTRIES_URL + `/${id}`, {
   method: 'DELETE' })

// Display Agents
const showEntries = entries => entries.forEach(showEntry)

const showEntry = entry => {
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
         <a class="edit-button" data-edit-id="${entry.id}" uk-toggle="target: #edit-form-container">✎</a>
         <a class="delete-button" data-del-id="${entry.id}">✘</a>
      </div>`
   entryLi.addEventListener('click',(e) => entryAction(entry, e.target.className))
   const li = document.querySelector('ul#calories-list')
   li.append(entryLi)
}

// DOM
const entryAction = (entry, action) => {
   if (action === 'edit-button') {
      console.log('EDIT')
      form = document.querySelector('form#new-calorie-form')
      form.addEventListener('submit', (e) => {
         e.preventDefault()
         form.calorie = entry.calorie
         form.note = entry.note
         const data = {
            id: entry.id,
            calorie: form.target.calorie,
            note: form.target.note
         }
         updateEntry(data)
      })
   } else if (action === 'delete-button') {
      console.log('DEL')
      deleteEntry(entry.id)
   } else { console.log(action) }
}

const initEntryForm = () => {
   const form = document.querySelector('form#new-calorie-form')
   form.addEventListener('submit', (e) => {
      e.preventDefault()
      const entry = {
         calorie: form.target.calorie,
         note: form.target.note
      }
      addEntry(entry)
   })
}

// Init
window.addEventListener('DOMContentLoaded', () => {
   getEntries().then(showEntries)
   initEntryForm()
})