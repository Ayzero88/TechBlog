import express from 'express';

const app = express();
const port = process.env.PORT || 4000;
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const date = new Date();
const formattedDate = date.toLocaleDateString("en-GB");

const blogs = [
  { title: "Understanding JavaScript Closures", author: "John Doe", webLink: "https://example.com/javascript-closures", content: "This blog explores closures in JavaScript, providing examples and use cases.", date: formattedDate, id: 1 },
  { title: "A Guide to CSS Grid", author: "Jane Smith", webLink: "https://example.com/css-grid-guide", content: "Learn how to use CSS Grid to create responsive and flexible layouts.", date: formattedDate, id: 2 },
  { title: "React State Management with Redux", author: "Mike Johnson", webLink: "https://example.com/react-redux", content: "An introduction to state management in React applications using Redux.", date: formattedDate, id: 3 },
  { title: "Mastering Python for Data Science", author: "Sarah Lee", webLink: "https://example.com/python-data-science", content: "Discover the power of Python in data science with libraries like Pandas and NumPy.", date: formattedDate, id: 4 },
  { title: "Building APIs with Node.js and Express", author: "Chris Brown", webLink: "https://example.com/nodejs-express-api", content: "Learn how to create RESTful APIs using Node.js and Express.js.", date: formattedDate, id: 5 },
  { title: "Version Control with Git and GitHub", author: "Emily Davis", webLink: "https://example.com/git-github-guide", content: "An overview of version control using Git and GitHub for collaboration.", date: formattedDate, id: 6 },
  { title: "Exploring Machine Learning Algorithms", author: "David Kim", webLink: "https://example.com/machine-learning-algorithms", content: "A comprehensive guide to machine learning algorithms and their applications.", date: formattedDate, id: 7 },
  { title: "Responsive Web Design Best Practices", author: "Anna White", webLink: "https://example.com/responsive-web-design", content: "Tips and techniques for creating responsive web designs.", date: formattedDate, id: 8 },
  { title: "Docker for Beginners", author: "Robert Green", webLink: "https://example.com/docker-beginners", content: "An introduction to Docker and containerization.", date: formattedDate, id: 9 },
  { title: "Database Design Principles", author: "Karen Moore", webLink: "https://example.com/database-design", content: "Learn the key principles of database design for scalable systems.", date: formattedDate, id: 10 },
  { title: "Understanding TypeScript", author: "Peter Adams", webLink: "https://example.com/typescript-guide", content: "A beginner-friendly guide to TypeScript and its features.", date: formattedDate, id: 11 },
  { title: "Kubernetes for Developers", author: "Sophia Taylor", webLink: "https://example.com/kubernetes-guide", content: "Explore Kubernetes concepts and how to deploy applications using it.", date: formattedDate, id: 12 },
  { title: "Building Mobile Apps with Flutter", author: "Chris Wilson", webLink: "https://example.com/flutter-guide", content: "Learn how to create cross-platform mobile apps using Flutter.", date: formattedDate, id: 13 },
  { title: "Introduction to GraphQL", author: "Nancy Brown", webLink: "https://example.com/graphql-intro", content: "Learn the basics of GraphQL and how it simplifies API development.", date: formattedDate, id: 14 },
  { title: "Web Performance Optimization", author: "Mark Lee", webLink: "https://example.com/web-performance", content: "Strategies to improve web application performance.", date: formattedDate, id: 15 },
  { title: "Cybersecurity Fundamentals", author: "Laura Garcia", webLink: "https://example.com/cybersecurity-fundamentals", content: "Learn about essential cybersecurity principles and practices.", date: formattedDate, id: 16 },
  { title: "Building RESTful APIs with Spring Boot", author: "John Miller", webLink: "https://example.com/spring-boot-apis", content: "A guide to creating RESTful APIs using Spring Boot.", date: formattedDate, id: 17 },
  { title: "Introduction to Big Data", author: "Alice Lopez", webLink: "https://example.com/big-data-intro", content: "An overview of big data concepts and tools.", date: formattedDate, id: 18 },
  { title: "DevOps Practices and Tools", author: "James Clark", webLink: "https://example.com/devops-guide", content: "Learn about DevOps practices and tools for efficient development.", date: formattedDate, id: 19 },
  { title: "SEO Techniques for 2025", author: "Olivia Wright", webLink: "https://example.com/seo-techniques", content: "Discover effective SEO techniques to improve your website's ranking.", date: formattedDate, id: 20 }
];


app.get('/blogs', (req, res)=>{

    res.json(blogs);
});

app.post('/blogs', (req, res)=>{
   
    const newBlog = {
        title: req.body.title,
        author: req.body.author,
        webLink: req.body.webLink,
        content: req.body.content,
        date: formattedDate,
        id: blogs.length + 1
    };

    blogs.push(newBlog);
    res.json(newBlog);

});

app.patch('/blogs/:id', (req, res)=>{
    const existingBlog = blogs.find(blog => blog.id === parseInt(req.params.id));
    console.log(req.body);
    const replacementBlog = {
        title: req.body.title || existingBlog.title,
        author: existingBlog.author,
        webLink: req.body.webLink || existingBlog.webLink,
        content: req.body.content || existingBlog.content,
        date: existingBlog.date,
        id: existingBlog.id
    };

    console.log(replacementBlog)

    const blogIndex = blogs.findIndex(blog => blog.id === parseInt(req.params.id));
    blogs[blogIndex] = replacementBlog;
    res.json(replacementBlog);

 
});

app.delete('/blogs/:id', (req, res) => {
    const blogIndex = blogs.findIndex(blog => blog.id === parseInt(req.params.id));
    blogs.splice(blogIndex, 1);
    res.json({ message: 'Blog deleted successfully.' });
});


app.listen(port, "0.0.0.0",  ()=>{
    console.log(`Server running on port ${port}`);
})