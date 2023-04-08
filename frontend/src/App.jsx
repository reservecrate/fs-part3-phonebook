import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personsService from './services/persons';
import Notification from './components/Notification';
import { log } from 'console';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState({
    message: '',
    styles: {}
  });

  const hook = () => {
    personsService.getAllPersons().then(personsData => {
      setPersons(personsData);
      setFilteredPersons(personsData);
    });
  };

  useEffect(hook, []);

  const alreadyExists = name => {
    const names = persons.map(person => person.name.toLowerCase());
    return names.includes(name.trim().toLowerCase());
  };

  const handleInputChange = e => {
    const { value, id } = e.target;
    switch (id) {
      case 'nameInput':
        setNewName(value);
        break;
      case 'phoneInput':
        setNewPhone(value);
        break;
      case 'searchQueryInput':
        setSearchQuery(value);
        setFilteredPersons(
          persons.filter(person =>
            person.name.toLowerCase().includes(value.trim().toLowerCase())
          )
        );
        break;
      default:
        console.log(
          'An error has occurred - no matching input element has been found.'
        );
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newPerson = {
      name: newName.trim(),
      phone: newPhone
    };
    if (alreadyExists(newName)) {
      // if (
      //   window.confirm(
      //     `${newName.trim()} has already been added to the phonebook. Would you like to replace the old phone number with a new one?`
      //   )
      // )
      const matchedPerson = persons.find(person => person.name === newName).id;
      updatePerson(matchedPerson.id, matchedPerson);
    } else {
      personsService
        .createPerson(newPerson)
        .then(newPersonObj => {
          setPersons([...filteredPersons, newPersonObj]);
          setFilteredPersons([...filteredPersons, newPersonObj]);
          setNotification({
            styles: {
              borderStyle: 'solid',
              borderColor: 'lime',
              borderRadius: '15px',
              paddingLeft: '5px'
            },
            message: `${newName} has been successfully added to the phonebook`
          });
          setTimeout(() => setNotification(''), 4000);
          setNewName('');
          setNewPhone('');
        })
        .catch(err => {
          const { message } = err.response.data;
          setNotification({
            styles: {
              borderStyle: 'solid',
              borderColor: 'red',
              borderRadius: '15px',
              paddingLeft: '5px'
            },
            message
          });
          setTimeout(
            () => setNotification({ message: null, styles: {} }),
            4000
          );
        });
    }
  };

  const deletePerson = id => {
    personsService.deletePerson(id);
    setPersons(filteredPersons.filter(person => person.id !== id));
    setFilteredPersons(filteredPersons.filter(person => person.id !== id));
  };

  const updatePerson = () => {
    const matchedPersonIndex = persons.findIndex(
      person => person.name.toLowerCase() === newName.trim().toLowerCase()
    );
    const matchedPerson = JSON.parse(
      JSON.stringify(
        persons.find(
          person => person.name.toLowerCase() === newName.trim().toLowerCase()
        )
      )
    );
    const matchedPersonId = matchedPerson.id;
    matchedPerson.phone = newPhone;
    personsService
      .updatePerson(matchedPersonId, matchedPerson)
      .then(updatedPersonObj => {
        const filteredPersonsCopy = JSON.parse(JSON.stringify(filteredPersons));
        filteredPersonsCopy.splice(matchedPersonIndex, 1, updatedPersonObj);
        setPersons(filteredPersonsCopy);
        setFilteredPersons(filteredPersonsCopy);
        setNotification({
          styles: {
            borderStyle: 'solid',
            borderColor: 'lime',
            borderRadius: '15px',
            paddingLeft: '5px'
          },
          message: `${updatedPersonObj.name}'s phone number has been successfully updated`
        });
        setTimeout(() => setNotification({ message: null, styles: {} }), 4000);
        setNewName('');
        setNewPhone('');
      })
      .catch(err => {
        const { message } = err.response.data;
        console.log(err);
        setNotification({
          styles: {
            borderStyle: 'solid',
            borderColor: 'red',
            borderRadius: '15px',
            paddingLeft: '5px',
            color: 'red'
          },
          message
        });
        setTimeout(() => setNotification(''), 4000);
      });
  };

  return (
    <div id='App'>
      <h1>Phonebook</h1>
      <Filter props={{ searchQuery, handleInputChange }} />
      <h2>Add new person</h2>
      <PersonForm
        props={{
          handleSubmit,
          newName,
          newPhone,
          handleInputChange
        }}
      />
      <h2>Phone numbers</h2>
      <Notification notification={notification} />
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
