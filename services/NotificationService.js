import { supabase } from "../lib/supabase";

export const createNotification = async (notification) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.log("Notification Error !", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("Notification error !", error);
    return { success: false, msg: "Could not create your notification" };
  }
};


export const fetchNotifications = async (receiverId) => {
     try {
       const { data, error } = await supabase
         .from("notifications")
         .select(
           `
           *,
           sender : senderId(id, name, image)
           `
         )
         .eq("receiverId", receiverId)
         .order("created_at", { ascending: false});
         
   
       if (error) {
         console.log("Fetch Notifications error !", error);
         return { success: false, msg: error.message };
       }
   
       return { success: true, data: data };
     } catch (error) {
       console.log("Fetch Notifications error !", error);
       return { success: false, msg: "Could not fetch your post notifications" };
     }
   };