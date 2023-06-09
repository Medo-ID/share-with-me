import React, {useState, useEffect} from 'react'

import MasonaryLayout from './MasonryLayout'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import Spinner from './Spinner'

function Search({searchTerm}) {
  const [pins, setPins] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(searchTerm){
      setLoading(true)
      const query = searchQuery(searchTerm.toLowerCase())
      
      client.fetch(query)
      .then((data) => {
        setPins(data)
        setLoading(false)
      })
    }
    else{
      client.fetch(feedQuery)
      .then((data) => {
        setPins(data)
        setLoading(false)
      })
    }
  }, [searchTerm])
  
  
  return (
    <div>
      {loading && <Spinner message='Searching for pins'/>}
      {pins?.length !== 0 && <MasonaryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading (
        <div className='mt-1o text-center text-xl'>No Pins Found!</div>
      )}
    </div>
  )
}

export default Search