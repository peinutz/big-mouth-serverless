'use strict';

let initialized = false;

let init = () => {
    if(initialized) 
        return;
    
        process.env.restaurants_api = "https://qydsc31ue5.execute-api.us-east-1.amazonaws.com/dev/restaurants";
        process.env.restaurants_table = "restaurants";
        process.env.AWS_REGUIN = "us-east-1";
        process.env.cognito_user_pool_id = "us-east-1_gjBnaWfuj";
        process.env.cognito_client_id = "test_pool_id";
        process.env.cognito_server_client_id = "6q5p4kdhk88tnp6vmham1cfu0o";


        initialized = true;
}

module.exports = {
    init
}