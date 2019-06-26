var express = require("express"),
    methodOverride = require("method-override"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer")

mongoose.connect("mongodb://localhost/restful_blog_app",{ useNewUrlParser: true });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body  : String,
    created : { type : Date , default : Date.now }
    
});


var Blog = mongoose.model("Blog",blogSchema);

app.get("/",function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index", {blogs : blogs});
        }
        
    })
});


app.get("/blogs/new", function(req, res) {
    res.render("new")
});

app.post("/blogs",function(req,res){
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    })
});

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id , function(err , foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            console.log(err);
        } else {
            res.render("edit",{blog: foundBlog});
        }
    });
});

app.put("/blogs/:id", function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err, updateBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs")
        }
    })
});

/*Blog.create({
    title: 'test',
    image : "https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=12ad75c31d4e110e677b814a6d61066a&auto=format&fit=crop&w=1052&q=80",
    body: "checking 123123123"
})

*/





app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running!");
})