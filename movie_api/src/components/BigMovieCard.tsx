import { Clock, ThumbsDown, ThumbsUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import parse from "html-react-parser"

const BigMovieCard = ({movie, scoreColor}) => {

  const [showEpisodes, setShowEpisodes] = useState(false);
  const [episodeResults, setEpisodeResults] = useState([[]]);
  
  let emptySeasons = false;

  useEffect(() => {
    if (showEpisodes == true)
    getEpisodes()
  }, [showEpisodes])

  useEffect(()=>{
    if (!movie)
      setShowEpisodes(false);
  },[movie])

  function parseGenres(){
    let output = ""
    movie.show.genres.forEach(element => {
      output += element + ", "
    });

    return output.substring(0, output.length - 2)
  }

  async function getEpisodes(){
    const seasonsResponse = await fetch(`https://api.tvmaze.com/shows/${movie.show.id}/seasons`)

    const seasonsResult = await seasonsResponse.json()
    console.log(seasonsResult)

    const allEpisodes = await Promise.all(seasonsResult.map(season => fetch(`https://api.tvmaze.com/seasons/${season.id}/episodes`).then(r => r.json())))

    setEpisodeResults(allEpisodes[0])
    console.log(allEpisodes)
    console.log("HAPPY")
    emptySeasons = false;
  }

  return (
    <div className='w-[65dvw] h-[60dvh] rounded-2xl bg-[#212020] outline outline-[#2a2a2a] p-5 gap-8 flex items-center '>
      <img src={movie.show.image?.original ||  "/nonamejpg.jpg"} className='w-78 rounded-2xl ml-4'/>
      <div className='block flex-col justify-start  border-white w-full h-full pt-3'>
        <div className='flex justify-between'>
          <div className='flex flex-row gap-4'>
            <h1 className=' border-white w-fit font-bold text-3xl'>{movie.show.name}</h1>
            <div className={`${scoreColor(Math.min(Math.round(movie.score * 100)))} w-fit h-fit py-2 rounded-full flex justify-center items-center align-middle px-2 gap-0.5`}>
              <p>
                {Math.min(Math.round(movie.score * 100))}%
              </p>
              {Math.min(Math.round(movie.score * 100)) < 45 ? <ThumbsDown className='scale-75'/> : <ThumbsUp className='scale-75'/>}
            </div>
          </div>
          <button className='bg-blue-600 text-white cursor-pointer rounded-2xl px-3 py-1 h-fit ' onClick={()=>{setShowEpisodes(!showEpisodes)}}>{!showEpisodes ? "Show seasons" : "Hide seasons"}</button>
        </div>
        <h2 className='text-[#c1c1c1]'>{movie.show.premiered ? movie.show.premiered : "Unknown date"}</h2>
        <h2>Genres: {parseGenres()}</h2>
        <div className=' border-white mt-3 text-[14px]'>
          {!showEpisodes ? parse(movie.show.summary) : 
              <div className=''>
                <h1 className='font-bold text-xl pb-2'>Episodes</h1>
                <div className='overflow-scroll h-84 border-white '>
                  {!emptySeasons ? episodeResults.map((episode) => (
                    <a href={episode.url}>
                      <div className='outline outline-[#2a2a2a] rounded-2xl w-full my-2 p-2 h-30 text-white bg-[#1b1a1a] flex'>
                          <img src={episode.image ? episode.image.medium : "https://placehold.co/250x140"} className="rounded-2xl h-25" alt="" />
                          <div className='flex flex-col px-3  w-full'>
                            <div className='flex flex-row justify-between gap-2 w-full border-white'>
                              <div className='flex flex-row gap-3 h-fit border-white'>
                                <h2 className='text-[15px] font-bold'>{episode.name}</h2>
                                <h2 className='text-[#ababab]'>S{episode.season} : E{episode.number}</h2>
                              </div>
                              <div className='flex text-[#ababab] gap-1 align-middle items-center'>
                                <h2 className=''>{episode.runtime} minutes</h2>
                                <Clock className='w-3 pt-0.5'/>
                              </div>
                            </div>
                            <h2 className='text-[#ababab]'>{episode.airdate}</h2>
                            <div className='text-[12px] text-[#c6c6c6]'>
                              {episode.summary ? parse(episode.summary) : ""}
                            </div>
                          </div>
                      </div>
                    </a>
                  )) :
                    <h2>No episodes found.</h2>
                  }
                </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
export default BigMovieCard