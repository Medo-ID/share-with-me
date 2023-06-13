import React, {useState, useEffect} from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom'

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data'
import { client } from '../client'
import MasonaryLayout from './MasonryLayout'
import Spinner from './Spinner'

const randomImageUrl = 'https://source.unsplash.com/1600x900/?nature,photography,technology'
const activeBtnStyles = 'bg-bgButton text-white font-bold p-2 rounded-xl w-20 outline-none'
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-xl w-20 outline-none'

function UserProfile() {
  const [user, setUser ] = useState(null)
  const [pins, setPins] = useState(null)
  const [text, setText] = useState('Created')
  const [activeBtn, setActiveBtn] = useState('created')

  const navigate = useNavigate()
  const {userId} = useParams()

  useEffect(() => {
    const query = userQuery(userId)

    client.fetch(query)
    .then((data) => {
      setUser(data[0])
    })

  }, [userId])
  
  useEffect(() => {
    if(text === 'Created'){
      const craetedPinsQuery = userCreatedPinsQuery(userId)
      client.fetch(craetedPinsQuery)
      .then((data) => {
        setPins(data)
      })
    }
    else{
      const savedPinsQuery = userSavedPinsQuery(userId)
      client.fetch(savedPinsQuery)
      .then((data) => {
        setPins(data)
      })
    }

  }, [text, userId])

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  if(!user){
    return <Spinner message='Loading Profile ...' />
  }

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>
          <div className='flex flex-col justify-center items-center'>
            <img 
              src={randomImageUrl}
              alt='bannerPic'
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
            />
            <img 
              src={user.image}
              alt='userPic'
              className='rounded-full w-30 h-30 -mt-10 shadow-xl object-cover'
            />
            <h1 className='font-bold text-2xl text-center mt-3'>{user.userName}</h1>
            <div className='absolute top-0 z-1 right-0 p-2'>
              {userId === user._id && (
                <button
                  type='button'
                  onClick={logout}
                  className='bg-white flex justify-center items-center  text-dark rounded-lg py-2 px-2 text-base font-semibold'
                >
                  <AiOutlineLogout style={{marginRight: '4px'}}/>
                  Log out
                </button>
              )}
            </div>
          </div>
          <div className='text-center mb-7'>
          <button
            type='button'
            onClick={(event) => {
              setText(event.target.textContent)
              setActiveBtn('created')
            }}
            className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
          >
          Created
          </button>
          <button
            type='button'
            onClick={(event) => {
              setText(event.target.textContent)
              setActiveBtn('saved')
            }}
            className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
          >
          Saved
          </button>
          </div>
          {pins?.length ? (
            <div className='px-2'>
              <MasonaryLayout pins={pins}/>
            </div>
          ):(
            <div className='flex justify-center items-center font-bold w-full text-xl mt-2'>
              No Pins Found!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile