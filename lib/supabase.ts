import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create client with additional headers
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  }
});

export interface NichePrompts {
  "Niche Name": string;
  "Onb_Identity": string;
  "Onb_Task": string;
  "Onb_Steps": string;
  "ONB_Response_Guildelines": string;
  "ONB_Style": string;
  "ONB_Specifics": string;
  "Onb_Notes": string;
  "Onb_Example": string;
  "Context": string;
  "Dbr_Identity": string;
  "Dbr_Task": string;
  "DBR_Steps": string;
  "DBR_Notes": string;
  "DBR_Example": string;
  "Appointments_Identity": string;
  "Confirmation_Task": string;
  "Confirmation_Steps": string;
  "Appointments Example": string;
  "Appointments_Notes": string;
  "Reminders_Task": string;
  "Reminders 1 Steps": string;
  "Reminders 2 Steps": string;
  "No Show Identity": string;
  "No Show Task": string;
  "No Show Steps": string;
  "Inbound Identity": string;
  "Inbound Task": string;
  "Inbound Steps": string;
  "Inbound Response Guidlines": string;
  "Inbound Specifics": string;
  "Inbound Notes": string;
  "Inbound Examples": string;
  "Call Later Task": string;
  "Call Later Steps": string;
  "Call Later DBR Steps": string;
  "Call Later Examples": string;
  "configGroups_preset": string;
  "inbound_configGroups_preset": string;
  "Afterhours Inbound Steps": string;
  "Afterhours Inbound Response Guidlines": string;
  "Afterhours Inbound Notes": string;
  "Afterhours Inbound Examples": string;
}

// Export the field mappings for use in other components
export const FIELD_MAPPINGS = {
  "Onb_Identity": "ONB Identity",
  "Onb_Task": "ONB Task",
  "Onb_Steps": "ONB Steps",
  "ONB_Response_Guildelines": "ONB Response Guidelines",
  "ONB_Style": "ONB Style",
  "ONB_Specifics": "ONB Specifics",
  "Onb_Notes": "ONB Notes",
  "Onb_Example": "ONB Example",
  "Dbr_Identity": "DBR Identity",
  "Dbr_Task": "DBR Task",
  "DBR_Steps": "DBR Steps",
  "DBR_Notes": "DBR Notes",
  "DBR_Example": "DBR Example",
  // ... add all other field mappings
} as const;

export async function fetchNiches() {
  console.log('Starting fetchNiches request...');

  try {
    // First try - get everything to verify data exists
    console.log('Making first test query...');
    const { data: allData, error: allError } = await supabase
      .from('agents_prompts')
      .select('*')
      .limit(1);
    
    console.log('All data test:', allData);

    if (allError) {
      console.error('Error in all data query:', allError);
    }

    // Second try - specific column with exact spacing
    console.log('Making niche name query...');
    const { data, error } = await supabase
      .from('agents_prompts')
      .select('"Niche Name"');

    if (error) {
      console.error('Error in niche query:', error);
      throw error;
    }

    console.log('Raw data from Supabase:', data);
    
    if (data && data.length > 0) {
      console.log('First row structure:', Object.keys(data[0]));
      console.log('First row values:', Object.values(data[0]));
    }

    const niches = data?.map(row => {
      console.log('Processing row:', row);
      return row['Niche Name'];
    }) ?? [];

    console.log('Final processed niches:', niches);
    return niches;
  } catch (error) {
    console.error('Error in fetchNiches:', error);
    throw error;
  }
}

export async function fetchNichePrompts(nicheName: string) {
  console.log('Fetching prompts for niche:', nicheName);
  
  try {
    const { data, error } = await supabase
      .from('agents_prompts')
      .select('*')
      .eq('Niche Name', nicheName)
      .single();

    console.log('Niche prompts response:', { data, error });

    if (error) {
      console.error('Error fetching niche prompts:', error);
      throw error;
    }

    return data as NichePrompts;
  } catch (error) {
    console.error('Error in fetchNichePrompts:', error);
    throw error;
  }
}

export async function updateNichePrompts(nicheName: string, updates: Partial<NichePrompts>) {
  console.log('Updating prompts for niche:', nicheName);
  console.log('Updates:', updates);
  
  try {
    const { error } = await supabase
      .from('agents_prompts')
      .update(updates)
      .eq('Niche Name', nicheName);

    if (error) {
      console.error('Error updating niche prompts:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in updateNichePrompts:', error);
    throw error;
  }
}

// Helper function to convert field names
export function getDbFieldName(field: keyof typeof FIELD_MAPPINGS) {
  return FIELD_MAPPINGS[field];
}

// Add this function to test connection
export async function testConnection() {
  console.log('Testing connection to:', supabaseUrl);
  try {
    const { data, error } = await supabase
      .from('agents_prompts')
      .select('*', { count: 'exact', head: true });
    
    console.log('Test connection response:', { data, error });
    
    if (error) {
      console.error('Connection test error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

// Add this function to handle creating new niches
export async function createNichePrompt(nicheName: string) {
  console.log('Creating new niche:', nicheName);
  
  try {
    const { data, error } = await supabase
      .from('agents_prompts')
      .insert([
        { 
          'Niche Name': nicheName,
          // You can set default values for other fields here
          'Onb_Identity': '',
          'Onb_Task': '',
          // ... other fields with default values
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating niche:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createNichePrompt:', error);
    throw error;
  }
}