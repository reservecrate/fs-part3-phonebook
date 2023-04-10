/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

const Person = require('./models/person');
const { log } = require('console');

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.send('<h1>Phonebook App, fullstackopen 2022</h1>');
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

app.post('/api/persons', (req, res, next) => {
  const { body } = req;
  const { name, phone } = body;

  const person = new Person({
    name,
    phone
  });
  person
    .save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(err => next(err));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(matchedPerson => res.json(matchedPerson))
    .catch(err => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { body } = req;
  const { phone } = body;
  Person.findByIdAndUpdate(
    req.params.id,
    { ...body, phone },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => res.json(updatedPerson))
    .catch(err => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => res.status(204).end())
    .catch(err => next(err));
});

app.get('/info', (req, res) => {
  Person.find({})
    .then(persons => {
      const formattedInfo = `<h3>The phonebook contains information for ${
        persons.length
      } people</h3><h3>${new Date()}</h3>`;
      res.send(formattedInfo);
    })
    .catch(err => next(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ err: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
  const { message } = err;
  console.error(message);
  if (err.name === 'CastError')
    return res.status(400).send({ err: 'wrong/malformatted id given' });
  else if (err.name === 'ValidationError')
    return res.status(400).json({ message });
  next(err);
};

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
