import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app=express()
app.use(cors({
    origin:"https://procure-wise-new.vercel.app/",
    credentials:true

}))

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