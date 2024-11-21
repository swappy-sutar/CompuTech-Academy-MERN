import { combineReducers} from "@reduxjs/toolkit"
import authReducer from "../Slices/Auth.slice.js"
import profileReducer from "../Slices/Profile.slice.js"
import cartReducer from "../Slices/Cart.Slice.js"


const rootReducer = combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart: cartReducer


})

export default rootReducer;