import json
from google import genai
from google.genai import types
from app.core.config import settings
from app.models.preference import UserPreferenceDB
from app.schemas.notification import NotificationInput, NotificationOutput

# Initialize the new Google GenAI client
client = genai.Client(api_key=settings.GEMINI_API_KEY)

async def process_notification_with_ai(
    notification: NotificationInput, 
    prefs: UserPreferenceDB
) -> NotificationOutput:
    """
    Processes a raw notification using the new Google GenAI SDK based on user preferences.
    """
    
    # 1. Build the dynamic system instruction
    system_instruction = f"""
    You are the 'ISMR Engine', an intelligent notification assistant.
    Rewrite the incoming notification based on these strict user preferences:
    
    - AI Personality: {prefs.ai_personality}
    - Hide Sensitive Data: {prefs.hide_sensitive_data} (If true, mask passwords, codes, or financial values)
    - Focus Mode Active: {prefs.focus_mode_active} (If true, summarize extremely briefly. If the notification is casual/unimportant, flag it as not important).
    - Do not greet or sign off messages. Be concise and to the point. Avoid high token consumption.
    
    Return ONLY a valid JSON object with this exact structure, nothing else:
    {{
        "processed_message": "The rewritten text here",
        "is_important": true or false
    }}
    """
    
    # 2. Build the user prompt
    user_prompt = f"""
    App: {notification.app_name}
    Sender: {notification.sender_name}
    Message: {notification.raw_message}
    """
    
    try:
        # 3. Call the Gemini API using the new async SDK syntax (notice the .aio and await)
        response = await client.aio.models.generate_content(
            model='gemini-3.1-flash-lite-preview',
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                temperature=0.0 
            )
        )
        
        # 4. Parse the JSON result
        ai_result = json.loads(response.text)
        should_read = not prefs.read_only_headphones
        
        return NotificationOutput(
            original_app=notification.app_name,
            processed_message=ai_result.get("processed_message", "Could not process message."),
            is_important=ai_result.get("is_important", True),
            should_read_aloud=should_read
        )
        
    except json.JSONDecodeError:
        # Fallback if the AI hallucinates invalid JSON
        return NotificationOutput(
            original_app=notification.app_name,
            processed_message="Error: AI returned an invalid response format.",
            is_important=True,
            should_read_aloud=False
        )
    except Exception as e:
        # Fallback if the Google API is down or the API key is wrong
        print(f"ISMR Engine API Error: {e}")
        return NotificationOutput(
            original_app=notification.app_name,
            processed_message="The ISMR Engine is currently unavailable. Showing original message.",
            is_important=True,
            should_read_aloud=False
        )