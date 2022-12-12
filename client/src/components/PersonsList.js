const Person = (props) => {
  const { person } = props;
  return (
    <p>
      {person.name} {person.number}
    </p>
  );
};

const PersonsList = (props) => {
  const { persons, handleDelete } = props;

  return (
    <div>
      {persons.map((person) => {
        return (
          <div key={person.id}>
            <Person key={person.name} person={person} />
            <button onClick={() => handleDelete(person.id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
};

export default PersonsList;
