import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const formSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    fetchData(state,action) {
      return action.payload
    },
    ajouter(state,action) {
      console.log(action)
      return [...state,action.payload]
    },
    modifier(state, action) {
      console.log(action)
      return state.map((x,i)=>i==action.payload?{...x,modify:true}:{...x,modify:false})
    },
    valider(state,action){
      console.log(action)
      return state.map((x,i)=>i==action.payload.id?{...x,isbn:action.payload.data.isbn,nom:action.payload.data.nom,type:action.payload.data.type,auteur:action.payload.data.auteur,modify:false}:x)
    },
    supprimer(state,action){
      console.log(action)
      return state.filter((x,i)=>x.id!=action.payload.id)
    }
  },
})

export const { fetchData, ajouter, modifier, valider, supprimer } = formSlice.actions
export default formSlice.reducer