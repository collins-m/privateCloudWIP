import axios from 'axios'
//use axios libraries to post 
export const register = newUser => {
    return axios
    .post('/api/user/register', {
        firstname: newUser.firstname, 
        surname: newUser.surname,
        email: newUser.email,
        password: newUser.password, //Post registration with 4 information
    }).then(res => {
        console.log('Successfully Registered!') //Output to console 
        console.log(res.data) //OUput data on cosole
    })
}
//Post to authenticate user in backend
export const login = user => {
    return axios    
.post('/api/user/authenticate', {
        email: user.email, 
        password: user.password //Post with two parameters to backend
    }).then(res => {
        localStorage.setItem('usertoken', res.data.token) //tolen saved in local storage usertoken
        return res.data
    }).catch(err => {
        console.log(err)
    })
}