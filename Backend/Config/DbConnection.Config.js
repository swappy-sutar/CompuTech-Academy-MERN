import mongoose from "mongoose"

const DBConnection = async ()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('🤝 DB Connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
        
    }

}

export { DBConnection };