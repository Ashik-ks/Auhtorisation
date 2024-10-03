'use strict';
const userType = require('../model/userTypes')

module.exports = {
  up: (models, mongoose) => {
    
      return models.userType.insertMany([
        {
          _id : "66fe4baba64f2268d2006b2c",
          userType : "Admin"
        },
        {
          _id : "66fe4c08a64f2268d2006b2d",
          userType : "Employee"
        },
      ]).then(res => {
     
      console.log(res.insertedCount);
    });
    
  },

  down: (models, mongoose) => {
    
      return models.userType.deleteMany({
        _id : {
          $in : [
            "66fe4baba64f2268d2006b2c",
            "66fe4c08a64f2268d2006b2d"
          ]
        }
      }).then(res => {
    
      console.log(res.deletedCount);
      });
   
  }
};
