import express from 'express';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3001;
let blogs = [];
let filteredBox = [];
let route;



// Middlewares
app.use(express.urlencoded({extended: true}));
// Serve static files
app.use(express.static('public'));

const  sendAlert= (res, message, redirectUrl = '/')=>{
    res.send(`
      <script>
        alert('${message}');
        window.location.href = '${redirectUrl}';
      </script>
    `);
  };
  
// search blog search
const checkBlogSearch = ( req, res, next)=>{
    filteredBox = [];
    const authorsName = req.query.authorsName;
    if(authorsName){
        const filteredBlogs = blogs.filter(blog=>blog.author.toLowerCase() === authorsName.toLowerCase());
        filteredBox.push(filteredBlogs);
        next();
    }else{
        sendAlert(res, "Can not find resources");
    };   
};
// routeSwitch
const routeSwitch = (req, res, next) =>{

    if(req.path === '/search'){
        route = "search.ejs";
    }else if(req.path === '/'){
        route="index.ejs";
    }else if((req.path === '/move' && route === "search.ejs") || (req.path === '/move' && route === "fetched.ejs")){

        route = "fetched.ejs"
    }else if(req.path === '/move' && route === "index.ejs"){   
        route  = "index.ejs";
    }else{
        route = "index.ejs";
    };

    next();
}
app.use(routeSwitch);

// feed the blog post
// home page
app.get('/', async(req, res) => {
    try {
         
            let index = 0; // Display the first blog by default
       
            const result  = await axios.get('https://lagospostalcodeapi.onrender.com/blogs');
            const data = result.data;
            blogs = [...data]
            res.render('index.ejs', {
                myPath: 'index',
                blogs: blogs,
                blog: blogs[index], // Only pass the first blog initially
                currentIndex: index,
                isFirst: index === 0,
                isLast: blogs.length === 1 // If there's only one blog, it's also the last
            });

     
        
    } catch (error) {
        let index = 0
            res.render('index.ejs', {
                myPath: 'index',
                blogs: [],
                blog: null, // Only pass the first blog initially
                currentIndex: index,
                isFirst: index === 0,
                isLast: blogs.length === 1 // If there's only one blog, it's also the last
            });
    };
   
});

// Navigate blog posts

app.get('/move', (req, res)=>{
    let index = parseInt(req.query.index, 10) || 0;
    if(route === 'index.ejs'){
        if(index >= 0 && index < blogs.length){
            res.render(route, {
                myPath: 'index',
                blogs: blogs,
                blog: blogs[index],
                currentIndex: index,
                isFirst: index === 0,
                isLast: index === blogs.length - 1,
            
            });
        }else{
           
            sendAlert(res, 'Blog not found');
        };
    }else if(route === 'search.ejs' || route === 'fetched.ejs'){

        if(index >= 0 && index < filteredBox[0].length){
            res.render(route, {
                myPath: 'fetch',
                blogs:filteredBox[0],
                blog: filteredBox[0][index],
                currentIndex: index,
                isFirst: index === 0,
                isLast: index === filteredBox[0].length - 1,
            
            });
        }else{
          
            sendAlert(res, 'Blog not found');
        };
        
    };
});

// create page
app.get('/create', (req, res) => {

    res.render('create.ejs', {blog: null, currentIndex: true, myPath: 'create'});
});

// blog post

app.post('/publish',  async(req, res)=>{
  
    if(!req.body['blogTitle'] ||!req.body['author'] ||!req.body['webLink'] ||!req.body['blogContent']){
        sendAlert(res, 'All fields are required', '/create');
        return;
    };
    
    if(blogs.some(blog => blog.title === req.body['blogTitle'])){
        sendAlert(res, 'A blog with the same title already exists', '/create');
        return;
    }else{
      
        const date = new Date();
        const formattedDate = date.toLocaleDateString("en-GB");
        const blogData = {
            title: req.body['blogTitle'],
            author: req.body['author'],
            webLink: req.body['webLink'],
            content: req.body['blogContent'],
            date: formattedDate,
            id: blogs.length + 1,
        };
        
        blogs.push(blogData);
    
        try {
            await axios.post('https://lagospostalcodeapi.onrender.com/blogs', blogData);
            res.redirect('/create');
        } catch (error) {
            console.error('Error saving blog:', error.message);
            sendAlert(res, 'Error saving blog', '/create')
        };  
    };
});

// search page 
app.get('/search', checkBlogSearch, (req, res) => {
    let index = parseInt(req.query.index, 10) || 0;
  
    if (filteredBox[0] && index >= 0 && index < filteredBox[0].length) {
      res.render('fetched.ejs', {
        myPath: 'fetch',
        blogs: filteredBox[0],
        blog: filteredBox[0][index],
        currentIndex: index,
        isFirst: index === 0,
        isLast: index === filteredBox[0].length - 1,
      });
    } else {
        sendAlert(res, 'No matching blogs found.');
    };
    
  });
  

// Edit post
app.get('/edit', (req, res) => {
    let index = parseInt(req.query.index, 10) || 0;
  
    if(index >= 0){
        res.render('create.ejs', {
            blog: filteredBox[0][index],
            currentIndex: index,
            myPath: 'create',
        });
    }else{
       
        sendAlert(res, 'Blog not found');
    }
});

//update post
app.post('/update', async(req, res) => {
    const blogid = parseInt(req.body.id); // Get the id of the blog to update
    try {
      const keysToUpdate = {
        title: req.body.blogTitle,
        webLink: req.body.webLink,
        content: req.body.blogContent,
      };
      // update the blogs array

      const searchIndex = blogs.findIndex(blog => blog.id === blogid);
      const existingBlog =  blogs[searchIndex];
      const updatedBlog = {
       id: existingBlog.id,
        title: keysToUpdate.title,
        webLink: keysToUpdate.webLink,
        content: keysToUpdate.content,
        author: existingBlog.author,
        date: existingBlog.date,
        
      }

      blogs[searchIndex] = updatedBlog;

    //   console.log(`Attempting to update blog at: http://localhost:4000/blogs/${blogid}`);
    //   console.log('Updated blog data:', updatedBlog);

    //   // update postalCodeAPI

      await axios.patch(`https://lagospostalcodeapi.onrender.com/blogs/${blogid}`, updatedBlog);
      sendAlert(res, 'Successfully updated');

       // Redirect to the updated blog view
        
    } catch (error) {
        console.error('Error updating blog:', error.message);
        sendAlert(res, 'Error updating blog');
    };
  });

  // delete post

  app.get('/delete', async(req, res) => {
    const blogid = parseInt(req.query.id); // Get the id of the blog to delete
    const blogToDelete = blogs.filter((blog) => blog.id!== blogid);

    blogs = [...blogToDelete];

        try {
            
                // Forward the deletion request to the service on port 4000
                const deleteResponse = await axios.delete(`https://lagospostalcodeapi.onrender.com/blogs/${blogid}`);
                
                // Use the response from the server to display the message
                // res.status(200).send(deleteResponse.data.message);
        } catch (error) {
            console.error('Error deleting blog:', error.message);
            res.status(500).send('Error deleting blog');
            
        };

       res.redirect("/"); // Redirect to the updated blog list
   

  });
  

// contact
app.get('/contact', (req, res) => {
    res.render('contact.ejs', {myPath: 'contact'});
});


app.listen(port, "0.0.0.0", ()=>{
    console.log(`Server is running at http://localhost:${port}`);
});