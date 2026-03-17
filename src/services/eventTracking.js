import { supabase } from '../lib/supabase';

export const captureLeadAndEvent = async (leadData, eventData) => {
  try {
    let leadId;

    const { data: existingLead, error: selectError } = await supabase
      .from('leads')
      .select('id')
      .eq('email', leadData.email)
      .maybeSingle();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    if (existingLead) {
      leadId = existingLead.id;

      const { error: updateError } = await supabase
        .from('leads')
        .update({
          name: leadData.name || existingLead.name,
          role: leadData.role || existingLead.role,
          company: leadData.company || existingLead.company,
        })
        .eq('id', leadId);

      if (updateError) throw updateError;
    } else {
      const { data: newLead, error: insertError } = await supabase
        .from('leads')
        .insert([{
          email: leadData.email,
          name: leadData.name,
          role: leadData.role,
          company: leadData.company,
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      leadId = newLead.id;
    }

    const { error: eventError } = await supabase
      .from('diagnostic_events')
      .insert([{
        lead_id: leadId,
        action_type: eventData.action_type,
        scare_score: eventData.scare_score,
        scare_index: eventData.scare_index,
        focus_area: eventData.focus_area,
        metadata: eventData.metadata || {},
      }]);

    if (eventError) throw eventError;

    return { success: true, leadId };
  } catch (error) {
    console.error('Error capturing lead and event:', error);
    return { success: false, error: error.message };
  }
};

export const trackEvent = async (leadId, eventData) => {
  try {
    const { error } = await supabase
      .from('diagnostic_events')
      .insert([{
        lead_id: leadId,
        action_type: eventData.action_type,
        scare_score: eventData.scare_score,
        scare_index: eventData.scare_index,
        focus_area: eventData.focus_area,
        metadata: eventData.metadata || {},
      }]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error tracking event:', error);
    return { success: false, error: error.message };
  }
};
