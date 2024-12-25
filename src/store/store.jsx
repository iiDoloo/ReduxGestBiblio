import { configureStore } from '@reduxjs/toolkit'

import formReducer from './formReducer'

const store = configureStore({ reducer: {books :formReducer} })

export default store
