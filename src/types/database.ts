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
      users: {
        Row: {
          id: string
          role: 'doctor' | 'patient'
          full_name: string
          email: string
          phone: string | null
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id: string
          role: 'doctor' | 'patient'
          full_name: string
          email: string
          phone?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          role?: 'doctor' | 'patient'
          full_name?: string
          email?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      patients: {
        Row: {
          id: string
          user_id: string
          date_of_birth: string | null
          age: number | null
          marital_status: 'single' | 'married' | 'divorced' | 'widowed' | null
          blood_group: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date_of_birth?: string | null
          age?: number | null
          marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | null
          blood_group?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date_of_birth?: string | null
          age?: number | null
          marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | null
          blood_group?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      patient_medical_history: {
        Row: {
          id: string
          patient_id: string
          menstrual_history: Json | null
          pregnancy_history: Json | null
          hpv_vaccination_status: boolean
          hpv_vaccination_date: string | null
          family_cancer_history: string | null
          other_medical_conditions: string[] | null
          allergies: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          menstrual_history?: Json | null
          pregnancy_history?: Json | null
          hpv_vaccination_status?: boolean
          hpv_vaccination_date?: string | null
          family_cancer_history?: string | null
          other_medical_conditions?: string[] | null
          allergies?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          menstrual_history?: Json | null
          pregnancy_history?: Json | null
          hpv_vaccination_status?: boolean
          hpv_vaccination_date?: string | null
          family_cancer_history?: string | null
          other_medical_conditions?: string[] | null
          allergies?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      screening_records: {
        Row: {
          id: string
          patient_id: string
          screening_type: 'pap_smear' | 'hpv_test' | 'biopsy' | 'colposcopy'
          screening_date: string
          result: string
          cin_stage: 'normal' | 'cin1' | 'cin2' | 'cin3' | 'cancer' | null
          notes: string | null
          document_url: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          screening_type: 'pap_smear' | 'hpv_test' | 'biopsy' | 'colposcopy'
          screening_date: string
          result: string
          cin_stage?: 'normal' | 'cin1' | 'cin2' | 'cin3' | 'cancer' | null
          notes?: string | null
          document_url?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          screening_type?: 'pap_smear' | 'hpv_test' | 'biopsy' | 'colposcopy'
          screening_date?: string
          result?: string
          cin_stage?: 'normal' | 'cin1' | 'cin2' | 'cin3' | 'cancer' | null
          notes?: string | null
          document_url?: string | null
          created_by?: string
          created_at?: string
        }
      }
      diagnoses: {
        Row: {
          id: string
          patient_id: string
          diagnosis_date: string
          cancer_stage: string
          histology_type: string | null
          tumor_size: string | null
          lymph_node_involvement: boolean
          metastasis: boolean
          notes: string | null
          diagnosed_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          diagnosis_date: string
          cancer_stage: string
          histology_type?: string | null
          tumor_size?: string | null
          lymph_node_involvement?: boolean
          metastasis?: boolean
          notes?: string | null
          diagnosed_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          diagnosis_date?: string
          cancer_stage?: string
          histology_type?: string | null
          tumor_size?: string | null
          lymph_node_involvement?: boolean
          metastasis?: boolean
          notes?: string | null
          diagnosed_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      treatments: {
        Row: {
          id: string
          patient_id: string
          diagnosis_id: string | null
          treatment_type: 'chemotherapy' | 'radiation' | 'surgery' | 'immunotherapy' | 'targeted_therapy'
          start_date: string
          end_date: string | null
          status: 'planned' | 'ongoing' | 'completed' | 'discontinued'
          protocol: string | null
          notes: string | null
          prescribed_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          diagnosis_id?: string | null
          treatment_type: 'chemotherapy' | 'radiation' | 'surgery' | 'immunotherapy' | 'targeted_therapy'
          start_date: string
          end_date?: string | null
          status?: 'planned' | 'ongoing' | 'completed' | 'discontinued'
          protocol?: string | null
          notes?: string | null
          prescribed_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          diagnosis_id?: string | null
          treatment_type?: 'chemotherapy' | 'radiation' | 'surgery' | 'immunotherapy' | 'targeted_therapy'
          start_date?: string
          end_date?: string | null
          status?: 'planned' | 'ongoing' | 'completed' | 'discontinued'
          protocol?: string | null
          notes?: string | null
          prescribed_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      treatment_sessions: {
        Row: {
          id: string
          treatment_id: string
          session_number: number
          scheduled_date: string
          completed_date: string | null
          status: 'scheduled' | 'completed' | 'missed' | 'cancelled'
          notes: string | null
          side_effects_reported: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          treatment_id: string
          session_number: number
          scheduled_date: string
          completed_date?: string | null
          status?: 'scheduled' | 'completed' | 'missed' | 'cancelled'
          notes?: string | null
          side_effects_reported?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          treatment_id?: string
          session_number?: number
          scheduled_date?: string
          completed_date?: string | null
          status?: 'scheduled' | 'completed' | 'missed' | 'cancelled'
          notes?: string | null
          side_effects_reported?: string[] | null
          created_at?: string
        }
      }
      medications: {
        Row: {
          id: string
          patient_id: string
          treatment_id: string | null
          medication_name: string
          dosage: string
          frequency: string
          start_date: string
          end_date: string | null
          status: 'active' | 'completed' | 'discontinued'
          prescribed_by: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          treatment_id?: string | null
          medication_name: string
          dosage: string
          frequency: string
          start_date: string
          end_date?: string | null
          status?: 'active' | 'completed' | 'discontinued'
          prescribed_by: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          treatment_id?: string | null
          medication_name?: string
          dosage?: string
          frequency?: string
          start_date?: string
          end_date?: string | null
          status?: 'active' | 'completed' | 'discontinued'
          prescribed_by?: string
          created_at?: string
        }
      }
      symptoms_log: {
        Row: {
          id: string
          patient_id: string
          log_date: string
          symptoms: string[]
          pain_scale: number
          bleeding: boolean
          bleeding_severity: 'light' | 'moderate' | 'heavy' | null
          fatigue_level: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          log_date: string
          symptoms: string[]
          pain_scale: number
          bleeding?: boolean
          bleeding_severity?: 'light' | 'moderate' | 'heavy' | null
          fatigue_level: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          log_date?: string
          symptoms?: string[]
          pain_scale?: number
          bleeding?: boolean
          bleeding_severity?: 'light' | 'moderate' | 'heavy' | null
          fatigue_level?: number
          notes?: string | null
          created_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          appointment_date: string
          appointment_type: 'consultation' | 'follow_up' | 'screening' | 'treatment' | 'teleconsultation'
          status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          appointment_date: string
          appointment_type: 'consultation' | 'follow_up' | 'screening' | 'treatment' | 'teleconsultation'
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          appointment_date?: string
          appointment_type?: 'consultation' | 'follow_up' | 'screening' | 'treatment' | 'teleconsultation'
          status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          message: string
          is_read: boolean
          is_urgent: boolean
          attachment_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          message: string
          is_read?: boolean
          is_urgent?: boolean
          attachment_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          message?: string
          is_read?: boolean
          is_urgent?: boolean
          attachment_url?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'appointment' | 'medication' | 'test_result' | 'message' | 'reminder'
          title: string
          message: string
          is_read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'appointment' | 'medication' | 'test_result' | 'message' | 'reminder'
          title: string
          message: string
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'appointment' | 'medication' | 'test_result' | 'message' | 'reminder'
          title?: string
          message?: string
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
      }
      educational_content: {
        Row: {
          id: string
          title: string
          category: 'awareness' | 'hpv' | 'lifestyle' | 'post_treatment' | 'prevention'
          content: string
          content_type: 'article' | 'video' | 'infographic'
          media_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category: 'awareness' | 'hpv' | 'lifestyle' | 'post_treatment' | 'prevention'
          content: string
          content_type: 'article' | 'video' | 'infographic'
          media_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: 'awareness' | 'hpv' | 'lifestyle' | 'post_treatment' | 'prevention'
          content?: string
          content_type?: 'article' | 'video' | 'infographic'
          media_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          resource_type: string
          resource_id: string
          details: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          resource_type: string
          resource_id: string
          details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          resource_type?: string
          resource_id?: string
          details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
