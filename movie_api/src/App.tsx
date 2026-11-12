import { useRef, useState } from 'react'

let timer = null

function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('');

  const [searchResults, setSearchResults] = useState([])

  async function getResults(){
      const url = `https://api.tvmaze.com/search/shows?q=${text}`
    try{
      const response = await fetch(url)
      if (!response.ok)
        throw new Error(`Response status: ${response.status}`)

      const result = await response.json()
      console.log(result)
      setSearchResults(result);
    }
    catch(error){
      console.error(error.message)
    }
  }

  function debounce(newText){    
    setText(newText)
    if (timer)
      clearTimeout(timer)
    
    timer = setTimeout(()=>{
      getResults()
      console.log(`Searching for: ${text}`)
    }, 300)
  }

  return (
    <div id="main">
      <div>Search movies here!!</div>
      <input type="text" onChange={(e) => {debounce(e.target.value)}}/>
      <p>Searching for: {text}</p>
      <div id="search-results">
        {searchResults.map((movie) => (
          <div className='flex'>
            <h2>{movie.show.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
