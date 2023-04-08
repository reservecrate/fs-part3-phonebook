import axios from 'axios';

const baseUrl = '/api/persons';

const getAllPersons = () => {
  return axios.get(baseUrl).then(res => res.data);
};

const createPerson = newPerson => {
  const req = axios.post(baseUrl, newPerson);
  return req.then(res => res.data);
};

const deletePerson = id => {
  return axios.delete(`${baseUrl}/${id}`);
};

const updatePerson = (id, personObj) => {
  const req = axios.put(`${baseUrl}/${id}`, personObj);
  return req.then(res => res.data);
};

const personsService = {
  getAllPersons,
  createPerson,
  deletePerson,
  updatePerson
};

export default personsService;
