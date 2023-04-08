const PersonForm = ({ props }) => {
  const {
    handleSubmit,
    newName,
    newPhone,
    handleInputChange
  } = props;
  return (
    <form id='PersonForm' onSubmit={handleSubmit}>
      <div>
        name: <input id='nameInput' value={newName} onChange={handleInputChange} />
      </div>
      <div>
        phone number:{' '}
        <input id='phoneInput' type='tel' value={newPhone} onChange={handleInputChange} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  );
};

export default PersonForm;
