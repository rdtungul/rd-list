import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

// empty array when loading (localStorage)
const getLocalStorage = () => {
  let list = localStorage.getItem('list')

  if (list) {
    return JSON.parse(localStorage.getItem('list'))
  } else {
    return []
  }
}

function App() {
  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalStorage())

  const [isEditing, setIsEditing] = useState(false)
  const [editID, setEditID] = useState(null)

  const [alert, setAlert] = useState({
    show: false,
    msg: '',
    type: '',
  })

  // form submit function
  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log('hello')
    if (!name) {
      // display alert
      showAlert(true, 'danger', 'please enter value')
      // setAlert({ show: true, msg: 'please enter value', type: 'danger' })
    } else if (name && isEditing) {
      // edit module
      setList(
        list.map((item) => {
          // matching the item ID
          if (item.id === editID) {
            return { ...item, title: name }
          }
          return item
        })
      )
      // setting the name and ID to empty and null
      setName('')
      setEditID(null)
      setIsEditing(false)
      showAlert(true, 'success', 'value changed')
    } else {
      showAlert(true, 'success', 'item added to the list')
      // show alert || adding new item in the list container
      const newItem = { id: new Date().getTime().toString(), title: name }
      setList([...list, newItem])
      setName('')
    }
  }

  // show an alert function
  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg })
  }

  // clear the list
  const clearList = () => {
    // alert msg
    showAlert(true, 'danger', 'empty list')

    // clearing the list of items
    setList([])
  }

  // removing item in the list
  const removeItem = (id) => {
    showAlert(true, 'danger', 'item removed')
    setList(list.filter((item) => item.id !== id))
  }

  // editing item in the list
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id)
    setIsEditing(true)
    setEditID(id)
    setName(specificItem.title)
  }

  // local storage saving features
  useEffect(() => {
    // local storage syntax
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>To-do List</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g. eggs"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="submit-btn" type="submit">
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  )
}

export default App
