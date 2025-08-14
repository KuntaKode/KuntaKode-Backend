const { post, updateBlog, deleteBlog, getAllBlogs, getBlogById } = require('../controller/blogController');
const express = require('express');
const { isAuthenticated } = require('../middleware/AuthenticatedMiddleware');
const { uploadMiddleware } = require('../middleware/upload.middleware');
const router = express.Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

router.post('/', isAuthenticated, uploadMiddleware, post);
router.put('/:id', isAuthenticated, uploadMiddleware, updateBlog);
router.delete('/:id', isAuthenticated, deleteBlog);

module.exports = router;
