export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      age_groups: {
        Row: {
          age_group: string
          age_id: number
        }
        Insert: {
          age_group: string
          age_id?: number
        }
        Update: {
          age_group?: string
          age_id?: number
        }
        Relationships: []
      }
      annual_subscriptions: {
        Row: {
          clerk_user_id: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          discount_percent: number | null
          discount_type: string | null
          id: string
          is_trial: boolean | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier_annual"]
          trial_end: string | null
          trial_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          clerk_user_id?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          discount_percent?: number | null
          discount_type?: string | null
          id?: string
          is_trial?: boolean | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier_annual"]
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          clerk_user_id?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          discount_percent?: number | null
          discount_type?: string | null
          id?: string
          is_trial?: boolean | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier_annual"]
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      "Awareness_Attitude_2019-2024": {
        Row: {
          awareness_level: number | null
          brand: string | null
          brand_attitude: number | null
          brand_id: number | null
          country: string | null
          industry: string | null
          industry_id: number | null
          row_id: number
          year: number | null
        }
        Insert: {
          awareness_level?: number | null
          brand?: string | null
          brand_attitude?: number | null
          brand_id?: number | null
          country?: string | null
          industry?: string | null
          industry_id?: number | null
          row_id: number
          year?: number | null
        }
        Update: {
          awareness_level?: number | null
          brand?: string | null
          brand_attitude?: number | null
          brand_id?: number | null
          country?: string | null
          industry?: string | null
          industry_id?: number | null
          row_id?: number
          year?: number | null
        }
        Relationships: []
      }
      brand_synonyms: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          synonym: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          synonym: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          synonym?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_synonyms_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      Brandi_Available_Brands: {
        Row: {
          Brand: string | null
          Country: string | null
          industry: string | null
          "Row ID": number
          Year: number | null
        }
        Insert: {
          Brand?: string | null
          Country?: string | null
          industry?: string | null
          "Row ID": number
          Year?: number | null
        }
        Update: {
          Brand?: string | null
          Country?: string | null
          industry?: string | null
          "Row ID"?: number
          Year?: number | null
        }
        Relationships: []
      }
      brandi_profiles: {
        Row: {
          clerk_user_id: string
          company: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          clerk_user_id: string
          company?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          clerk_user_id?: string
          company?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      brandi_user_roles: {
        Row: {
          clerk_user_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["brandi_app_role"]
          updated_at: string
        }
        Insert: {
          clerk_user_id: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["brandi_app_role"]
          updated_at?: string
        }
        Update: {
          clerk_user_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["brandi_app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          country: string
          created_at: string
          id: string
          industry: string | null
          name: string
          updated_at: string
        }
        Insert: {
          country: string
          created_at?: string
          id?: string
          industry?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          industry?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      clerk_user_roles: {
        Row: {
          clerk_user_id: string
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          clerk_user_id: string
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          clerk_user_id?: string
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      client_accounts: {
        Row: {
          clerk_user_id: string | null
          client_name: string
          created_at: string
          id: string
          industry: string | null
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          clerk_user_id?: string | null
          client_name: string
          created_at?: string
          id?: string
          industry?: string | null
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          clerk_user_id?: string | null
          client_name?: string
          created_at?: string
          id?: string
          industry?: string | null
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      client_brands: {
        Row: {
          brand_id: string | null
          brand_name: string
          client_account_id: string
          country: string
          created_at: string
          id: string
          is_primary: boolean | null
        }
        Insert: {
          brand_id?: string | null
          brand_name: string
          client_account_id: string
          country: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
        }
        Update: {
          brand_id?: string | null
          brand_name?: string
          client_account_id?: string
          country?: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "client_brands_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_brands_client_account_id_fkey"
            columns: ["client_account_id"]
            isOneToOne: false
            referencedRelation: "client_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      comparison_history: {
        Row: {
          brands: string[]
          clerk_user_id: string | null
          country: string
          id: string
          user_id: string
          viewed_at: string
          year: number
        }
        Insert: {
          brands?: string[]
          clerk_user_id?: string | null
          country: string
          id?: string
          user_id: string
          viewed_at?: string
          year: number
        }
        Update: {
          brands?: string[]
          clerk_user_id?: string | null
          country?: string
          id?: string
          user_id?: string
          viewed_at?: string
          year?: number
        }
        Relationships: []
      }
      competitor_sets: {
        Row: {
          client_brand_id: string
          competitor_brand: string
          competitor_brand_id: string | null
          country: string
          created_at: string
          id: string
          notes: string | null
        }
        Insert: {
          client_brand_id: string
          competitor_brand: string
          competitor_brand_id?: string | null
          country: string
          created_at?: string
          id?: string
          notes?: string | null
        }
        Update: {
          client_brand_id?: string
          competitor_brand?: string
          competitor_brand_id?: string | null
          country?: string
          created_at?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competitor_sets_client_brand_id_fkey"
            columns: ["client_brand_id"]
            isOneToOne: false
            referencedRelation: "client_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitor_sets_competitor_brand_id_fkey"
            columns: ["competitor_brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_dashboards: {
        Row: {
          clerk_user_id: string | null
          created_at: string | null
          description: string | null
          id: string
          insight_type: string | null
          is_default: boolean | null
          is_favorite: boolean | null
          last_viewed_at: string | null
          layout_config: Json | null
          name: string
          summary: string | null
          tags: string[] | null
          thumbnail_data: string | null
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          clerk_user_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          insight_type?: string | null
          is_default?: boolean | null
          is_favorite?: boolean | null
          last_viewed_at?: string | null
          layout_config?: Json | null
          name: string
          summary?: string | null
          tags?: string[] | null
          thumbnail_data?: string | null
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          clerk_user_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          insight_type?: string | null
          is_default?: boolean | null
          is_favorite?: boolean | null
          last_viewed_at?: string | null
          layout_config?: Json | null
          name?: string
          summary?: string | null
          tags?: string[] | null
          thumbnail_data?: string | null
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      dashboard_configs: {
        Row: {
          brands: string[]
          chart_type: string | null
          clerk_user_id: string | null
          countries: string[]
          created_at: string | null
          dashboard_id: string
          id: string
          selected_years: number[] | null
          updated_at: string | null
        }
        Insert: {
          brands?: string[]
          chart_type?: string | null
          clerk_user_id?: string | null
          countries?: string[]
          created_at?: string | null
          dashboard_id: string
          id?: string
          selected_years?: number[] | null
          updated_at?: string | null
        }
        Update: {
          brands?: string[]
          chart_type?: string | null
          clerk_user_id?: string | null
          countries?: string[]
          created_at?: string | null
          dashboard_id?: string
          id?: string
          selected_years?: number[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_configs_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "custom_dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_templates: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          template_config: Json
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          template_config: Json
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          template_config?: Json
        }
        Relationships: []
      }
      dashboard_widgets: {
        Row: {
          clerk_user_id: string | null
          configuration: Json
          created_at: string
          dashboard_id: string
          height: number
          id: string
          position_x: number
          position_y: number
          title: string | null
          updated_at: string
          widget_type: Database["public"]["Enums"]["chart_type_enum"]
          width: number
        }
        Insert: {
          clerk_user_id?: string | null
          configuration?: Json
          created_at?: string
          dashboard_id: string
          height?: number
          id?: string
          position_x?: number
          position_y?: number
          title?: string | null
          updated_at?: string
          widget_type: Database["public"]["Enums"]["chart_type_enum"]
          width?: number
        }
        Update: {
          clerk_user_id?: string | null
          configuration?: Json
          created_at?: string
          dashboard_id?: string
          height?: number
          id?: string
          position_x?: number
          position_y?: number
          title?: string | null
          updated_at?: string
          widget_type?: Database["public"]["Enums"]["chart_type_enum"]
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_widgets_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "custom_dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      General_brand_attitude: {
        Row: {
          brand: string | null
          brand_attitude: number | null
          brand_id: number | null
          country: string | null
          industry: string | null
          industry_id: number | null
          row_id: number
          year: number | null
        }
        Insert: {
          brand?: string | null
          brand_attitude?: number | null
          brand_id?: number | null
          country?: string | null
          industry?: string | null
          industry_id?: number | null
          row_id: number
          year?: number | null
        }
        Update: {
          brand?: string | null
          brand_attitude?: number | null
          brand_id?: number | null
          country?: string | null
          industry?: string | null
          industry_id?: number | null
          row_id?: number
          year?: number | null
        }
        Relationships: []
      }
      General_brand_awareness: {
        Row: {
          Awareness_level: number | null
          Brand: string | null
          Brand_id: number | null
          Country: string | null
          Industry: string | null
          Industry_id: number | null
          Row_id: number
          Year: number | null
        }
        Insert: {
          Awareness_level?: number | null
          Brand?: string | null
          Brand_id?: number | null
          Country?: string | null
          Industry?: string | null
          Industry_id?: number | null
          Row_id?: number
          Year?: number | null
        }
        Update: {
          Awareness_level?: number | null
          Brand?: string | null
          Brand_id?: number | null
          Country?: string | null
          Industry?: string | null
          Industry_id?: number | null
          Row_id?: number
          Year?: number | null
        }
        Relationships: []
      }
      general_invitations: {
        Row: {
          created_at: string
          created_by: string | null
          current_uses: number | null
          description: string | null
          expires_at: string
          grants_tier:
            | Database["public"]["Enums"]["subscription_tier_annual"]
            | null
          id: string
          invitation_code: string
          max_uses: number | null
          status: string
          trial_days: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          expires_at?: string
          grants_tier?:
            | Database["public"]["Enums"]["subscription_tier_annual"]
            | null
          id?: string
          invitation_code?: string
          max_uses?: number | null
          status?: string
          trial_days?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          expires_at?: string
          grants_tier?:
            | Database["public"]["Enums"]["subscription_tier_annual"]
            | null
          id?: string
          invitation_code?: string
          max_uses?: number | null
          status?: string
          trial_days?: number | null
        }
        Relationships: []
      }
      hub_post_analytics: {
        Row: {
          browser: string | null
          country: string | null
          created_at: string | null
          cta_clicked: boolean | null
          device_type: string | null
          id: string
          last_activity_at: string | null
          post_id: string
          reading_completed: boolean | null
          reading_time_seconds: number | null
          referrer: string | null
          related_post_clicked: string | null
          scroll_depth_percent: number | null
          session_id: string
          shared_to: string[] | null
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          country?: string | null
          created_at?: string | null
          cta_clicked?: boolean | null
          device_type?: string | null
          id?: string
          last_activity_at?: string | null
          post_id: string
          reading_completed?: boolean | null
          reading_time_seconds?: number | null
          referrer?: string | null
          related_post_clicked?: string | null
          scroll_depth_percent?: number | null
          session_id: string
          shared_to?: string[] | null
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          country?: string | null
          created_at?: string | null
          cta_clicked?: boolean | null
          device_type?: string | null
          id?: string
          last_activity_at?: string | null
          post_id?: string
          reading_completed?: boolean | null
          reading_time_seconds?: number | null
          referrer?: string | null
          related_post_clicked?: string | null
          scroll_depth_percent?: number | null
          session_id?: string
          shared_to?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hub_post_analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "hub_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_posts: {
        Row: {
          author: string
          avg_reading_time_seconds: number | null
          avg_scroll_depth: number | null
          category: string | null
          completion_rate: number | null
          content: string
          created_at: string
          engagement_score: number | null
          excerpt: string
          featured_image_url: string | null
          id: string
          is_published: boolean
          published_at: string | null
          reading_time: number | null
          scheduled_publish_at: string | null
          share_count: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          total_reading_time_seconds: number | null
          updated_at: string
          view_count: number
        }
        Insert: {
          author: string
          avg_reading_time_seconds?: number | null
          avg_scroll_depth?: number | null
          category?: string | null
          completion_rate?: number | null
          content: string
          created_at?: string
          engagement_score?: number | null
          excerpt: string
          featured_image_url?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          reading_time?: number | null
          scheduled_publish_at?: string | null
          share_count?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          total_reading_time_seconds?: number | null
          updated_at?: string
          view_count?: number
        }
        Update: {
          author?: string
          avg_reading_time_seconds?: number | null
          avg_scroll_depth?: number | null
          category?: string | null
          completion_rate?: number | null
          content?: string
          created_at?: string
          engagement_score?: number | null
          excerpt?: string
          featured_image_url?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          reading_time?: number | null
          scheduled_publish_at?: string | null
          share_count?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          total_reading_time_seconds?: number | null
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      insight_projects: {
        Row: {
          clerk_user_id: string | null
          cloned_from: string | null
          color: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          icon: string | null
          id: string
          is_pinned: boolean | null
          is_shared: boolean | null
          is_template: boolean | null
          name: string
          objective: string | null
          status: string | null
          team_members: string[] | null
          template_category: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          clerk_user_id?: string | null
          cloned_from?: string | null
          color?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_pinned?: boolean | null
          is_shared?: boolean | null
          is_template?: boolean | null
          name: string
          objective?: string | null
          status?: string | null
          team_members?: string[] | null
          template_category?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          clerk_user_id?: string | null
          cloned_from?: string | null
          color?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_pinned?: boolean | null
          is_shared?: boolean | null
          is_template?: boolean | null
          name?: string
          objective?: string | null
          status?: string | null
          team_members?: string[] | null
          template_category?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insight_projects_cloned_from_fkey"
            columns: ["cloned_from"]
            isOneToOne: false
            referencedRelation: "insight_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          expires_at: string
          id: string
          invitation_code: string
          status: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          expires_at?: string
          id?: string
          invitation_code?: string
          status?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          expires_at?: string
          id?: string
          invitation_code?: string
          status?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      materiality_areas__age_sbi: {
        Row: {
          age_id: number
          country: string
          materiality_area: string
          percentage: number
          row_id: number
          year: number
        }
        Insert: {
          age_id: number
          country: string
          materiality_area: string
          percentage: number
          row_id?: number
          year: number
        }
        Update: {
          age_id?: number
          country?: string
          materiality_area?: string
          percentage?: number
          row_id?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "materiality_areas_sbi_age_id_fkey"
            columns: ["age_id"]
            isOneToOne: false
            referencedRelation: "age_groups"
            referencedColumns: ["age_id"]
          },
        ]
      }
      materiality_areas_general_sbi: {
        Row: {
          country: string
          materiality_area: string
          percentage: number
          row_id: number
          year: number
        }
        Insert: {
          country: string
          materiality_area: string
          percentage: number
          row_id?: number
          year: number
        }
        Update: {
          country?: string
          materiality_area?: string
          percentage?: number
          row_id?: number
          year?: number
        }
        Relationships: []
      }
      "Merged Brand Awareness Attitude 2019-2024": {
        Row: {
          brand: string | null
          brand_attitude: number | null
          brand_awareness: number | null
          brand_id: number | null
          country: string | null
          industry: string | null
          industry_id: number | null
          row_id: number
          year: number | null
        }
        Insert: {
          brand?: string | null
          brand_attitude?: number | null
          brand_awareness?: number | null
          brand_id?: number | null
          country?: string | null
          industry?: string | null
          industry_id?: number | null
          row_id: number
          year?: number | null
        }
        Update: {
          brand?: string | null
          brand_attitude?: number | null
          brand_awareness?: number | null
          brand_id?: number | null
          country?: string | null
          industry?: string | null
          industry_id?: number | null
          row_id?: number
          year?: number | null
        }
        Relationships: []
      }
      page_views: {
        Row: {
          browser: string | null
          country: string | null
          created_at: string | null
          device_type: string | null
          id: string
          page_path: string
          page_title: string | null
          referrer: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          page_path: string
          page_title?: string | null
          referrer?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          page_path?: string
          page_title?: string | null
          referrer?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          created_at: string | null
          device_type: string | null
          id: string
          metric_name: string
          metric_value: number
          page_path: string
          rating: string
        }
        Insert: {
          created_at?: string | null
          device_type?: string | null
          id?: string
          metric_name: string
          metric_value: number
          page_path: string
          rating: string
        }
        Update: {
          created_at?: string | null
          device_type?: string | null
          id?: string
          metric_name?: string
          metric_value?: number
          page_path?: string
          rating?: string
        }
        Relationships: []
      }
      platform_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      popup_analytics: {
        Row: {
          action_type: string
          country_selected: string | null
          created_at: string | null
          id: string
          popup_name: string
          session_id: string
          time_to_action: number | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          country_selected?: string | null
          created_at?: string | null
          id?: string
          popup_name: string
          session_id: string
          time_to_action?: number | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          country_selected?: string | null
          created_at?: string | null
          id?: string
          popup_name?: string
          session_id?: string
          time_to_action?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string | null
          country: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          industry: string | null
          is_target_brand: boolean | null
          lead_source: string | null
          marketing_consent: boolean | null
          title: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          country?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          industry?: string | null
          is_target_brand?: boolean | null
          lead_source?: string | null
          marketing_consent?: boolean | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          industry?: string | null
          is_target_brand?: boolean | null
          lead_source?: string | null
          marketing_consent?: boolean | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_activity: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          project_id: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          project_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_activity_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "insight_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_ai_analysis: {
        Row: {
          analysis_type: string
          content: Json
          expires_at: string | null
          generated_at: string | null
          id: string
          model_used: string | null
          project_id: string | null
        }
        Insert: {
          analysis_type: string
          content: Json
          expires_at?: string | null
          generated_at?: string | null
          id?: string
          model_used?: string | null
          project_id?: string | null
        }
        Update: {
          analysis_type?: string
          content?: Json
          expires_at?: string | null
          generated_at?: string | null
          id?: string
          model_used?: string | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_ai_analysis_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "insight_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_insights: {
        Row: {
          added_at: string | null
          dashboard_id: string | null
          id: string
          notes: string | null
          position: number | null
          project_id: string | null
          status: string | null
          tags: string[] | null
        }
        Insert: {
          added_at?: string | null
          dashboard_id?: string | null
          id?: string
          notes?: string | null
          position?: number | null
          project_id?: string | null
          status?: string | null
          tags?: string[] | null
        }
        Update: {
          added_at?: string | null
          dashboard_id?: string | null
          id?: string
          notes?: string | null
          position?: number | null
          project_id?: string | null
          status?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "project_insights_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "custom_dashboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_insights_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "insight_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      report_configurations: {
        Row: {
          agency_logo_url: string | null
          brand_colors: Json | null
          created_at: string
          id: string
          report_sections: Json | null
          template_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agency_logo_url?: string | null
          brand_colors?: Json | null
          created_at?: string
          id?: string
          report_sections?: Json | null
          template_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agency_logo_url?: string | null
          brand_colors?: Json | null
          created_at?: string
          id?: string
          report_sections?: Json | null
          template_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      salesforce_leads: {
        Row: {
          company: string | null
          country: string | null
          created_at: string
          email: string
          first_name: string | null
          full_name: string | null
          id: string
          industry: string | null
          last_activity_at: string | null
          last_name: string | null
          last_sign_in_at: string | null
          last_sync_attempt: string | null
          lead_source: string | null
          marketing_consent: boolean | null
          metadata: Json | null
          salesforce_lead_id: string | null
          sign_in_count: number | null
          sync_error: string | null
          sync_status: string | null
          synced_to_salesforce: boolean | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          country?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          last_activity_at?: string | null
          last_name?: string | null
          last_sign_in_at?: string | null
          last_sync_attempt?: string | null
          lead_source?: string | null
          marketing_consent?: boolean | null
          metadata?: Json | null
          salesforce_lead_id?: string | null
          sign_in_count?: number | null
          sync_error?: string | null
          sync_status?: string | null
          synced_to_salesforce?: boolean | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          last_activity_at?: string | null
          last_name?: string | null
          last_sign_in_at?: string | null
          last_sync_attempt?: string | null
          lead_source?: string | null
          marketing_consent?: boolean | null
          metadata?: Json | null
          salesforce_lead_id?: string | null
          sign_in_count?: number | null
          sync_error?: string | null
          sync_status?: string | null
          synced_to_salesforce?: boolean | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_comparisons: {
        Row: {
          brands: string[]
          clerk_user_id: string | null
          country: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          brands?: string[]
          clerk_user_id?: string | null
          country: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          brands?: string[]
          clerk_user_id?: string | null
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      "SB Ranking Scores 2019-2025 BY AGE": {
        Row: {
          age: string | null
          Brand: string | null
          country: string | null
          environment: number | null
          industry: string | null
          row_id: number
          score: number | null
          social: number | null
          year: number | null
        }
        Insert: {
          age?: string | null
          Brand?: string | null
          country?: string | null
          environment?: number | null
          industry?: string | null
          row_id?: number
          score?: number | null
          social?: number | null
          year?: number | null
        }
        Update: {
          age?: string | null
          Brand?: string | null
          country?: string | null
          environment?: number | null
          industry?: string | null
          row_id?: number
          score?: number | null
          social?: number | null
          year?: number | null
        }
        Relationships: []
      }
      "SBI Average Scores": {
        Row: {
          country: string | null
          "row id": number
          score: number | null
          year: number | null
        }
        Insert: {
          country?: string | null
          "row id": number
          score?: number | null
          year?: number | null
        }
        Update: {
          country?: string | null
          "row id"?: number
          score?: number | null
          year?: number | null
        }
        Relationships: []
      }
      "SBI Ranking Positions 2025 only": {
        Row: {
          Brand: string | null
          Country: string | null
          industry: string | null
          "Overall Country Ranking": number | null
          "Ranking Position": number | null
          "Row ID": number
          Year: number | null
        }
        Insert: {
          Brand?: string | null
          Country?: string | null
          industry?: string | null
          "Overall Country Ranking"?: number | null
          "Ranking Position"?: number | null
          "Row ID": number
          Year?: number | null
        }
        Update: {
          Brand?: string | null
          Country?: string | null
          industry?: string | null
          "Overall Country Ranking"?: number | null
          "Ranking Position"?: number | null
          "Row ID"?: number
          Year?: number | null
        }
        Relationships: []
      }
      "SBI Ranking Scores 2011-2025": {
        Row: {
          Brand: string | null
          Country: string | null
          industry: string | null
          "Row ID": number
          Score: number | null
          Year: number | null
        }
        Insert: {
          Brand?: string | null
          Country?: string | null
          industry?: string | null
          "Row ID": number
          Score?: number | null
          Year?: number | null
        }
        Update: {
          Brand?: string | null
          Country?: string | null
          industry?: string | null
          "Row ID"?: number
          Score?: number | null
          Year?: number | null
        }
        Relationships: []
      }
      "SBI SBA 2011-2025": {
        Row: {
          company: string | null
          country: string | null
          gut_feeling_environment: number | null
          gut_feeling_social: number | null
          knowledge_environment: number | null
          knowledge_social: number | null
          no_knowledge_environment: number | null
          no_knowledge_social: number | null
          row_id: number
          year: number | null
        }
        Insert: {
          company?: string | null
          country?: string | null
          gut_feeling_environment?: number | null
          gut_feeling_social?: number | null
          knowledge_environment?: number | null
          knowledge_social?: number | null
          no_knowledge_environment?: number | null
          no_knowledge_social?: number | null
          row_id?: number
          year?: number | null
        }
        Update: {
          company?: string | null
          country?: string | null
          gut_feeling_environment?: number | null
          gut_feeling_social?: number | null
          knowledge_environment?: number | null
          knowledge_social?: number | null
          no_knowledge_environment?: number | null
          no_knowledge_social?: number | null
          row_id?: number
          year?: number | null
        }
        Relationships: []
      }
      "SBI SBQ 2011-2025": {
        Row: {
          company: string | null
          country: string | null
          negative_environment: number | null
          negative_social: number | null
          neutral_environment: number | null
          neutral_social: number | null
          positive_environment: number | null
          positive_social: number | null
          row_id: number
          year: number | null
        }
        Insert: {
          company?: string | null
          country?: string | null
          negative_environment?: number | null
          negative_social?: number | null
          neutral_environment?: number | null
          neutral_social?: number | null
          positive_environment?: number | null
          positive_social?: number | null
          row_id?: number
          year?: number | null
        }
        Update: {
          company?: string | null
          country?: string | null
          negative_environment?: number | null
          negative_social?: number | null
          neutral_environment?: number | null
          neutral_social?: number | null
          positive_environment?: number | null
          positive_social?: number | null
          row_id?: number
          year?: number | null
        }
        Relationships: []
      }
      SBI_behaviour_groups: {
        Row: {
          behaviour_group: string | null
          country: string | null
          percentage: number | null
          year: number | null
        }
        Insert: {
          behaviour_group?: string | null
          country?: string | null
          percentage?: number | null
          year?: number | null
        }
        Update: {
          behaviour_group?: string | null
          country?: string | null
          percentage?: number | null
          year?: number | null
        }
        Relationships: []
      }
      SBI_Discussion_Topics: {
        Row: {
          country: string | null
          discussion_topic: string | null
          percentage: number | null
          row_id: number
          year: number | null
        }
        Insert: {
          country?: string | null
          discussion_topic?: string | null
          percentage?: number | null
          row_id?: number
          year?: number | null
        }
        Update: {
          country?: string | null
          discussion_topic?: string | null
          percentage?: number | null
          row_id?: number
          year?: number | null
        }
        Relationships: []
      }
      SBI_Discussion_Topics_Geography: {
        Row: {
          country: string | null
          discussion_topic: string | null
          geography: string | null
          percentage: number | null
          row_id: number
          year: number
        }
        Insert: {
          country?: string | null
          discussion_topic?: string | null
          geography?: string | null
          percentage?: number | null
          row_id?: number
          year: number
        }
        Update: {
          country?: string | null
          discussion_topic?: string | null
          geography?: string | null
          percentage?: number | null
          row_id?: number
          year?: number
        }
        Relationships: []
      }
      SBI_Inflation_Stability_2025: {
        Row: {
          Brand: string | null
          Country: string | null
          Current_Score: number | null
          Industry: string | null
          Inflation_Performance: string | null
          row_id: number
          Trend_Slope: number | null
          Volatility: number | null
        }
        Insert: {
          Brand?: string | null
          Country?: string | null
          Current_Score?: number | null
          Industry?: string | null
          Inflation_Performance?: string | null
          row_id?: number
          Trend_Slope?: number | null
          Volatility?: number | null
        }
        Update: {
          Brand?: string | null
          Country?: string | null
          Current_Score?: number | null
          Industry?: string | null
          Inflation_Performance?: string | null
          row_id?: number
          Trend_Slope?: number | null
          Volatility?: number | null
        }
        Relationships: []
      }
      SBI_influences: {
        Row: {
          country: string | null
          medium: string | null
          percentage: number | null
          row_id: number
          year: number | null
        }
        Insert: {
          country?: string | null
          medium?: string | null
          percentage?: number | null
          row_id?: number
          year?: number | null
        }
        Update: {
          country?: string | null
          medium?: string | null
          percentage?: number | null
          row_id?: number
          year?: number | null
        }
        Relationships: []
      }
      SBI_Knowledge: {
        Row: {
          country: string | null
          percentage: number | null
          row_id: number
          term: string | null
          year: number | null
        }
        Insert: {
          country?: string | null
          percentage?: number | null
          row_id?: number
          term?: string | null
          year?: number | null
        }
        Update: {
          country?: string | null
          percentage?: number | null
          row_id?: number
          term?: string | null
          year?: number | null
        }
        Relationships: []
      }
      SBI_Priorities_Age_Groups: {
        Row: {
          age: string | null
          country: string | null
          english_label_short: string | null
          percentage: number | null
          row_id: number
          swedish_label_short: string | null
          year: number | null
        }
        Insert: {
          age?: string | null
          country?: string | null
          english_label_short?: string | null
          percentage?: number | null
          row_id?: number
          swedish_label_short?: string | null
          year?: number | null
        }
        Update: {
          age?: string | null
          country?: string | null
          english_label_short?: string | null
          percentage?: number | null
          row_id?: number
          swedish_label_short?: string | null
          year?: number | null
        }
        Relationships: []
      }
      SBI_purchasing_decision_industries: {
        Row: {
          category: string | null
          country: string | null
          impact_level: string | null
          percentage: number | null
          row_id: number
          year: number | null
        }
        Insert: {
          category?: string | null
          country?: string | null
          impact_level?: string | null
          percentage?: number | null
          row_id?: number
          year?: number | null
        }
        Update: {
          category?: string | null
          country?: string | null
          impact_level?: string | null
          percentage?: number | null
          row_id?: number
          year?: number | null
        }
        Relationships: []
      }
      "SBI_VHO_2021-2024": {
        Row: {
          category: string | null
          country: string | null
          industry: string | null
          priority_percentage: number | null
          row_id: number
          type_of_factor: string | null
          vho_area: string | null
          year: number | null
        }
        Insert: {
          category?: string | null
          country?: string | null
          industry?: string | null
          priority_percentage?: number | null
          row_id?: number
          type_of_factor?: string | null
          vho_area?: string | null
          year?: number | null
        }
        Update: {
          category?: string | null
          country?: string | null
          industry?: string | null
          priority_percentage?: number | null
          row_id?: number
          type_of_factor?: string | null
          vho_area?: string | null
          year?: number | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      session_metrics: {
        Row: {
          conversion_event: string | null
          ended_at: string | null
          engagement_time: number | null
          entry_page: string
          exit_page: string | null
          max_scroll_depth: number | null
          pages_visited: number | null
          session_id: string
          started_at: string | null
          total_time: number | null
          user_id: string | null
        }
        Insert: {
          conversion_event?: string | null
          ended_at?: string | null
          engagement_time?: number | null
          entry_page: string
          exit_page?: string | null
          max_scroll_depth?: number | null
          pages_visited?: number | null
          session_id: string
          started_at?: string | null
          total_time?: number | null
          user_id?: string | null
        }
        Update: {
          conversion_event?: string | null
          ended_at?: string | null
          engagement_time?: number | null
          entry_page?: string
          exit_page?: string | null
          max_scroll_depth?: number | null
          pages_visited?: number | null
          session_id?: string
          started_at?: string | null
          total_time?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_features: {
        Row: {
          api_access: boolean | null
          custom_analysis_requests: number | null
          excel_export: boolean | null
          historical_data_years: number
          markets_access: string[] | null
          max_users: number
          pdf_export: boolean | null
          png_export: boolean | null
          powerpoint_export: boolean | null
          priority_support: boolean | null
          quarterly_consultations: number | null
          tier: Database["public"]["Enums"]["subscription_tier_annual"]
        }
        Insert: {
          api_access?: boolean | null
          custom_analysis_requests?: number | null
          excel_export?: boolean | null
          historical_data_years: number
          markets_access?: string[] | null
          max_users: number
          pdf_export?: boolean | null
          png_export?: boolean | null
          powerpoint_export?: boolean | null
          priority_support?: boolean | null
          quarterly_consultations?: number | null
          tier: Database["public"]["Enums"]["subscription_tier_annual"]
        }
        Update: {
          api_access?: boolean | null
          custom_analysis_requests?: number | null
          excel_export?: boolean | null
          historical_data_years?: number
          markets_access?: string[] | null
          max_users?: number
          pdf_export?: boolean | null
          png_export?: boolean | null
          powerpoint_export?: boolean | null
          priority_support?: boolean | null
          quarterly_consultations?: number | null
          tier?: Database["public"]["Enums"]["subscription_tier_annual"]
        }
        Relationships: []
      }
      subscription_team_members: {
        Row: {
          created_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          role: string | null
          subscription_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: string | null
          subscription_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: string | null
          subscription_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_team_members_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "annual_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          clerk_user_id: string | null
          created_at: string
          id: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_ends_at: string | null
          subscription_starts_at: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          trial_ends_at: string | null
          trial_starts_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          clerk_user_id?: string | null
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_starts_at?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          trial_ends_at?: string | null
          trial_starts_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          clerk_user_id?: string | null
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_starts_at?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          trial_ends_at?: string | null
          trial_starts_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_interactions: {
        Row: {
          created_at: string | null
          event_category: string
          event_data: Json | null
          event_type: string
          id: string
          page_path: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_category: string
          event_data?: Json | null
          event_type: string
          id?: string
          page_path: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_category?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          page_path?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          device_info: Json | null
          id: string
          ip_address: string | null
          session_id: string
          sign_in_timestamp: string
          sign_out_timestamp: string | null
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          session_id: string
          sign_in_timestamp?: string
          sign_out_timestamp?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          id?: string
          ip_address?: string | null
          session_id?: string
          sign_in_timestamp?: string
          sign_out_timestamp?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          country: string | null
          created_at: string
          email: string
          id: string
          name: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          interest_area: string | null
          name: string | null
          referral_source: string | null
          tier_interest: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          interest_area?: string | null
          name?: string | null
          referral_source?: string | null
          tier_interest?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          interest_area?: string | null
          name?: string | null
          referral_source?: string | null
          tier_interest?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      webhook_delivery_logs: {
        Row: {
          attempted_at: string
          created_at: string
          delivery_duration_ms: number | null
          error_message: string | null
          event_type: string
          http_status_code: number | null
          id: string
          payload: Json
          response_body: string | null
          status: string
          webhook_subscription_id: string
        }
        Insert: {
          attempted_at?: string
          created_at?: string
          delivery_duration_ms?: number | null
          error_message?: string | null
          event_type: string
          http_status_code?: number | null
          id?: string
          payload: Json
          response_body?: string | null
          status: string
          webhook_subscription_id: string
        }
        Update: {
          attempted_at?: string
          created_at?: string
          delivery_duration_ms?: number | null
          error_message?: string | null
          event_type?: string
          http_status_code?: number | null
          id?: string
          payload?: Json
          response_body?: string | null
          status?: string
          webhook_subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_delivery_logs_webhook_subscription_id_fkey"
            columns: ["webhook_subscription_id"]
            isOneToOne: false
            referencedRelation: "webhook_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_subscriptions: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          failed_deliveries: number | null
          id: string
          is_active: boolean | null
          last_triggered_at: string | null
          secret_key: string | null
          successful_deliveries: number | null
          total_deliveries: number | null
          updated_at: string | null
          webhook_name: string
          webhook_url: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          failed_deliveries?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          secret_key?: string | null
          successful_deliveries?: number | null
          total_deliveries?: number | null
          updated_at?: string | null
          webhook_name: string
          webhook_url: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          failed_deliveries?: number | null
          id?: string
          is_active?: boolean | null
          last_triggered_at?: string | null
          secret_key?: string | null
          successful_deliveries?: number | null
          total_deliveries?: number | null
          updated_at?: string | null
          webhook_name?: string
          webhook_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_competitor: {
        Args: {
          p_client_brand_id: string
          p_competitor_brand: string
          p_notes?: string
        }
        Returns: string
      }
      aggregate_post_analytics: {
        Args: { post_uuid: string }
        Returns: undefined
      }
      brandi_has_role: {
        Args: {
          _clerk_user_id: string
          _role: Database["public"]["Enums"]["brandi_app_role"]
        }
        Returns: boolean
      }
      can_access_waitlist_emails: { Args: never; Returns: boolean }
      can_manage_client_brand: {
        Args: { p_client_brand_id: string }
        Returns: boolean
      }
      can_read_client_brand: {
        Args: { p_client_brand_id: string }
        Returns: boolean
      }
      cleanup_old_audit_logs: { Args: never; Returns: number }
      clone_project: {
        Args: {
          p_clerk_user_id: string
          p_new_name: string
          p_source_project_id: string
        }
        Returns: string
      }
      create_public_bucket_policy: {
        Args: { bucket_name: string }
        Returns: undefined
      }
      end_user_session: { Args: { p_session_id: string }; Returns: undefined }
      get_accessible_years_for_user: {
        Args: { _user_id: string }
        Returns: number[]
      }
      get_all_countries: {
        Args: never
        Returns: {
          country: string
        }[]
      }
      get_available_brands: {
        Args: { p_country: string; p_year?: number }
        Returns: {
          brand: string
        }[]
      }
      get_available_countries: {
        Args: never
        Returns: {
          country: string
        }[]
      }
      get_available_industries: {
        Args: { p_country: string; p_year?: number }
        Returns: {
          industry: string
        }[]
      }
      get_brands_for_list: {
        Args: {
          p_countries: string[]
          p_industries?: string[]
          p_year?: number
        }
        Returns: {
          brand: string
          country: string
          industry: string
          normalized_industry: string
        }[]
      }
      get_clerk_user_id: { Args: never; Returns: string }
      get_competitors: {
        Args: { p_client_brand_id: string }
        Returns: {
          competitor_brand: string
          country: string
          created_at: string
          id: string
          notes: string
        }[]
      }
      get_deep_dive: { Args: { p_client_brand_id: string }; Returns: Json }
      get_demographic_statistics: {
        Args: { p_country?: string }
        Returns: {
          avg_age: number
          country: string
          female_percentage: number
          high_sustainability_impact_percentage: number
          male_percentage: number
          total_respondents: number
        }[]
      }
      get_distinct_industries: {
        Args: { country_filters: string[] }
        Returns: {
          industry: string
        }[]
      }
      get_filtered_brands: {
        Args: { p_country?: string; p_industry?: string; p_year?: number }
        Returns: {
          brand: string
          country: string
          industry: string
        }[]
      }
      get_industry_brand_counts: {
        Args: { p_country: string; p_year?: number }
        Returns: {
          brand_count: number
          industry: string
        }[]
      }
      get_portfolio_metrics: {
        Args: { p_clerk_user_id: string; p_years: number[] }
        Returns: {
          brand_attitude: number
          brand_awareness: number
          brand_id: string
          brand_name: string
          client_id: string
          client_industry: string
          client_name: string
          country: string
          industry: string
          is_primary: boolean
          year: number
        }[]
      }
      get_public_brand_trends: {
        Args: never
        Returns: {
          attitude_change: number
          attitude_trend: string
          awareness_change: number
          awareness_trend: string
          brand_name: string
          country: string
          industry: string
          latest_year: number
          years_tracked: number
        }[]
      }
      get_public_brands_for_search: {
        Args: never
        Returns: {
          brand: string
          country: string
        }[]
      }
      get_public_brands_for_search_q: {
        Args: { search_query: string }
        Returns: {
          brand: string
          country: string
        }[]
      }
      get_rankings_for_authenticated_user: {
        Args: { p_country: string; p_industry?: string; p_year?: number }
        Returns: {
          Brand: string
          Country: string
          industry: string
          "Overall Country Ranking": number
          "Ranking Position": number
          Year: number
        }[]
      }
      get_share_average_scores: {
        Args: { p_countries: string[] }
        Returns: {
          country: string
          score: number
          year: number
        }[]
      }
      get_share_data: {
        Args: { p_brands: string[]; p_country: string }
        Returns: {
          brand: string
          country: string
          industry: string
          score: number
          year: number
        }[]
      }
      get_total_country_brands: {
        Args: { p_country: string; p_year?: number }
        Returns: number
      }
      get_user_subscription: {
        Args: { _user_id: string }
        Returns: {
          days_remaining: number
          is_trial: boolean
          status: string
          subscription_ends_at: string
          tier: string
          trial_ends_at: string
        }[]
      }
      get_user_subscription_annual: {
        Args: { _user_id: string }
        Returns: {
          days_remaining: number
          features: Json
          is_trial: boolean
          status: string
          subscription_ends_at: string
          tier: string
          trial_ends_at: string
        }[]
      }
      get_vho_cross_industry_data: {
        Args: { p_country: string; p_industries: string[] }
        Returns: {
          category: string
          industry: string
          priority_percentage: number
          type_of_factor: string
          vho_area: string
          year: number
        }[]
      }
      get_vho_industries: {
        Args: { p_country: string }
        Returns: {
          industry: string
        }[]
      }
      get_waitlist_count: { Args: never; Returns: number }
      has_active_subscription: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_subscription_tier: {
        Args: {
          _tier: Database["public"]["Enums"]["subscription_tier"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_brandi_admin: { Args: { _clerk_user_id?: string }; Returns: boolean }
      is_brandi_researcher: {
        Args: { _clerk_user_id?: string }
        Returns: boolean
      }
      is_clerk_admin: { Args: { check_user_id?: string }; Returns: boolean }
      is_erik_admin: { Args: never; Returns: boolean }
      is_researcher: { Args: never; Returns: boolean }
      mask_email: { Args: { email_address: string }; Returns: string }
      normalize_industry_name: {
        Args: { industry_name: string }
        Returns: string
      }
      remove_competitor: {
        Args: { p_client_brand_id: string; p_competitor_id: string }
        Returns: boolean
      }
      sync_clerk_user: {
        Args: {
          p_clerk_user_id: string
          p_email: string
          p_first_name?: string
          p_last_name?: string
        }
        Returns: undefined
      }
      table_exists: { Args: { p_table_name: string }; Returns: boolean }
      update_competitor_notes: {
        Args: {
          p_client_brand_id: string
          p_competitor_id: string
          p_notes: string
        }
        Returns: boolean
      }
      update_user_activity: {
        Args: {
          p_ip_address?: string
          p_session_id: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: undefined
      }
      use_general_invitation: {
        Args: { code: string; user_id: string }
        Returns: boolean
      }
      use_invitation: {
        Args: { code: string; user_id: string }
        Returns: boolean
      }
      user_owns_waitlist_entry: {
        Args: { entry_user_id: string }
        Returns: boolean
      }
      validate_general_invitation_code: {
        Args: { code: string }
        Returns: {
          invitation_id: string
          uses_remaining: number
          valid: boolean
        }[]
      }
      validate_invitation_code: {
        Args: { code: string }
        Returns: {
          email: string
          invitation_id: string
          valid: boolean
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "researcher" | "user"
      brandi_app_role: "admin" | "researcher" | "user"
      chart_type_enum:
        | "brand_insights_line"
        | "brand_insights_bar"
        | "country_comparison_line"
        | "country_comparison_bar"
        | "consumer_insights_behavior_groups"
        | "consumer_insights_behavior_time_series"
        | "consumer_insights_discussion_topics"
        | "consumer_insights_industry_impact"
        | "consumer_insights_influences"
        | "consumer_insights_knowledge"
        | "consumer_insights_sustainability_priorities"
        | "consumer_insights_vho_priorities"
      subscription_status:
        | "trial"
        | "active"
        | "past_due"
        | "cancelled"
        | "expired"
      subscription_tier: "starter" | "professional" | "enterprise" | "free"
      subscription_tier_annual:
        | "essential"
        | "professional"
        | "enterprise"
        | "navigator"
        | "brand_navigator"
        | "enterprise_program"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "researcher", "user"],
      brandi_app_role: ["admin", "researcher", "user"],
      chart_type_enum: [
        "brand_insights_line",
        "brand_insights_bar",
        "country_comparison_line",
        "country_comparison_bar",
        "consumer_insights_behavior_groups",
        "consumer_insights_behavior_time_series",
        "consumer_insights_discussion_topics",
        "consumer_insights_industry_impact",
        "consumer_insights_influences",
        "consumer_insights_knowledge",
        "consumer_insights_sustainability_priorities",
        "consumer_insights_vho_priorities",
      ],
      subscription_status: [
        "trial",
        "active",
        "past_due",
        "cancelled",
        "expired",
      ],
      subscription_tier: ["starter", "professional", "enterprise", "free"],
      subscription_tier_annual: [
        "essential",
        "professional",
        "enterprise",
        "navigator",
        "brand_navigator",
        "enterprise_program",
      ],
    },
  },
} as const
