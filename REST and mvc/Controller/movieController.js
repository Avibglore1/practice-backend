const movieModel = require('../Model/Moviemodel');

const createMovie = async function(req,resp){
    try{
        const movieObject = req.body;
        const movie = await movieModel.create(movieObject);
        resp.status(201).json(movie);
    }catch(err){
        console.log(err);
            resp.status(500).json({
            message: "Internal Server Error",
            error: err
        })
    }
}

const getAllMovie = async (req,resp) =>{
    try{
        const movie = await movieModel.find();
        if(movie.length!= 0){
            resp.status(200).json({
                message: movie
            })
        }
        else{
            resp.status(404).json({
                message: "didn't get any movie"
            })
        }
    }catch(err){
        resp.status(500).json({
            message: err.message,
            status: 'Internal Server Error'
        })
    }
}

const getMovie = async (req,resp) =>{
  try{
    const id = req.params.id;
    const movie = await movieModel.findById(id);
    if (movie){
        resp.status(200).json({
            message: movie
        })
    }else{
        resp.status(404).json({
            message: err.message,
            status: "Internal Server Error"
        })
    }
  } catch(err){
    console.log(err);
    resp.status(500).json({
        message: err.message,
        status: 'Internal Server Error'
    })
  } 
}

const deleteMovie = async (req,resp)=>{
    try{
       const id = req.params.id;
       const movie = await movieModel.findByIdAndDelete(id);
       if (movie == null){
        resp.status(404).json({
            message: "movie doesn't exist",
            status: "Success"
        })
       }

    }catch(err){
        resp.status(500).json({
            message: err.message,
            status: "internal Server error"
        })
    }
}

module.exports = {
    createMovie, getAllMovie, getMovie, deleteMovie
}
