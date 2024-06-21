const express=require('express');
const app=express();
const jwt=require('jsonwebtoken');

const secretKey='abcd';
const port=8008;
app.use(express.json());


const authenticateToken=(req,res,next)=>{
    const authHeader=req.headers['authorization']
    const token=authHeader &&  authHeader.split(' ')[1];
    if(!token){
      return  res.sendStatus(401);
    }


    jwt.verify(token,secretKey,(error,user)=>{
        if(error){
           return res.sendStatus(403);
        }

        req.user=user;
        next();

    })
}

const posts=[
    {name:'Ayyanar',title:'dev'},
    {name:'Ayyanar2', title:'dev2'},
    {name:'Ayyanar3',title:'dev3'}
]

// app.post('/',authenticateToken, (req,res)=>{
//     res.json(posts);
// })


app.post('/login',(req,res)=>{
    const username=req.body.username;
    const user={name:username};
    const accessToken=jwt.sign(user, secretKey);
    
    res.json({accessToken:accessToken});
});



app.get('/home', (req,res)=>{
    res.send('Meesage from server');
});



app.get('/posts', authenticateToken,(req,res)=>{
    //console.log(req.user.name);
    res.json(posts.filter(post=>post.name==req.user.name));
});

app.listen(port, ()=>console.log(`server is running on port ${port}`));

//localhost:8000