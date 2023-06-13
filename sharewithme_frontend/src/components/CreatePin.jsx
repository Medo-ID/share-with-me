import React, {useState} from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { MdPublish } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import { client } from '../client'
import Spinner from './Spinner'
import { categories } from '../utils/data'

const CreatePin = ({user}) => {
  const [title, setTitle] = useState('')
  const [about, setAbout] = useState('')
  const [destination, setDestination] = useState('')
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState(false)
  const [category, setCategory] = useState(null)
  const [imageAsset, setImageAsset] = useState(null)
  const [wrongImageType, setWrongImageType] = useState(false)
  
  const navigate = useNavigate()
  
  const uploadImage = (event) => {
    const {type, name} = event.target.files[0]
    if(type === 'image/png' || type === 'image/svg' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/tiff'){
      setWrongImageType(false)
      setLoading(true)

      client.assets
        .upload('image', event.target.files[0], {contentType: type, filename: name})
        .then((document) => {
          setImageAsset(document)
          setLoading(false)
        })
        .catch((error) => {
          console.log('Image upload error', error)
        })
    }
    else{
      setWrongImageType(true)
    }
  }

  const publishPin = () =>{
    if(title && about && destination && imageAsset?._id && category){
      const document = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref : imageAsset?._id
          }
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id
        },
        category
      }

      client.create(document)
      .then(() => {
        navigate('/')
      })
    }
    else{
      setFields(true)
      setTimeout(() => setFields(false), 4000)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {fields && (
        <p className='text-red-700 mb-5 text-base transition-all duration-150 ease-in'>Please fill in all the fields</p>
      )}
      <div className='flex lg:flex-row flex-col justify-center items-center lg:p-5 p-3 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-4 border-double border-gray-300 p-3 w-full h-420'>
            {loading && <Spinner />}
            {wrongImageType && <p>Wrong image type</p>}
            {!imageAsset ? (
              <label>
                <div className='flex flex-col items-center justify-center h-full'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold text-2xl'>
                      <AiOutlineCloudUpload />
                    </p>
                    <p className='text-sm'>Click to Upload</p>
                  </div>
                  <p className='mt-32 text-sm text-gray-400 text-center'>
                    Use high-quality JPG, SVG, PNG, GIF less than 20 MB
                  </p>
                </div>
                <input 
                  type='file'
                  name='upload-image'
                  onChange={uploadImage}
                  className='w-0 h-0'
                />
              </label>
            ) : (
              <div className='relative h-full'>
                <img src={imageAsset?.url} alt='uploadedImage'className='h-full w-full'/>
                <button
                  type='button'
                  className='absolute bottom-3 right-3 p-3 rounded-full bg-red-700 text-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>
          
          <input 
            type='text'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder='Add your title here'
            className='outline-none text-lg sm:text-xl font-bold border-b-2 border-gray-200 p-2'
          />
          
          {user && (
            <div className='flex gap-2 mt-2 mb-2 items-center  rounded-lg'>
              <img
                src={user.image}
                className="w-10 h-10 rounded-full"
                alt="user-profile"
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}

          <input 
            type='text'
            value={about}
            onChange={(event) => setAbout(event.target.value)}
            placeholder='What is your pin about'
            className='outline-none text-base sm:text-base border-b-2 border-gray-200 p-2'
          />

          <input 
            type='text'
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder='Add a destination link for your pin'
            className='outline-none text-base sm:text-base border-b-2 border-gray-200 p-2'
          />

          <div className='flex flex-col'>
            <div>
              <p className='mb-2 font-semibold text-sm sm:text-base'>Choose Pin Category</p>
              <select
                onChange={(event) => setCategory(event.target.value)}
                className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'
              >
                <option value='other' className='sm:text-bg bg-white'>Select Category</option>
                {categories.map((category) => (
                  <option value={category.name} className=''>{category.name}</option>
                ))}
              </select>           
            </div>
            <div className='flex justify-end items-end mt-5'>
              <button
                type='button'
                onClick={publishPin}
                className='flex items-center bg-bgButton text-white font-bold text-base px-5 py-2 hover:drop-shadow-lg rounded-lg outline-none transition'
              >
                <MdPublish style={{marginRight: '4px'}}/> Publish
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default CreatePin