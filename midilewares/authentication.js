Api = {
  authorise: () => {
    return (req, res, next) => {
      if (req.headers.authorization) {
        var token = req.headers.authorization;
        token = token.substring(7);
        if(token=='FSMovies2021'){
          next()
        }else{
          res.json({
            error: "auth_failed",
            error_description: "Authentication failed. invalid token.",
          });
          return
        }
        
      } else {
        res.json({
          error: "auth_failed",
          error_description: "Authentication failed. No token.",
        });
        return
      }
    };
  },
};
module.exports = Api;
