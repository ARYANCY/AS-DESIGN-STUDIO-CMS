const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/authentication.js');
const wrapAsync = require('../views/errorHandling/wrapAsyncError.js');
const ExpressError = require('../views/errorHandling/ExpressError.js');
const dotenv = require('dotenv');
dotenv.config();
const Hero = require('../models/heroSchema');
const Project = require('../models/projectSchema');
const About = require('../models/aboutSchema');
const Services = require('../models/servicesSchema');
const Testimonial = require('../models/testimonialsSchema');
const Contact = require('../models/contactSchema');
const Blog = require('../models/blogSchema');
const FAQ = require('../models/faqSchema');
const {storage} = require("../cloudconfig.js");
const multer = require('multer');
const upload = multer({ storage });

router.get('/hero/edit/:id', isAuthenticated, wrapAsync(async (req, res) => {
  const hero = await Hero.findById(req.params.id);
  if (!hero) {
    return res.status(404).send('Hero not found');
  }
  res.render('admin-panel/routes/hero/edit', { section: 'hero', hero });
}));

router.put('/hero/:id', upload.single('image'), wrapAsync(async (req, res) => {
  const { businessName, tagLine, shortIntro } = req.body;
  const url = req.file.path;
  const filename = req.file.filename;
  const updateData = { businessName, tagLine, shortIntro };
  if (req.file) {
    updateData.image = { url, filename };
  }
  await Hero.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/admin');
}));

router.get('/projects/add', isAuthenticated, (req, res) => {
  res.render('admin-panel/routes/projects/add', { section: 'project' });
});

router.post('/projects', upload.single('image'), wrapAsync(async (req, res) => {
  const imagePath = {
    url: req.file.path,
    filename: req.file.filename
  };
  await Project.create({
    title: req.body.title,
    image: imagePath,
    description: req.body.description
  });
  res.redirect('/admin');
}));

router.get('/projects/edit/:id', isAuthenticated, wrapAsync(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send("Project not found");
  res.render('admin-panel/routes/projects/edit', { section: 'project', project });
}));

router.put('/projects/:id', upload.single('image'), wrapAsync(async (req, res) => {
  const updateData = {
    title: req.body.title,
    description: req.body.description
  };
  if (req.file) {
    updateData.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }
  await Project.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/admin');
}));

router.delete('/projects/:id', wrapAsync(async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
}));

router.get('/services/add', isAuthenticated, (req, res) => {
  res.render('admin-panel/routes/services/add', { section: 'service' });
});

router.post('/services', upload.single('serviceImage'), wrapAsync(async (req, res) => {
  const { title, description, pricing } = req.body;
  const serviceImage = req.file
    ? { url: req.file.path, filename: req.file.filename }
    : null;
  await Services.create({ title, description, pricing, serviceImage });
  res.redirect('/admin');
}));

router.get('/services/edit/:id', isAuthenticated, wrapAsync(async (req, res) => {
  const service = await Services.findById(req.params.id);
  res.render('admin-panel/routes/services/edit', { section: 'service', service });
}));

router.put('/services/:id', upload.single('serviceImage'), async (req, res) => {
  const { title, description, pricing } = req.body;
  const updateData = { title, description, pricing };
  if (req.file) {
    updateData.serviceImage = {
      url: req.file.path,
      filename: req.file.filename
    };
  }
  await Services.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/admin');
});

router.delete('/services/:id', wrapAsync(async (req, res) => {
  await Services.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
}));

router.get('/about/edit/:id', isAuthenticated, wrapAsync(async (req, res) => {
  const about = await About.findById(req.params.id);
  res.render('admin-panel/routes/about/edit', { section: 'about', about });
}));

router.put('/about/:id', upload.single('aboutImage'), wrapAsync(async (req, res) => {
  const updateData = {
    title: req.body.title,
    description: req.body.description
  };
  if (req.file) {
    updateData.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }
  await About.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/admin');
}));

router.get('/faq/add', isAuthenticated, (req, res) => {
  res.render('admin-panel/routes/faq/add', { section: 'faq' });
});

router.post('/faq', async (req, res) => {
  await FAQ.create(req.body);
  res.redirect('/admin');
});

router.get('/faq/edit/:id', isAuthenticated, wrapAsync(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);
  res.render('admin-panel/routes/faq/edit', { section: 'faq', faq });
}));

router.put('/faq/:id', wrapAsync(async (req, res) => {
  await FAQ.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/admin');
}));

router.delete('/faq/:id', wrapAsync(async (req, res) => {
  await FAQ.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
}));

router.get('/blog/add', isAuthenticated, (req, res) => {
  res.render('admin-panel/routes/blog/add', { section: 'blog' });
});

router.post('/blog', upload.single('image'), wrapAsync(async (req, res) => {
  const blogData = {
    title: req.body.title,
    content: req.body.content,
    image: {
      url: req.file.path,
      filename: req.file.filename
    }
  };
  await Blog.create(blogData);
  res.redirect('/admin');
}));

router.get('/blog/edit/:id', isAuthenticated, wrapAsync(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).send("Blog not found");
  }
  res.render('admin-panel/routes/blog/edit', { blog });
}));

router.put('/blog/:id', upload.single('image'), wrapAsync(async (req, res) => {
  const updateData = {
    title: req.body.title,
    content: req.body.content
  };
  if (req.file) {
    updateData.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }
  await Blog.findByIdAndUpdate(req.params.id, updateData);
  res.redirect('/admin');
}));

router.delete('/blog/:id', wrapAsync(async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
}));

router.get('/testimonials/add', isAuthenticated, (req, res) => {
  res.render('admin-panel/routes/testimonials/add', { section: 'testimonial' });
});

router.post('/testimonials', wrapAsync(async (req, res) => {
  await Testimonial.create(req.body);
  res.redirect('/admin');
}));

router.get('/testimonials/edit/:id', isAuthenticated, wrapAsync(async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  res.render('admin-panel/routes/testimonials/edit', { section: 'testimonial', testimonial });
}));

router.put('/testimonials/:id', wrapAsync(async (req, res) => {
  await Testimonial.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/admin');
}));

router.delete('/testimonials/:id', wrapAsync(async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
}));

router.get('/contact/add', isAuthenticated, (req, res) => {
  res.render('admin-panel/routes/contact/add', { section: 'contact' });
});

router.post('/contact', async (req, res) => {
  await Contact.create(req.body);
  res.redirect('/admin');
});

router.get('/contact/edit/:id', isAuthenticated, wrapAsync(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  res.render('admin-panel/routes/contact/edit', { section: 'contact', contact });
}));

router.put('/contact/:id', wrapAsync(async (req, res) => {
  await Contact.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/admin');
}));

router.delete('/contact/:id', wrapAsync(async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
}));

router.get('/', isAuthenticated, wrapAsync(async (req, res) => {
  const heroData = await Hero.find({});
  const projectData = await Project.find({});
  const aboutData = await About.findOne({});
  const serviceData = await Services.find({});
  const testimonialData = await Testimonial.find({});
  const contactData = await Contact.find({});
  const blogData = await Blog.find({});
  const faqData = await FAQ.find({});
  res.render('admin-panel/admin-panel', {
    heroData,
    projectData,
    aboutData,
    serviceData,
    testimonialData,
    contactData,
    blogData,
    faqData
  });
}));

module.exports = router;
