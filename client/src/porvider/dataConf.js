// require('dotenv').config({ path: '../../.env' });
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });



 const API_URL = process.env.API_URL;
 const SECRET_KEY = process.env.SECRET_KEY;


export { API_URL, SECRET_KEY }