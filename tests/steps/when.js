'use strict'

const APP_ROOT = '../../';
var axios = require('axios');

let we_invoke_get_index = () => {

    console.log("we_invoke_get_index")
    let handler = require(`${APP_ROOT}/functions/get-index`).handler;
    let context = {};
    let event = {};

    return handler(event, context);
};

let we_invoke_search_restaurants = async (user, theme) => {

    console.log("we_invoke_search_restaurants");

    var config = {
        headers: {'Authorization': user.idToken}
      };

    return await axios.post("https://qydsc31ue5.execute-api.us-east-1.amazonaws.com/dev/restaurants/search", {theme}, config)
};

module.exports = {
    we_invoke_get_index,
    we_invoke_search_restaurants
}
