// Sets the MongoDB Database options

module.exports = {
    mongolab:
    {
        name: "pro-users",
        url: "mongodb://root:partner@ds019658.mlab.com:19658/partner",
        port:3000
        
    },

    local:
    {
        name: "pro-users",
        url: "mongodb://localhost/users",
        port: 3000
    }


};
