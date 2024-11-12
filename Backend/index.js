import dotenv from "dotenv";
import { DBConnection } from "./Config/DbConnection.Config.js"
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 8000;

DBConnection()
  .then(
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    })
  )
  .catch((err) => console.error(err));
