const getIntake = () =>
    fetch(url)
    .then(resp => resp.json())

const createIntake = intake =>
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(intake)
    }).then(resp => resp.json())


const deleteIntake = intake =>
    fetch(url + `/${intake.id}`, {
        method: 'DELETE'
    })

const updateIntake = intake =>
    fetch(url + `/${intake.api_v1_calorie_entry.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(intake)
    }).then(resp => resp.json())