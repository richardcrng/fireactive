module.exports = {
  docs: {
    "Quick Start": [
      'overview',
      'quick-start/installation',
      'quick-start/schema-101',
      'quick-start/active-class-101',
      'quick-start/connecting-101',
      {
        "Simple Relations": [
          'relations/simple/structuring-relations',
          'relations/simple/one-to-one',
          'relations/simple/one-to-many',
          'relations/simple/circular-relations'
        ]
      }
    ],
    "API": [
      {
        "ActiveClass": [
          'api/active-class',
          'api/active-class/creating',
          'api/active-class/methods/static',
          'api/active-class/methods/prototype'
        ]
      },
      {
        "Schema": [
          'api/schema',
          'api/schema/nested',
          {
            "Types": [
              'api/schema/types/boolean',
              'api/schema/types/enum',
              'api/schema/types/indexed',
              'api/schema/types/number',
              'api/schema/types/string'
            ]
          }
        ]
      }
    ] 
  },
};
