const express = require('express');
const fs = require('fs');
const app = express();

const content = fs.readFileSync('posts.json','utf-8');
const jsonData=JSON.parse(content);

function getAllPostsHandler(req,res){
    try{
        res.status(200).json(jsonData);
    }catch(err){
        res.status(500).json({
            message: 'internal server error'
        });
    }
    
}

function getPostById(req,res){
    try {
        const postid = req.params.postId;
    const arr = jsonData.posts;
    for (let i = 0; i< arr.length; i++){
        if (arr[i].id = postid){
            return res.status(200).json({
                post: arr[i]
            })
        }
    }
    res.send(404).json({
        message: 'internal server error'
    })
    }catch(err){
        res.send(500).json({
            message: 'internal server error'
        })
    }
}

function createPost(req, res) {
    try {
        console.log("req.body", req.body);

        const postsArr = jsonData.posts;

        postsArr.push(req.body);
        res.status(200).json({
            message: 'post created successfully'
        })
    } catch (err) {
        res.status(500).json({
            response: console.log(err)
        })
    }


}

app.use(express.json());
app.get("/posts", getAllPostsHandler)
app.get('/posts/:postId', getPostById)
app.post('/posts', createPost);


app.listen(3000,function(){
    console.log('Server running at port 3000');
})