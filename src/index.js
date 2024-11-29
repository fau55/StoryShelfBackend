import { app } from "./app.js";
import 'dotenv/config'
import connectDB from "./db/index.js";
app.get('/', (req, res) => {
    res.send('Hello World!')
})

connectDB()
    .then(() => {
        app.on('error', (err) => {
            console.error('\n server error', err)
            throw err
        })
        app.listen(process.env.PORT || 8800, () => {
            console.log('server is running at port : ', process.env.PORT)
        })
    })
    .catch((err) => {
        console.error('\n mongodb connection faild --index\n'.err)
    })
// app.listen(process.env.PORT || 8800, () => {
//     console.log('server is running at port : ', process.env.PORT)
// })