
exports.withFields = {
  "schema": "pf-0.2.0",
  "content": [
    {
      "id": "a",
      "value": "valueA"
    },
    {
      "id": "b",
      "value": "42"
    }
  ]
};

exports.withDeps = {
  "schema": "pf-0.2.0",
  "content": [
    {
      "id": "a"
    },
    {
      "id": "b",
      "value": "{{@a + 1}}"
    }
  ]
};

