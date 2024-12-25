import { useEffect, useState } from 'react'
import './App.css'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { ajouter, fetchData, modifier, supprimer, valider } from './store/formReducer'

function App() {
  const book = useSelector((state)=>state.books)
  const [inputs,setInputs] = useState({id:"",nom:"",type:"",auteur:"",image:"https://img.icons8.com/?size=100&id=fH22K8x6Yvz6&format=png&color=000000",modify:false})
  const [editedInput,setEditedInput] = useState({})
  const [isbnExists,setIsbnExists] = useState(false)
  const dispatch = useDispatch();

  const fetchBooks = ()=>{
    axios.get('http://localhost:5000/books')
  .then(response => dispatch(fetchData(response.data)))
  .catch(error => {console.log(error)})
  };

  const ajouterBook  = ()=>{
    dispatch(ajouter(inputs))
  }
  const supprimerBook = (book)=>{
    dispatch(supprimer(book.id))
    axios.delete(`http://localhost:5000/books/${book.id}`)
  .then(response => {dispatch(fetchData(response.data));fetchBooks()})
  .catch(error => {console.log(error)})
  }
  const modifierBook = (bookIndex)=>{
    dispatch(modifier(bookIndex))
    setEditedInput({...editedInput,id:book[bookIndex].id,nom:book[bookIndex].nom,type:book[bookIndex].type,auteur:book[bookIndex].auteur,modify:false})
  }
  const valdierBook = (bookIndex,newValues)=>{
    dispatch(valider({id:bookIndex,data:newValues}))
    axios.put(`http://localhost:5000/books/${book[bookIndex].id}`,newValues)
  .then(response => {dispatch(fetchData(response.data));fetchBooks()})
  .catch(error => {console.log(error)})
  }
  const handleSubmit = (e)=>{
    e.preventDefault()
    console.log('error handling',book.filter((x,i)=>x.id==inputs.id).length>0)
    if(book.filter((x,i)=>x.id==inputs.id).length>0){
      setIsbnExists(true)
    }
    else{
      ajouterBook()
      axios.post("http://localhost:5000/books",inputs)
      .then((response) => {console.log(response);});
      setIsbnExists(false)
    }

    
  }
  const handleChange = (e)=>{
    if(e.target.type=='text'){
    setInputs({...inputs,[e.target.name]:e.target.value})
  }
  else{
    setInputs({...inputs,[e.target.name]:URL.createObjectURL(e.target.files[0])})
  }
  }

  useEffect(()=>{
    fetchBooks()
    console.log('fetched books',book)

  },[])
  useEffect(()=>{
    console.log('isbn exists?',isbnExists)

  },[isbnExists])
  return (
    <>
      {isbnExists && <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
    <span class="font-medium">Operation Impossible!</span> Un livre avec le même ISBN existe déja ...
  </div>}
     
  <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
  <h1 className="mb-4 text-xl font-extrabold lg:text-4xl dark:text-white">Gestion de Bibliothèque</h1>
    <div className="mb-5">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ISBN</label>
      <input type="text" name='id' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange}/>
    </div>
    <div className="mb-5">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">NOM</label>
      <input type="text" name='nom' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange}/>
    </div>
    <div className="mb-5">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">TYPE</label>
      <input type="text" name='type' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange}/>
    </div>
    <div className="mb-5">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">AUTEUR</label>
      <input type="text" name='auteur' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange}/>
    </div>
    <div className="mb-5">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Image</label>
      <input type="file" name='image' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleChange}/>
    </div>
    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Envoyer</button>
        </form>
        { book && book.length>0 &&  
        <div className="relative overflow-x-auto mt-8">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ISBN
                </th>
                <th scope="col" className="px-6 py-3">
                  NOM
                </th>
                <th scope="col" className="px-6 py-3">
                  TYPE
                </th>
                <th scope="col" className="px-6 py-3">
                  AUTEUR
                </th><th scope="col" className="px-6 py-3">
                  IMAGE
                </th>
                <th scope="col" className="px-6 py-3">
                 Action
                </th>
              </tr>
            </thead>
            <tbody>
              {book.map((livre, index) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {livre.id}
                  </th>
                  <td className="px-6 py-4">{livre.modify?<input type="text" name="nom" value={editedInput.nom} onChange={(e)=>{setEditedInput({...editedInput,[e.target.name]:e.target.value})}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />:livre.nom}</td>
                  <td className="px-6 py-4">{livre.modify?<input type="text" name="type" value={editedInput.type} onChange={(e)=>{setEditedInput({...editedInput,[e.target.name]:e.target.value})}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />:livre.type}</td>
                  <td className="px-6 py-4">{livre.modify?<input type="text" name="auteur" value={editedInput.auteur} onChange={(e)=>{setEditedInput({...editedInput,[e.target.name]:e.target.value})}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />:livre.auteur}</td>
                  <td className="px-6 py-4">{livre.modify?<input type="file" name="image" onChange={(e)=>{setEditedInput({...editedInput,[e.target.name]:URL.createObjectURL(e.target.files[0])})}} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />:<img src={livre.image} width={50} height={50} />}</td>
                  <td className="px-6 py-4">
                  {livre.modify?<button type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={()=>{valdierBook(index,editedInput)}}>Valider</button>:<button type="button" className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900" onClick={()=>{modifierBook(index)}}>Modifier</button>}
                  <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={()=>{supprimerBook(livre)}}>Supprimer</button>
                  </td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
     
    }
      </>
  )
}

export default App
