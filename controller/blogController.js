const Blog=require("../model/blog");

const post=(req,res)=>{
    const { title, content, imageUri, author, category, tags } = req.body;

    const blogPost = new Blog({
        title,
        content,
        imageUri,
        author,
        category,
        tags
    });

    blogPost.save()
        .then((result) => {
            res.status(201).json({
                message: "Blog post created successfully",
                blogPost: result
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Error creating blog post",
                error: error.message
            });
        });
}

const updateBlog=(req,res)=>{
    const { title, content, imageUri, author, category, tags } = req.body;
    const blogId = req.params.id;

    Blog.findByIdAndUpdate(blogId, {
        title,
        content,
        imageUri,
        author,
        category,
        tags
    }, { new: true })
    .then((result) => {
        if (!result) {
            return res.status(404).json({
                message: "Blog post not found"
            });
        }
        res.status(200).json({
            message: "Blog post updated successfully",
            blogPost: result
        });
    })
    .catch((error) => {
        res.status(500).json({
            message: "Error updating blog post",
            error: error.message
        });
    });
}

const deleteBlog=(req,res)=>{
    const blogId = req.params.id;
    Blog.findByIdAndDelete(blogId)
    .then((result) => {
        if (!result) {
            return res.status(404).json({
                message: "Blog post not found"
            });
        }
        res.status(200).json({
            message: "Blog post deleted successfully"
        });
    })
    .catch((error) => {
        res.status(500).json({
            message: "Error deleting blog post",
            error: error.message
        });
    });

}

exports.post = post;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
