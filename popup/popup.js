

function init(){
  const input = document.getElementById('search-input')
  const label = document.querySelector("label")
  const icon = document.querySelector("div.icon")
  const results = document.querySelector("div.results")

  input.addEventListener('keydown', inputKeyDown)
  input.addEventListener('focus', updateLabel)
  input.addEventListener('blur', removeFilled)
  icon.addEventListener('click', submitQuery)

  function inputKeyDown(e){
    updateLabel()
    if (e.code === 'Enter') {
      submitQuery()
    }
  }

  function updateLabel(){
    if (input && label.className === 'input-label') {
      label.className = 'input-label filled'
    }
  }

  function removeFilled(){
    if (!input.value && label.className === 'input-label filled') {
      label.className = 'input-label'
    }
  }

  function submitQuery(){
    let query = input.value
    input.value = ''
    input.blur()
    if (query){
      makeRequest(query)
        .then(res => {
          appendResults(res, query)
        })
    }
  }

  function makeRequest(query){
    return fetch(`${BASE_URL}${query}`)
      .then(res => res.json())
  }

  function appendResults(res, query){
    if (res[0].meta) {
      console.log(res[0])
      const syns = res[0].meta.syns[0].join(', ')
      const def = res[0].shortdef[0]
      const wordType = res[0].fl
      let temp = templateResults(syns, def, query, wordType)
      results.innerHTML = temp
    } else {
        let temp = templateNoMatch(query)
        results.innerHTML = temp
        let searchAgain = document.querySelector('.search-again')
        searchAgain.addEventListener('click', function(e){
          input.focus()
        })
    }
  }

  function templateNoMatch(query){
    return `
      <div>
        <h3>No matches for ${query}</h3>
        <p class='search-again'>Search again?</p>
      </div>
    `
  }

  function templateResults(syns, def, query, wordType){
    return `
      <div>
        <h3>${query} (${wordType})</h3>
        <p>${def}</p>
        <p>${syns}</p>
      </div>
    `
  }
}


document.addEventListener('DOMContentLoaded', init)
