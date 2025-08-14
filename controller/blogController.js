const Blog = require("../model/blog");
const { uploadImage, deleteImage } = require("../config/cloudinary");
const fs = require('fs');

const post = async (req, res) => {
    try {
        const { title, content, author, category, tags, status } = req.body;
        
        let imageUri = null;
        let imagePublicId = null;

        if (req.file) {
            console.log('Uploading image to Cloudinary...');
            const uploadResult = await uploadImage(req.file.path);
            
            if (uploadResult.success) {
                imageUri = uploadResult.url;
                imagePublicId = uploadResult.public_id;
                console.log('Image uploaded successfully:', imageUri);
                
                fs.unlinkSync(req.file.path);
            } else {
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed",
                    error: uploadResult.error
                });
            }
        }

        const wordCount = content.split(' ').length;
        const readTime = Math.ceil(wordCount / 200);

        const blogPost = new Blog({
            title,
            content,
            imageUri,
            imagePublicId,
            author,
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            status: status || 'draft',
            readTime
        });

        const result = await blogPost.save();
        
        res.status(201).json({
            success: true,
            message: "Blog post created successfully",
            blogPost: {
                _id: result._id,
                title: result.title,
                author: result.author,
                category: result.category,
                imageUri: result.imageUri,
                status: result.status,
                readTime: result.readTime,
                createdAt: result.createdAt
            }
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            message: "Error creating blog post",
            error: error.message
        });
    }
}

const updateBlog = async (req, res) => {
    try {
        const { title, content, author, category, tags, status } = req.body;
        const blogId = req.params.id;

        const existingBlog = await Blog.findById(blogId);
        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found"
            });
        }

        let imageUri = existingBlog.imageUri;
        let imagePublicId = existingBlog.imagePublicId;

        if (req.file) {
            console.log('Uploading new image to Cloudinary...');
            const uploadResult = await uploadImage(req.file.path);
            
            if (uploadResult.success) {
                if (existingBlog.imagePublicId) {
                    console.log('Deleting old image from Cloudinary...');
                    await deleteImage(existingBlog.imagePublicId);
                }
                
                imageUri = uploadResult.url;
                imagePublicId = uploadResult.public_id;
                console.log('New image uploaded successfully:', imageUri);
                
                fs.unlinkSync(req.file.path);
            } else {
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed",
                    error: uploadResult.error
                });
            }
        }

        const readTime = content !== existingBlog.content ? 
            Math.ceil(content.split(' ').length / 200) : 
            existingBlog.readTime;

        const updateData = {
            title,
            content,
            imageUri,
            imagePublicId,
            author,
            category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : existingBlog.tags,
            status: status || existingBlog.status,
            readTime
        };

        const result = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });
        
        res.status(200).json({
            success: true,
            message: "Blog post updated successfully",
            blogPost: {
                _id: result._id,
                title: result.title,
               
                author: result.author,
                category: result.category,
                imageUri: result.imageUri,
                status: result.status,
                readTime: result.readTime,
                updatedAt: result.updatedAt
            }
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            message: "Error updating blog post",
            error: error.message
        });
    }
}

const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found"
            });
        }

        if (blog.imagePublicId) {
            console.log('Deleting image from Cloudinary...');
            const deleteResult = await deleteImage(blog.imagePublicId);
            if (deleteResult.success) {
                console.log('Image deleted from Cloudinary successfully');
            } else {
                console.log('Failed to delete image from Cloudinary:', deleteResult.error);
            }
        }

        await Blog.findByIdAndDelete(blogId);
        
        res.status(200).json({
            success: true,
            message: "Blog post and associated image deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting blog post",
            error: error.message
        });
    }
}

const getAllBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, status = 'published' } = req.query;
        
        const filter = { status };
        if (category) {
            filter.category = category;
        }

        const blogs = await Blog.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Blog.countDocuments(filter);

        res.status(200).json({
            success: true,
            blogs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching blogs",
            error: error.message
        });
    }
}

const getBlogById = async (req, res) => {
    try {
        const id = req.params.id;
        const blog = await Blog.findById(id);
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found"
            });
        }

        res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving blog post",
            error: error.message
        });
    }
}
module.exports = {
    post,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getBlogById
};
