import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()


const allowedOrigins = [
  "http://localhost:8080", // local dev
  "https://procure-wise-new.vercel.app" 
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / server-side
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("Not allowed by CORS"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


//initially we had to use body parser

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"))
app.use(cookieParser());


// for files we use third party package multer
// when I have data from url then all use it
// routes import
app.get("/",(req,res)=>{
   res.send("hello world")
})
import rfpRoutes from './routes/rfp.routes.js'
import quotationRoutes from './routes/quotation.routes.js'
import vendorScoreRoutes from './routes/vendorScore.routes.js'
import contractRoutes from './routes/contract.routes.js'
//routes declaration
//now we need middlewareWrapper
app.use('/api/rfps', rfpRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/vendor-score', vendorScoreRoutes);
app.use('/api/contract-audit', contractRoutes);


// http://localhost:8000/users/register
export {app}