import express from "express";
import jwt from "jsonwebtoken";

// Create an instance of express Router
const router = express.Router();

// Define the route to generate a token
router.get("/generateToken", (req, res) => {
  const token = jwt.sign(
    {
      shop_id: "1",    
      customer_id: "1", 
      product_id: "1",  
    },
    "your_secret_key",  
    { expiresIn: "7d" } 
  );

  res.json({ token });  
});

export default router;


















// import express from "express";
// import jwt from "jsonwebtoken";

// // Create an instance of express.Router() to define routes in a modular way
// const router = express.Router();

// // ✅ API Route to Generate and Send Token (To be used in cserver.ts)
// router.get("/generateToken", (req, res) => {
//   const token = jwt.sign(
//     {
//       shop_id: "1", 
//       customer_id: "1", 
//       product_id: "1", 
//     },
//     "your_secret_key", // Secret key used for token generation
//     { expiresIn: "7d" } // Set expiration time for the token
//   );

//   // Send token back as JSON response
//   res.json({ token });
// });

// // Export the router to be used in the server file
// export default router;
