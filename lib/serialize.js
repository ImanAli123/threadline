export function serializeProduct(p) {
  return {
    id: String(p._id),
    slug: p.slug,
    title: p.title,
    category: p.category,
    price: p.price,
    discountPrice: p.discountPrice ?? null,
    colors: (p.colors || []).map((c) => ({ name: c.name, hex: c.hex })),
    sizes: p.sizes || [],
    description: p.description || "",
    details: p.details || [],
    images: p.images || [],
    isNew: Boolean(p.isNewArrival),
    bestSeller: Boolean(p.bestSeller),
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    stock: p.stock ?? 0,
  };
}

export function serializeUser(u) {
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
  };
}