const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// Define Types Below

const TestType = new GraphQLObjectType({
  name: 'Test',
  fields: () => ({
    id: {type: GraphQLInt},
    name: {type: GraphQLString},
    data: {type: GraphQLString},
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    test:{
      type: TestType,
      args:{
        id:{type: GraphQLInt}
      },
      resolve(parentValue, args){
        return axios.get('http://localhost:3000/tests/'+args.id)
          .then(res => res.data);
      }
    },
    tests:{
      type: new GraphQLList(TestType),
      resolve(parentValue, args){
        return axios.get('http://localhost:3000/tests')
          .then(res => res.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addTest:{
            type:TestType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                data: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/tests', {
                    name:args.name,
                    data: args.data
                })
                .then(res => res.data);
            }
        },
        deleteTest:{
            type:TestType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/tests/'+args.id)
                .then(res => res.data);
            }
        },
        editTest:{
            type:TestType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLInt)},
                name: {type: GraphQLString},
                data: {type: GraphQLString}
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/tests/'+args.id, args)
                .then(res => res.data);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});
