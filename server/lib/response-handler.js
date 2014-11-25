/*
 * Copyright (c) 2014, Patrice Boulet & Nicholas Gagnon
 * All rights reserved.
 */

module.exports = function (request, response, next) {
    response.put = function (key, task) {
        task(handleResponse.bind(this, key));
    };

    response.handle = function (key) {
        return handleResponse.bind(this, key);
    };
    
    response.fail = function (error) {
        response.json({ "success": false, "error": error });
    };
    
    function handleResponse(key, error, data)
    {
        var jsonResponse = {};

        if (error)
            jsonResponse = {success: false, error: error};
        else if (!data)
            jsonResponse = {success: true};
        else
        {
            jsonResponse.success = true;
            jsonResponse[key] = data;
        }
            
        response.json(jsonResponse);
    }

    next();
};


