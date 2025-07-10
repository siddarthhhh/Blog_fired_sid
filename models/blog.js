const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const blogSchema = new Schema(
    {
        title:{
            type: String,
            required: true
        },
        snippet:{
            type:String,
            required:true
        },
        body:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

const Blog = mongoose.model('Blog',blogSchema)
//the name arg inside is imp,as its gonna pluralize it and looks for that collection inside the DB 

module.exports=Blog; 