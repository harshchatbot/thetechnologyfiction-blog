import type {Post} from "@/types/content";
/** Display-only editorial grouping; preserves persisted category IDs and slugs. */
export function editorialTopic(post:Post):"Admin"|"Developer"|"Interview Prep"|"AI"|"Career"{
 const text=[post.title,post.subtitle,post.excerpt,post.category.name,...post.tags.map(t=>t.name)].join(" ").toLowerCase();
 if(/interview|resume|recruit|hiring|questions|placement/.test(text))return "Interview Prep";
 if(/agentforce|artificial intelligence|\bai\b|\brag\b|prompt|llm|machine learning/.test(text))return "AI";
 if(/career|job|salary|switch|fresher|graduate|growth/.test(text))return "Career";
 if(/apex|lwc|developer|trigger|code|integration|api|soql|javascript/.test(text))return "Developer";
 return "Admin";
}
export function matchesEditorialTopic(post:Post,query:string){
 const q=query.trim().toLowerCase();
 if(q==="developer")return editorialTopic(post)==="Developer";
 if(q==="admin")return editorialTopic(post)==="Admin";
 if(q==="interview")return editorialTopic(post)==="Interview Prep";
 if(q==="ai")return editorialTopic(post)==="AI";
 if(q==="career")return editorialTopic(post)==="Career";
 return null;
}
