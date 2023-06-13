import React from 'react'
import {useNavigate} from 'react-router-dom'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleLogin } from '@react-oauth/google'
import jwt_decode from 'jwt-decode'
import {client} from '../client'


function Login() {
    const navigate = useNavigate()
    const handleGoogleResponse = credentialResponse => {
        const decodedCredentialResponse = jwt_decode(credentialResponse.credential)
        localStorage.setItem('user', JSON.stringify(decodedCredentialResponse))
        const {name, sub, picture} = decodedCredentialResponse
        const document = {
            _id: sub,
            _type: 'user',
            userName: name,
            image: picture
        }

        client.createIfNotExists(document)
        .then(()=>{
            navigate('/', {replace: true})
        })
    }
    
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
            <div className='flex justify-start items-center flex-col h-screen'>
                <div className='relative w-full h-full'>
                    <video 
                        src={shareVideo}
                        type='video/mp4'
                        loop
                        controls={false}
                        muted
                        autoPlay
                        className='w-full h-full object-cover'
                    />
                    <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
                        <div className='p-5'>
                            <img src={logo} alt="ShareWithU Logoe" width='250px' />
                        </div>
                        <div className='shadow-2xl'>
                        <GoogleLogin
                            onSuccess={handleGoogleResponse}
                            onError={() => console.log('Login Failed')}
                            useOneTap
                        />
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    )
}

export default Login