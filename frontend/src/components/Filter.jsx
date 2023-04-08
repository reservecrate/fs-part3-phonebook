const Filter = ({ props }) => {
  const { searchQuery, handleInputChange } = props;
  return (
    <div id='Filter'>
      filter: <input id='searchQueryInput' value={searchQuery} onChange={handleInputChange} />
    </div>
  );
};

export default Filter;
