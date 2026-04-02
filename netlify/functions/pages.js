// netlify/functions/pages.js
// GET /api/pages       -> list user's pages
// POST /api/pages      -> create new page

const { ObjectId } = require('mongodb')
const { connectDB } = require('./_db')
const { getUserFromEvent, respond, corsHeaders } = require('./_auth')

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

const DEFAULT_SECTIONS = {
  hero: {
    type: 'hero',
    title: 'Welcome to My Site',
    subtitle: 'Built with VibeKit Studio — your vibe, your way.',
    buttonText: 'Get Started',
    buttonUrl: '#contact'
  },
  features: {
    type: 'features',
    cards: [
      { title: 'Feature One', description: 'Describe your first amazing feature here.' },
      { title: 'Feature Two', description: 'Another reason why people will love this.' },
      { title: 'Feature Three', description: 'The third thing that makes you stand out.' }
    ]
  },
  gallery: {
    type: 'gallery',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80'
    ]
  },
  contact: {
    type: 'contact',
    heading: 'Get In Touch',
    subheading: "Have a question or want to work together? Drop us a message."
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders() }
  }

  const user = getUserFromEvent(event)
  if (!user) return respond(401, { error: 'Unauthorized' })

  const db = await connectDB()
  const pages = db.collection('pages')

  // GET - list pages
  if (event.httpMethod === 'GET') {
    const list = await pages
      .find({ userId: user.userId })
      .sort({ updatedAt: -1 })
      .toArray()
    return respond(200, list.map(p => ({
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      theme: p.theme,
      status: p.status,
      viewCount: p.viewCount || 0,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    })))
  }

  // POST - create page
  if (event.httpMethod === 'POST') {
    let body
    try { body = JSON.parse(event.body || '{}') } catch { return respond(400, { error: 'Invalid JSON' }) }

    const title = (body.title || 'Untitled Page').trim()
    if (!title) return respond(400, { error: 'Title is required' })

    // Generate unique slug
    let baseSlug = slugify(title) || 'my-page'
    let slug = baseSlug
    let attempt = 0
    while (await pages.findOne({ slug })) {
      attempt++
      slug = `${baseSlug}-${attempt}`
    }

    const now = new Date()
    const doc = {
      userId: user.userId,
      title,
      slug,
      theme: body.theme || 'pastel',
      status: 'draft',
      viewCount: 0,
      sections: [
        { ...DEFAULT_SECTIONS.hero, id: 'hero' },
        { ...DEFAULT_SECTIONS.features, id: 'features' },
        { ...DEFAULT_SECTIONS.gallery, id: 'gallery' },
        { ...DEFAULT_SECTIONS.contact, id: 'contact' }
      ],
      createdAt: now,
      updatedAt: now
    }

    const result = await pages.insertOne(doc)
    return respond(201, { ...doc, id: result.insertedId.toString(), _id: undefined })
  }

  return respond(405, { error: 'Method not allowed' })
}
