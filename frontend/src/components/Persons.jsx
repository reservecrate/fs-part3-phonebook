const Persons = ({ persons, deletePerson }) => {
  return (
    <div id='Persons'>
      {persons.map(person => (
        <p key={person.id}>
          {person.name} -&gt; {person.phone}{' '}
          <button onClick={() => deletePerson(person.id)}>delete</button>
        </p>
      ))}
    </div>
  );
};

export default Persons;
