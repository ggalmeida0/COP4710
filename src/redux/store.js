import { createStore } from '@reduxjs/toolkit'
import { appReducer } from './appReducer'

export default createStore(appReducer);