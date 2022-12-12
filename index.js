const config = require("./server/utils/config");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./server/models/person");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

///app.use(morgan("tiny"))
// GET /api/persons 200 222 - 16.726 ms

// eslint-disable-next-line no-unused-vars
morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      tokens["response-time"](req, res),
      "ms",
      tokens.method(req, res) === "POST" ? tokens.body(req, res) : "",
    ].join(" ");
  })
);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDb");
  })
  .catch((error) => {
    console.log("error connecting to MongoDb: ", error.message);
  });

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/info", (request, response, next) => {
  let infoLen;
  let infoTime;
  Person.countDocuments({})
    .then((result) => {
      infoLen = result;
      infoTime = new Date();
      response.send(
        `<p>Phonebook has info for ${infoLen} people<br>${infoTime}</p>`
      );
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "Name is missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "Number is missing",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/testing/reset", async (request, response) => {
  if (!process.env.NODE_ENV === "test") {
    return response.status(400).end();
  }
  await Person.deleteMany({});
  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    const errorMessage =
      "Name must be at least 3 chars long. " +
      "Phone number must contain at least 8 numbers " +
      "and be in correct format. Format examples: " +
      "213-123454, 09-2132131";
    return response.status(400).json({ error: errorMessage });
  }
  next(error);
};

app.use(errorHandler);
const PORT = config.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
