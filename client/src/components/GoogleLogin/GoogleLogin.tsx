import React from 'react';
// import GoogleLogin from 'react-google-login';
import { GoogleLogin } from '@react-oauth/google'
import { login } from '../../api/GoogleAuth';

// import './GoogleLogin.css';

export default () => {
    const responseGoogle = async (authResult: any) => {
        try {
            console.log(authResult);
            const result = await login(authResult);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="mt-2">
            {/* <GoogleLogin
                clientId={'736115768308-77jadpfo2mp1qp7uq8fee01i14k6o8mp.apps.googleusercontent.com'}
                buttonText="Login with google"
                // render={renderProps => (
                //     <button onClick={renderProps.onClick} disabled={renderProps.disabled}>This is my custom Google button</button>
                // )}
                responseType="code"
                redirectUri="postmessage"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
            /> */}

            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    console.log(credentialResponse);
                    responseGoogle(credentialResponse);
                }}
                onError={() => {
                    console.log('Login Failed');
                }}
            />
        </div>
    );
};