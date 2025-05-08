export interface Job {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  s3_key: string;
  derived_key: string;
  status: string;
  created_at: string;
  transcript_key: string;
  transcript_status: string;
  clips_json: string;
  clips_status: string;
}
