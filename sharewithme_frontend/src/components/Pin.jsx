import React, {useState}from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import {MdDownloadForOffline} from 'react-icons/md'
import {AiTwotoneDelete} from 'react-icons/ai'
import {BsFillArrowUpRightCircleFill} from 'react-icons/bs'

import { client, urlFor } from '../client'
import { fetchUser } from '../utils/fetchUser'

function Pin({pin: {postedBy, image, _id, destination, save}}) {
    const [postHovered, setPostHovered] = useState(false)
    
    const navigate = useNavigate()
    const user = fetchUser()

    const alreadySaved = !!(save?.filter((item) => item.postedBy._id === user.sub))?.length
    console.log(alreadySaved)
    
    const savePin = (id) => {
        
        if(!alreadySaved){
            client
                .patch(id)
                .setIfMissing({save: []})
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user.sub,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user.sub
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload()
                    
                })
        }
    }

    const deletePin = (id) => {
        client
            .delete(id)
            .then(() => {
                window.location.reload()
            })
    }

    return (
        <div className='m-2'>
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
            >
                <img className='rounded-lg w-full' alt='user-post' src={urlFor(image).width(250).url()}/>
                {postHovered && (
                    <div 
                        className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-1 pb-2 z-50'
                        style={{height: '100%'}}
                    >
                        <div className='flex items-center justify-between'>
                            <div className='flex gap-2'>
                                <a
                                    href={`${image?.asset?.url}?dl=`}
                                    download
                                    onClick={(event) => event.stopPropagation()}
                                    className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-60 hover:opacity-100 hover:shadow-md outline-none'
                                >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            {alreadySaved ? (
                                <button 
                                    type='button' 
                                    className='bg-white opacity-60 hover:opacity-100 text-black font-semibold px-2 py-1 text-sm rounded-3xl hover:shadow-md outlined-none'
                                >
                                    {save?.length} Saved
                                </button>
                            ) :
                            (
                                <button 
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        savePin(_id)
                                    }}
                                    type='button'
                                    className='bg-white opacity-60 hover:opacity-100 text-black font-semibold px-2 py-1 text-sm rounded-3xl hover:shadow-md outlined-none'
                                >
                                    Save
                                </button>
                            )}
                        </div>
                        <div className='flex justify-between items-center gap-2 w-full'>
                            {destination && (
                                <a
                                    href='{destination}'
                                    target='_blank'
                                    rel='noreferrer'
                                    className='bg-white flex items-center gap-2 text-sm text-black font-bold p-1 pl-2 pr-2 rounded-full opacity-60 hover:opacity-100 hover:shadow-md'
                                >
                                    <BsFillArrowUpRightCircleFill />
                                    {destination.length > 20 ? destination.slice(8, 20) : destination.slice(8)}
                                </a>
                            )}
                            {postedBy?._id === user.sub && (
                                <button
                                    type='button'
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        deletePin(_id)
                                    }}
                                    className='bg-red-700 p-2 opacity-60 hover:opacity-100 text-white font-bold text-base rounded-3xl hover:shadow-md outlined-none'
                                >
                                    <AiTwotoneDelete />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Link to={`user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
                <img 
                    src={postedBy?.image} 
                    alt='user-profile'
                    className='w-8 h-8 rounded-full object-cover'
                />
                <p className='font-semibold capitalize'>{postedBy?.userName}</p>
            </Link>
        </div>
    )
}

export default Pin