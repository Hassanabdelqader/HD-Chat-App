const mongoose = require("mongoose");
const color = require("colors")

const connectDB = async () => {
    try {

        const connect = await mongoose.connect(process.env.MONGOOSE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`the DB is connected on Host ${connect.connection.host}`.blue)

    } catch (error) {
        console.log(error)
        process.exit()
    }
}
module.exports = connectDB