import { combineReducers} from "@reduxjs/toolkit"
import authReducer from "../Slices/Auth.slice.js"
import profileReducer from "../Slices/Profile.slice.js"
import cartReducer from "../Slices/Cart.Slice.js"
import courseReducer from "../Slices/Course.slice.js"


const rootReducer = combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart: cartReducer,
    course:courseReducer,


})

export default rootReducer;