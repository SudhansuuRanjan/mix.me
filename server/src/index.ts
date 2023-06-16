import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8080;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:8080/callback';


import express, { Express, Request, Response } from 'express';
import request from 'request';
import cors from 'cors';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import { generateRandomString } from './utils';

let stateKey: string = 'spotify_auth_state';

const app: Express = express();

app.use(cors())
    .use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

app.get('/login', (req: Request, res: Response) => {
    let state = generateRandomString(16);
    res.cookie(stateKey, state);

    let scope = 'user-read-private user-read-email user-read-recently-played user-top-read user-follow-read user-follow-modify playlist-read-private playlist-read-collaborative playlist-modify-public user-library-read';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,
            state: state
        }));
})

/**
 * The /callback endpoint is called by the Spotify Accounts service after the user either logs in successfully, or denies authorization.
 * If the user authorizes your application, the authorization server redirects the user back to your application with the authorized code.
 * If the user does not authorize your application, the authorization server redirects the user back to your application with the error query string parameter.
 * The authorization code returned by the Spotify Accounts service is passed to the application server’s /callback endpoint, along with the state parameter that the application server specified when requesting authorization.
 * The application server then makes a request to the Spotify Accounts service, requesting an access token.
 * The Spotify Accounts service verifies the application’s request and returns an access token and a refresh token.
 * The application server returns the access token to the client.
 * The client uses the access token to access the Spotify Web API.
 * The client can also use the refresh token to obtain a new access token.
 * The client can repeat this process any time an access token is required.
 */
app.get('/callback', (req: Request, res: Response) => {
    // retrieves the code and state from the request query parameters and the stored state from cookies.
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    //checks if the state is valid and matches the stored state.
    // If the state is invalid or mismatched, it redirects the user to an error page indicating a state mismatch.
    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        // If the state is valid, it clears the cookie and makes a request to the Spotify Accounts service to get an access token.
        res.clearCookie(stateKey);
        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
            },
            json: true
        };

        // The response contains an access token and a refresh token.
        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {

                let access_token = body.access_token,
                    refresh_token = body.refresh_token;

                let options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                request.get(options, (error, response, body) => {
                    console.log(body);
                });

                // The access token allows you to make requests to the Spotify API’s endpoints on the user’s behalf.
                res.redirect('http://localhost:5173/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                // If the request is not successful, it redirects the user to an error page.
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });


    }
});

/**
 * The /refresh_token endpoint returns a new access token using the refresh token.
 * This endpoint is called if the access token expired (or is about to expire).
 * The refresh token is unique to each user and can be used indefinitely.
 */
app.get('/refresh_token', (req: Request, res: Response) => {

    // request access token from refresh token
    let refresh_token = req.query.refresh_token;
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };


    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            let access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀.`);
});