

function init(){
  const input = document.getElementById('search-input')
  const label = document.querySelector("label")
  const icon = document.querySelector("div.icon")
  const results = document.querySelector("div.results")
  let resultIndex = 0;

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
    if (res[resultIndex].meta) {
      const syns = res[resultIndex].meta.syns[0].join(', ')
      const def = res[resultIndex].shortdef[0]
      const wordType = res[resultIndex].fl
      const word = res[resultIndex].hwi.hw
      let temp = templateResults(syns, def, word, wordType)
      results.innerHTML = temp
      if (res.length > 0) {
        let more = templateMoreResults(res)
        results.innerHTML += more
        let moreResults = document.querySelector('.more-results')
        moreResults.addEventListener('click', function(e){
          showMoreResults(res, query)
        })
      }
    } else {
        let temp = templateNoMatch(query)
        results.innerHTML = temp
        let searchAgain = document.querySelector('.search-again')
        searchAgain.addEventListener('click', function(e){
          input.focus()
        })
    }
  }

  function showMoreResults(res) {
    results.innerHTML = ''

    res.forEach(word => {
      console.log(word)
      let syns = word.meta.syns[0].slice(0,10).join(', ')
      let def = word.shortdef[0]
      let wordType = word.fl
      let query = word.hwi.hw
      let temp = templateResults(syns, def, query, wordType)

      results.innerHTML += temp
    })
  }

  function templateNoMatch(query){
    return `
      <div>
        <h3>No matches for ${query}</h3>
        <p class='search-again'>Search again?</p>
      </div>
    `
  }

  function templateMoreResults(results){
    return `
      <div>
        <p class='more-results'>Show more results</p>
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
