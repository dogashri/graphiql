const axios = require('axios');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql')

// hardcoded data

// const customers = [
//     {id:1, name:'doaga', email:'doga@gmail.com', age:25},
//     {id:2, name:'rampa', email:'asdsdf@gmail.com', age:26},
//     {id:3, name:'track', email:'track@gmail.com', age:27},
//     {id:4, name:'jack', email:'jack@gmail.com', age:28},
//     {id:5, name:'mack', email:'mack@gmail.com', age:29}
// ]  

// customer type
const CustomerType = new GraphQLObjectType({
    name:'Customer',
    fields:()=>({
        id:{type:GraphQLString},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        age:{type:GraphQLInt},
    })
})



// rootquery

const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        customer:{
            type:CustomerType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValue,args){

                return axios.get('http://localhost:3000/customers'+args.id)
                .then(res=>res.data)

                // for(let i = 0;i<customers.length;i++){
                //     if(customers[i].id == args.id){
                //         return customers[i]
                //     }
                // }
            }
        },
        customers:{
            type: new GraphQLList(CustomerType),
            resolve(parentValue,args){
                return axios.get('http://localhost:3000/customers')
                .then(res=>res.data)
            }
        }
    }
    
})

// mutation

const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addCustomer:{
            type:CustomerType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                email:{type: new GraphQLNonNull(GraphQLString)},
                age:{type: new GraphQLNonNull(GraphQLInt)}

            },
            resolve(parentValue,args){
                return axios.post('http://localhost:3000/customers',{
                    name:args.name,
                    email:args.email,
                    age:args.age
                })
                .then(res=>res.data)
            }
        },
        deleteCustomer:{
            type:CustomerType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)},
            },
            resolve(parentValue,args){
                return axios.delete('http://localhost:3000/customers/'+args.id)
                .then(res=>res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation
})