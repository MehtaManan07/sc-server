const axios = require('axios')
// const a = { populatename: "avatar, username", populateduh: "avatar, username" };
// const b = [
//   { a: 1, e: 2, i: 3, o: 5, u: 9 },
//   { a: 1, e: 20, i: 3, o: 5, u: 9 },
//   { a: 1, e: 24, i: 3, o: 5, u: 9 },
//   { a: 1, e: 21, i: 3, o: 5, u: 9 },
// ];
// const items = [{id:2, name: 'qwerty'}, {id:1, name: 'abcdef'}, {id:4, name: 'poing'}];
// let neww = items.filter(duh => duh.id !== 2)
// // neww.push({ id: 21, name: '' })
// console.log({items, neww})
axios.get('https://jsonplaceholder.typicode.com/posts/190/comments')
  .catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log({data: error.response.data});
      console.log({status: error.response.status});
      // console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log({config: error.config});
  });