const URL = 'http://localhost:3000/api/v1/calorie_entries'

const getFoods = () =>
  fetch(URL)
  .then(resp=>resp.json())

const createFood = (food) =>
  fetch(URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(food)
  }).then(resp => resp.json())

const updateFood = (food) =>
  fetch(URL+`/${food.id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(food)
  }).then(resp => resp.json())

const deleteFood = (food) =>
  fetch(URL+`/${food.id}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
  }).then(resp => resp.json())
