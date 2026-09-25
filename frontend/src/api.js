import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/auth',
});


// Function to handle Google login
export const googleAuth = async (code) => {
  try {
    const response = await api.get(`/google?code=${code}`);
    return response;
  }
    catch (error) {
    console.error('Error during Google login:', error);
    }
}

// Function to handle GitHub login
export const githubAuth = async (code)=>{
  try{
    const response = await api.get(`/github?code=${code}`);
    return response;
  }
  catch(error){
    console.error('Error during GitHub login:', error);
    throw error;
  }
};

//api was created at top of the file with baseURL of backend sever, calling api.get('/github?code='+code) sends a GET request to http://localhost:8080/auth/github?code=... , this triggers the function githubLogin