
module.exports = function (request, response, next)
{
    response.put = function (compute)
    {
        compute(handleResponse);
    };

    response.handle = handleResponse;
    
    function handleResponse(error, data)
    {
        if (error)
            response.json({success: false, error: error});
        else if (data)
            response.json({success: true, data: data});
        else
            response.json({success: true});
    }

    next();
};


