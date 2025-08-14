const{post,updateBlog,deleteBlog}=require('../controller/blogController');
const express = require('express');
const isAuthenticated = require('../middleware/AuthenticatedMiddleware').isAuthenticated;
const router=express.Router();

router.post('/', isAuthenticated, post);
router.put('/:id', isAuthenticated, updateBlog);
router.delete('/:id', isAuthenticated, deleteBlog);

module.exports = router;
