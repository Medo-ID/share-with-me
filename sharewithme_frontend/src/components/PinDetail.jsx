import React, {useState, useEffect} from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import {Link, useParams} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'

import {client, urlFor} from '../client'
import MasonryLayout from './MasonryLayout'
import {pinDetailMorePinQuery, pinDetailQuery} from '../utils/data'
import Spinner from './Spinner'

export default function PinDetail({ user }) {
  const [pins, setPins] = useState(null)
  const [pinDetails, setPinDetails] = useState(null)
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)
  const {pinId} = useParams()

  const addComment = () => {
    if(comment){
      setAddingComment(true)

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{ 
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          } 
        }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  }

  const fetchPinDetails = () => {
    let query =pinDetailQuery(pinId)
    
    if(query){
      client.fetch(query)
      .then((data) => {
        setPinDetails(data[0])
        if(data[0]){
          query = pinDetailMorePinQuery(data[0])
          client.fetch(query)
          .then((response) => setPins(response))
        }
      })
    }
  }

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);


  if(!pinDetails) return <Spinner message="Loading Pin..."/>
    
  return (
    <>
      <div className='flex xl-flex-row flex-col m-auto ' style={{maxWidth: '1200px', borderRadius: '32px'}}>
        <div className='flex justify-center items-center md:items-start flex-initial'>
          <img 
            src={pinDetails?.image && urlFor(pinDetails.image).url()} 
            className='rounded-3xl' style={{maxHeight: '900px'}}
            alt='pinImage'
          />
        </div>
        <div className='w-full p-5 flex-1 xl:min-w-620'>
          <div className='flex items-center justify-between'>
            <div className='flex gap-2 items-center'>
            <a
              href={`${pinDetails.image?.asset?.url}?dl=`}
              download
              onClick={(event) => event.stopPropagation()}
              className='bg-black w-9 h-9 rounded-full flex items-center justify-center text-white text-xl opacity-80 hover:opacity-100 hover:shadow-md outline-none'
            >
              <MdDownloadForOffline />
            </a>
            </div>
            <a
              href={pinDetails.destination} target='_blank' rel='noreferrer'
              className='bg-black flex items-center gap-2 text-sm text-white font-bold px-2 py-2 rounded-lg opacity-80 hover:opacity-100 hover:shadow-md'
            >
              {pinDetails.destination}
            </a>
          </div>
          <div>
            <h1 className='text-2xl font-bold break-words mt-3'>{pinDetails.title}</h1>
            <p className='mt-3'>{pinDetails.about}</p>
          </div>
          <Link to={`user-profile/${pinDetails.postedBy?._id}`} className='flex gap-2 mt-5 items-center  rounded-lg'>
            <img 
              src={pinDetails.postedBy?.image} 
              alt='user-profile'
              className='w-8 h-8 rounded-full object-cover'
            />
              <p className='font-semibold capitalize'>{pinDetails.postedBy?.userName}</p>
          </Link>
          <h2 className='mt-5 text-base'>Comments</h2>
          <div className='max-h-370 overflow-y-auto'>
            {pinDetails?.comments?.map((comment, index) => (
              <div className='flex gap-2 mt-5 items-center  rounded-lg' key={index}>
                <img 
                  src={comment.postedBy.image}
                  alt='user-profile'
                  className='w-10 h-10 rounded-full cursor-pointer'
                />
                <div className='flex flex-col'>
                  <p className='font-bold'>{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className='flex items-center justify-center flex-wrap mt-6 gap-3'>
          <Link to={`user-profile/${pinDetails.postedBy?._id}`} className='flex gap-2 items-center  rounded-lg'>
            <img 
              src={pinDetails.postedBy?.image} 
              alt='user-profile'
              className='w-10 h-10 rounded-full object-cover'
            />
          </Link>
          <input
            type='text'
            className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-xl focus:border-gray-300'
            placeholder='Add your comment'
            value={comment}
            onChange={(event) => setComment(event.target.value)}
          />
          <button
            type='button'
            className='bg-green-600 text-white rounded-xl px-6 py-2 font-semibold text-base outline-none'
            onClick={addComment}
          >
            {addingComment ? 'Posting the comment ...' : 'Post'}
          </button>
          </div>
        </div>
      </div>
      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      <div className='flex xl-flex-row flex-col m-auto ' style={{maxWidth: '1200px', borderRadius: '32px'}}>
        {pins ? (
          <MasonryLayout pins={pins} />
        ) : (
          <Spinner message="Loading more pins" />
        )}
      </div>
    </>
  )
}
