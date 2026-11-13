import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useRef, useState } from 'react'
import MoviePopup from './components/MoviePopup';
import BigMovieCard from './components/BigMovieCard';

let timer = null

function App() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('');

  const [searchResults, setSearchResults] = useState([])

  const [selectedMovie, setSelectedMovie] = useState(null)

  async function getResults(newText){
      const url = `https://api.tvmaze.com/search/shows?q=${newText}`
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
      getResults(newText)
      console.log(`Searching for: ${text}`)
    }, 300)
  }

  function scoreColor(score){
    if (score <= 35){
      return "bg-[#8b0303]"
    }
    else if (score < 60){
      return "bg-[#b8873c]"
    }
    else if (score < 75){
      return "bg-[#378f47]"
    }
    else{
      return "bg-[#156925]"
    }
  }

  return (
    <div id="main" className='w-dvw h-dvh bg-[#1a1c1c] text-white overflow-x-hidden overflow-y-scroll'>
      {selectedMovie &&
        <MoviePopup isOpen={!!selectedMovie} onClose={() => setSelectedMovie(null)}>
          <BigMovieCard movie={selectedMovie} scoreColor={scoreColor}/>
        </MoviePopup>
      }
      <h1 className='font-bold'>Search movies here!!</h1>
      <input type="text" className=" border-2 rounded-2xl p-1 pl-2" onChange={(e) => {debounce(e.target.value)}}/>
      <p>Searching for: {text}</p>
      <div id="search-results" className='inline-flex justify-center mx-3 mt-5 px-8 gap-7 flex-wrap items-center align-middle w-max-336 '>
        {searchResults.map((movie) => (
          <div className='bg-[#212020] outline outline-[#2a2a2a] w-50 h-95 rounded-2xl overflow-hidden hover:cursor-pointer hover:outline-4 hover:outline-[#636363] hover:drop-shadow-xl hover:drop-shadow-[#101010] scale-100 transition-all duration-75 hover:scale-103' onClick={()=>setSelectedMovie(movie)}>
            <div className='relative w-full'>
              <img src={movie.show.image?.medium || `${import.meta.env.BASE_URL}nonamejpg.jpg`} alt="" className='w-full block rounded-md h-69 border-b-2'/>
              <div className={`${scoreColor(Math.round(movie.score*100))} absolute flex flex-row drop-shadow-2xl drop-shadow-black align-middle items-center left-2 bottom-2.5 py-1.5 text-[12px] px-1 rounded-full  text-white`}>
                <p className='pl-1'>{Math.min(Math.round(movie.score * 100), 100)}%</p>
                {Math.round(movie.score *100) > 50? <ThumbsUp className='scale-60'/> : <ThumbsDown className='scale-60 pt-1'/>}
              </div>
            </div>
            <div className='ml-1'>
              <h2 className='mx-auto align-middle font-medium mt-1'>{movie.show.name}</h2>
              <p className='text-[14px]'>{movie.show.genres[0] ? movie.show.genres[0] : "Unknown genre"}</p>
              <p className='text-[13px]'>{movie.show.premiered ? movie.show.premiered : "Unknown date"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
