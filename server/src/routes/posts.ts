import { Router } from "express";
import { Post } from "../models/Post.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/posts
// Public endpoint: lists all published blog posts, sorted by publishedAt / createdAt descending
router.get("/", async (req, res) => {
  try {
    const { category, featured, limit } = req.query;
    const query: any = { status: "published" };

    if (category && category !== "All") {
      query.category = new RegExp(`^${category}$`, "i");
    }

    if (featured === "true") {
      query.featured = true;
    }

    let posts = Post.find(query).sort({ publishedAt: -1, createdAt: -1 });
    if (limit) {
      posts = posts.limit(Number(limit));
    }

    const results = await posts;
    return res.json(results);
  } catch (error) {
    console.error("Fetch posts error:", error);
    return res.status(500).json({ error: "Failed to fetch posts." });
  }
});

// GET /api/posts/all (Protected, gets everything for admin panel listing)
router.get("/all", requireAuth, async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    return res.json(posts);
  } catch (error) {
    console.error("Fetch all posts error:", error);
    return res.status(500).json({ error: "Failed to fetch all posts." });
  }
});

// GET /api/posts/:slug (Public, gets single article by slug)
router.get("/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: "Article not found." });
    }
    
    // Safety check: if draft, ensure admin is logged in (could check header token manually or standard)
    if (post.status === "draft") {
      // In this setup, we can allow draft fetching by slug for preview. If needed, we can check auth.
      // Let's keep it simple: if draft, and request has no auth token, block it.
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(404).json({ error: "Article not found." });
      }
    }

    return res.json(post);
  } catch (error) {
    console.error("Fetch single post error:", error);
    return res.status(500).json({ error: "Failed to fetch article details." });
  }
});

// POST /api/posts (Protected, creates new post)
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      category,
      tags,
      coverImage,
      coverImagePublicId,
      content,
      author,
      publishedAt,
      readingTime,
      featured,
      status,
      seoTitle,
      seoDescription
    } = req.body;

    const existing = await Post.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: "An article with this slug already exists." });
    }

    // If published, set publishedAt if not provided
    const publishDate = status === "published" ? (publishedAt || new Date()) : publishedAt;

    const newPost = new Post({
      title,
      slug,
      excerpt,
      category,
      tags: tags || [],
      coverImage,
      coverImagePublicId: coverImagePublicId || "",
      content,
      author: author || "Saurabh Rathore",
      publishedAt: publishDate,
      readingTime: readingTime || "5 min read",
      featured: featured || false,
      status: status || "draft",
      seoTitle: seoTitle || "",
      seoDescription: seoDescription || ""
    });

    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({ error: "Failed to create article." });
  }
});

// PUT /api/posts/:id (Protected, updates post)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { status, publishedAt } = req.body;
    const updateData = { ...req.body };

    // If status is being changed to published, set publishedAt if not present
    if (status === "published" && !publishedAt) {
      const existing = await Post.findById(req.params.id);
      if (existing && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ error: "Article not found." });
    }

    return res.json(post);
  } catch (error) {
    console.error("Update post error:", error);
    return res.status(500).json({ error: "Failed to update article." });
  }
});

// POST /api/posts/:id/duplicate (Protected)
router.post("/:id/duplicate", requireAuth, async (req, res) => {
  try {
    const source = await Post.findById(req.params.id);
    if (!source) {
      return res.status(404).json({ error: "Source article not found." });
    }

    const baseSlug = `${source.slug}-copy`;
    let finalSlug = baseSlug;
    let counter = 1;

    while (await Post.findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const duplicate = new Post({
      title: `${source.title} (Copy)`,
      slug: finalSlug,
      excerpt: source.excerpt,
      category: source.category,
      tags: source.tags,
      coverImage: source.coverImage,
      coverImagePublicId: source.coverImagePublicId || "",
      content: source.content,
      author: source.author,
      readingTime: source.readingTime,
      featured: false, // Do not duplicate as featured
      status: "draft", // Always duplicate as draft
      seoTitle: source.seoTitle ? `${source.seoTitle} (Copy)` : "",
      seoDescription: source.seoDescription
    });

    await duplicate.save();
    return res.status(201).json(duplicate);
  } catch (error) {
    console.error("Duplicate post error:", error);
    return res.status(500).json({ error: "Failed to duplicate article." });
  }
});

// DELETE /api/posts/:id (Protected, deletes post)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Article not found." });
    }
    return res.json({ message: "Article deleted successfully." });
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(500).json({ error: "Failed to delete article." });
  }
});

export default router;
