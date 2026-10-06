// ==================================================================================
// JARVIS – AI SOCIAL MEDIA CONTENT & MARKETING OPERATING SYSTEM
// Core Type Definitions
// ==================================================================================

export type ContentPillar =
  | 'Government Scheme Alert'
  | 'Step-by-Step Tutorial'
  | 'Deadline Reminder'
  | 'Customer Success Story'
  | 'PVC Smart Card Showcase'
  | 'Festival Special Greeting'
  | 'Scam / Fake News Warning'
  | 'Fast 10s Digital Tip';

export type TargetAudience =
  | 'All Citizens (સમગ્ર જનતા)'
  | 'Farmers (ખેડૂત મિત્રો)'
  | 'Youth & Students (વિદ્યાર્થીઓ & યુવાનો)'
  | 'Senior Citizens (વરિષ્ઠ નાગરિકો)'
  | 'Construction Workers (શ્રમિક / કડિયા કામ કરતા ભાઈઓ)'
  | 'Shop Owners & MSMEs (વેપારીઓ)';

export type ContentFormat =
  | 'Instagram Reel'
  | 'YouTube Short'
  | 'YouTube Long Video'
  | 'Facebook Video'
  | 'Advertisement Video'
  | 'Advertisement Image'
  | 'Poster'
  | 'Educational Post'
  | 'Tutorial'
  | 'Explainer'
  | 'Story'
  | 'Product Promotion'
  | 'Service Promotion'
  | 'Government Scheme Awareness'
  | 'Festival Content'
  | 'Custom Content';

export type LanguageMode =
  | 'Bilingual (Gujarati + English)'
  | 'Gujarati'
  | 'English'
  | 'Hindi';

export type ApprovalState =
  | 'Draft'
  | 'In Review'
  | 'Changes Requested'
  | 'Approved'
  | 'Scheduled'
  | 'Published';

export type SocialPlatform =
  | 'Instagram Reels'
  | 'YouTube Shorts'
  | 'Facebook'
  | 'WhatsApp Status'
  | 'Telegram Channel';

// 1. Business Knowledge Base
export interface BusinessKnowledgeItem {
  id: string;
  category: 'Service' | 'Location' | 'Timing' | 'Pricing' | 'FAQ' | 'Policy' | 'Brand Rule' | 'Legal & Disclaimer';
  title: string;
  title_gu: string;
  content: string;
  content_gu: string;
  required_documents?: string[];
  price?: number;
  tags: string[];
}

// 2. Brand Knowledge Base
export interface BrandGuidelines {
  brand_name: string;
  brand_name_gu: string;
  tagline_gu: string;
  tagline_en: string;
  primary_color: string;
  secondary_color: string;
  gold_accent: string;
  dark_bg: string;
  public_email: string; // Strictly email only, no public phone
  font_gujarati: string;
  font_english: string;
  disclaimer_gu: string;
  disclaimer_en: string;
  watermark_enabled: boolean;
  watermark_position: 'Top Right' | 'Bottom Right' | 'Bottom Center';
}

// 3. Project Definition
export interface JarvisProject {
  id: string;
  name: string;
  topic: string;
  objective: string;
  target_audience: TargetAudience;
  country: string;
  state: string;
  city_area: string;
  language: LanguageMode;
  platform: SocialPlatform;
  content_format: ContentFormat;
  duration_sec: number;
  primary_service_code?: string;
  status: ApprovalState;
  created_at: string;
  updated_at: string;
}

// 4. Bilingual Script
export interface ScriptSection {
  duration_sec: number;
  text_gu: string;
  text_en: string;
  action_note: string;
  contact_phone?: string;
}

export interface JarvisScript {
  id: string;
  project_id: string;
  title: string;
  language_mode: LanguageMode;
  estimated_duration_sec: number;
  hook: ScriptSection;
  problem_agitation: ScriptSection;
  solution_explanation: ScriptSection;
  call_to_action: ScriptSection;
  voiceover_style: 'Energetic & Urgent' | 'Calm & Trustworthy' | 'Conversational & Friendly' | 'Official';
  created_at: string;
}

// 5. Storyboard Shot (For 10-Second Rule & Assembly)
export interface StoryboardShot {
  shot_number: number;
  start_sec: number;
  end_sec: number;
  duration_sec: number;
  framing: 'Extreme Close-Up' | 'Close-Up' | 'Medium Shot' | 'Screen Mockup' | 'Graphic Card';
  visual_description: string;
  visual_description_gu: string;
  character_reference?: string;
  camera_movement: 'Static' | 'Slow Zoom-In' | 'Pan Right' | 'Fast Whip-Cut';
  dialogue: string;
  on_screen_text_gu: string;
  on_screen_text_en: string;
  sound_effect: string;
  continuity_notes: string;
  image_prompt: string;
  video_prompt: string;
  json_prompt?: Record<string, unknown>;
  image_url?: string;
  clip_video_url?: string;
}

export interface ShotStoryboard {
  id: string;
  project_id: string;
  script_id: string;
  aspect_ratio: '9:16 (Vertical)' | '16:9 (Landscape)' | '1:1 (Square)';
  total_duration_sec: number;
  shots: StoryboardShot[];
  created_at: string;
}

// 6. Flow AI 10-Second Clip Spec
export interface TenSecondClipSpec {
  id: string;
  shot_index: number;
  clip_name: string;
  duration_sec: number; // Max 10s per clip
  hook_sec: number;
  core_sec: number;
  cta_sec: number;
  script_gu: string;
  script_en: string;
  pacing: 'Ultra Fast (Viral Hook)' | 'Rhythmic' | 'Steady';
  visual_prompt: string;
  continuity_tag: string;
  status: 'Ready to Render' | 'Rendering' | 'Completed' | 'Failed';
  clip_url?: string;
}

// 7. Video Assembly Timeline
export interface VideoAssemblyTimeline {
  id: string;
  project_id: string;
  title: string;
  aspect_ratio: '9:16' | '16:9' | '1:1';
  music_track: string;
  music_volume: number;
  voiceover_lang: LanguageMode;
  voice_id: string;
  subtitle_style: 'Bold Yellow Shadow' | 'Clean White Box' | 'Animated Karaoke';
  clip_sequence: string[];
  total_duration_sec: number;
  render_progress: number; // 0 - 100
  final_video_url?: string;
  created_at: string;
}

// 8. Quality Assurance & Language Accuracy
export interface QACheckItem {
  rule_id: string;
  category: 'Language' | 'Continuity' | 'Legal & Disclaimer' | 'Visual & Text' | 'Audio';
  title: string;
  status: 'PASS' | 'WARNING' | 'FAIL';
  detail: string;
  detail_gu: string;
}

export interface JarvisQAResult {
  id: string;
  project_id: string;
  score: number; // 0 to 100
  passed: boolean;
  checks: QACheckItem[];
  evaluated_at: string;
}

// 9. Content Calendar Item
export interface CalendarEntry {
  id: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  date: string;
  content_format: ContentFormat;
  title: string;
  title_gu: string;
  platform: SocialPlatform;
  project_id?: string;
  status: ApprovalState;
}

// 10. Social Media Profile & Post Dispatch
export interface SocialProfile {
  id: string;
  platform: SocialPlatform;
  account_name: string;
  handle: string;
  bio: string;
  target_audience: string;
  is_connected: boolean;
  last_synced?: string;
}

export interface SocialScheduledPost {
  id: string;
  project_id: string;
  title: string;
  platforms: SocialPlatform[];
  caption_gu: string;
  caption_en: string;
  hashtags: string[];
  media_url?: string;
  scheduled_timestamp: string;
  status: 'Draft' | 'Approved' | 'Scheduled' | 'Published' | 'Failed';
  published_url?: string;
}

// 11. Marketing Analytics & WhatsApp Lead Conversion Bridge
export interface MarketingCampaignMetric {
  id: string;
  project_id?: string;
  campaign_name: string;
  platform: SocialPlatform;
  views: number;
  impressions: number;
  likes: number;
  shares: number;
  saves: number;
  comments: number;
  whatsapp_inquiries: number; // Inbound conversations initiated via campaign
  portal_applications: number; // Citizen applications submitted
  converted_revenue: number; // Value of completed services
  roi_percent: number;
  date: string;
}

// 12. AI Learning & Memory
export interface JarvisMemoryRecord {
  id: string;
  memory_type: 'Brand Style' | 'Preferred Hook' | 'Successful Prompt' | 'Tone Rule' | 'Audience Pattern';
  key: string;
  value: string;
  confidence: number;
  source_project_id?: string;
  created_at: string;
}

// 13. Integrations Hub
export interface IntegrationStatus {
  id: string;
  provider: 'OpenAI' | 'Google Gemini' | 'Supabase' | 'WhatsApp Business (Meta)' | 'YouTube Shorts' | 'Meta (Instagram/FB)' | 'Razorpay';
  name: string;
  description: string;
  auth_type: 'API Key' | 'OAuth 2.0' | 'Service Role' | 'Webhook Secret';
  is_connected: boolean;
  status_message: string;
  where_to_obtain: string;
}
