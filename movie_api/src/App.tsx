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

  async function getYear(str){
    return str.substring(0,4)
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
      <h1 className='font-bold'>Search movies here!!</h1>
      <input type="text" className="border-2 rounded-2xl p-1" onChange={(e) => {debounce(e.target.value)}}/>
      <p>Searching for: {text}</p>
      <div id="search-results" className='flex flex-row justify-start mx-3 mt-5 flex-wrap items-center align-middle'>
        {searchResults.map((movie) => (
          <div className='border-2 border-black w-50 mx-3 h-90 my-2 rounded-2xl overflow-hidden align-middle items-center '>
            <img src={movie.show.image?.medium ||  "/nonamejpg.jpg"} alt="" className='w-full rounded-md h-69 border-b-2'/>
            <div className='ml-0.5'>
              <h2 className='mx-auto align-middle font-medium mt-1'>{movie.show.name}</h2>
              <p className='text-[13px]'>{movie.show.premiered}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
