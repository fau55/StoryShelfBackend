import mongoose from 'mongoose'

import { DB_Name } from '../constants.js'

const connectDB = async () => {

    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`)
        console.log('Database is connected!');
    } catch (error) {
        console.log(error, '\n mongoDB is not connected')
        process.exit(1)
    }

}
export default connectDB