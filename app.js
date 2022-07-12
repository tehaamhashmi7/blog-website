const express = require('express')
const port = 3000
const path = require('path')
const mongoose = require('mongoose')

const bodyParser = require('body-parser')

const app = express()

mongoose.connect('mongodb+srv://admin-tehaam:test123@cluster0.1wuuh5l.mongodb.net/blogdb',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const contentSchema = new mongoose.Schema({
    name: String,
    story: String
})

const Blog = new mongoose.model('blog', contentSchema)

app.use(bodyParser.urlencoded({extended:true}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {

    let titles = []
    let content = []

    Blog.find((err, myBlog) => {
        if (err) {
            console.log(err)
        }
        else {
            for (elmt of myBlog) {
                titles.push(elmt['name'])
                content.push(elmt['story'])
            } 
        }
    })


    setTimeout(() => {
        res.render('index', {titles: titles, content: content})
    }, 1000)

    // console.log(titles)
    // console.log(content)
})

app.get('/add', (req, res) => {
    res.render('document')
})

app.post('/add', (req, res) => {
    let title = req.body.titleText
    let chapter = req.body.content

    // titles.push(title)
    // content.push(chapter)

    //Add a new blog to the database

    const myStory = new Blog({
        name: title,
        story: chapter
    })

    myStory.save()

    setTimeout(()=> {
        res.redirect("/")
    }, 1000)
})

app.get('/read', (req,res) => {
    res.render('read')
})

app.get('/posts/:topic', (req, res) => {
    let title = req.params.topic
    
    Blog.findOne({name: title}, (err, foundBlog) => {
        if (err) {
            console.log(err)
        }
        else {
            let blogContent = foundBlog.story
            res.render('read', {title: title, stuff: blogContent})
        }
    })

})

app.get('*', (req, res) => {
    res.send("404 error")
})

// app.listen(port, console.log(`Application started at port ${port}`))

app.listen(process.env.PORT);