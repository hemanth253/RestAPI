const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

// mongodb://localhost:27017/wikiDB
// mongodb+srv://nckhemanthreddy:restapi123456@cluster0.di4zp.mongodb.net/wikiDB
mongoose.connect("mongodb+srv://nckhemanthreddy:restapi123456@cluster0.di4zp.mongodb.net/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true });

articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

Article = mongoose.model('Article',articleSchema);

// ---------------------------------------------------------->

app.route('/articles')
  .get(function(req, res){
    Article.find({},function(err,foundArticles){
      if(!err)
        res.send(foundArticles);  // collection succesfully sent
      else
        res.send(err);
    });
  })
  .post(function(req, res){
    const title=req.body.title;
    const content=req.body.content;
    const article = new Article({
      title: title,
      content: content
    });
    article.save(function(err){
      if(!err)
        res.send("document succesfully added");
      else
        res.send(err);
    });
  })
  .delete(function(req, res){
    Article.deleteMany({},function(err){
      if(!err)
        res.send("collection succesfully deleted");
      else
        res.send(err);
    });
  });

// -------------------------------------------------------->

app.route('/articles/:articleTitle')
  .get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
      if(foundArticle)
        res.send(foundArticle);  // document succesfully sent
      else
        res.send("No articles searching that title was found");
    });
  })
  .put(function(req,res){
    Article.update(
      {title:req.params.articleTitle},
      {title:req.body.title,content:req.body.content},
      {overwrite:true},
      function(err){
        if(!err){
          res.send("successfully updated article using put method");
        }
      }
    )
  })
  .patch(function(req,res){
    Article.update(
      {title:req.params.articleTitle},
      {$set:req.body},
      function(err){
        if(!err){
          res.send("successfully updated article using patch method");
        }
      }
    )
  })
  .delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle},function(err){
      if(!err)
        res.send("Document deleted successfully");
      else
        res.send(err);
    });
  });

// -------------------------------------------------------->

app.listen(process.env.PORT || 3000,function(){
  console.log("Server started on port 3000");
});
