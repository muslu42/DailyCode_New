export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string
          title: string
          summary: string
          category: string
          content: string
          cover_image: string
          publish_date: string
          tags: string[]
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          summary: string
          category: string
          content: string
          cover_image: string
          publish_date: string
          tags: string[]
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string
          category?: string
          content?: string
          cover_image?: string
          publish_date?: string
          tags?: string[]
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}