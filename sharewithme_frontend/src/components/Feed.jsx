import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'

import {client} from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'
import { feedQuery, searchQuery } from '../utils/data'

export default function Feed() {
  const [loading, setLoading] = useState(true)
  const [pins, setPins] = useState(null)
  const {categoryId} = useParams()

  useEffect(() => {
    setLoading(true)
    
    if(categoryId){
      const query = searchQuery(categoryId)

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
  
  }, [categoryId])

  if(loading) return <Spinner message="we are adding new ideas to your feed" />
  return (
    <div>
      {pins && <MasonryLayout pins={pins}/>}
    </div>
  )
}
