// The shapes the Toolshop replies with, as far as the spec and qa/gaps.md prove them.
export type Product = { id: string; name: string };
export type Favorite = { id: string; user_id: string; product_id: string; product?: Product };
