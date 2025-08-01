const express = require('express');
const router = express.Router();
const wrapAsync = require('../views/errorHandling/wrapAsyncError.js');
const ExpressError = require('../views/errorHandling/ExpressError.js');
const Hero = require('../models/heroSchema');
const Project = require('../models/projectSchema');
const About = require('../models/aboutSchema');
const Services = require('../models/servicesSchema');
const Testimonial = require('../models/testimonialsSchema');
const Contact = require('../models/contactSchema');
const Blog = require('../models/blogSchema');
const FAQ = require('../models/faqSchema');

router.get('/', wrapAsync(async(req, res) => {
    req.session.destroy(async err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error ending session');
        }
        const heroData = await Hero.find({});
        const projectData = await Project.find({});
        const aboutData = await About.findOne({});
        const serviceData = await Services.find({});
        const testimonialData = await Testimonial.find({});
        const contactData = await Contact.find({});
        const blogData = await Blog.find({});
        const faqData = await FAQ.find({});
        res.render('guest-panel/guest-panel',{heroData, projectData, aboutData, serviceData, testimonialData, contactData, blogData, faqData});
    });
}));

router.get('/projects',async(req,res)=>{
    const projectData = await Project.find();
    res.render('guest-panel/routes/Projects',{projectData});
})

router.get('/projects/:id',async(req,res)=>{
    const projectData = await Project.findById(req.params.id);
    res.render('guest-panel/routes/eachProjects',{projectData});
})

router.get('/services',async(req,res)=>{
    const serviceData = await Services.find();
    res.render('guest-panel/routes/services',{serviceData});
})

router.get('/services/:id',async(req,res)=>{
    const serviceData = await Services.findById(req.params.id);
    res.render('guest-panel/routes/eachservice',{serviceData});
})

router.get('/Blog/:id', wrapAsync(async (req, res) => {
    const blogData = await Blog.findById(req.params.id);
    if (!blogData) {
        throw new ExpressError('Blog not found', 404);
    }
    res.render('guest-panel/routes/eachBlog', { blogData });
}));

module.exports = router;
