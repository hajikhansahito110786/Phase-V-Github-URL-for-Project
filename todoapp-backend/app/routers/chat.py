import google.generativeai as genai
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Configure Gemini – API key should be set in environment
API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    raise RuntimeError("GOOGLE_API_KEY environment variable not set")

genai.configure(api_key=API_KEY)
#bad model = genai.GenerativeModel('gemini-pro')  # Use gemini-pro for older package
model = genai.GenerativeModel('models/gemini-2.5-flash')
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("")
@router.post("/")
async def chat(request: ChatRequest):
    try:
        prompt = f"""You are a helpful assistant for a Todo app. 
The app allows users to manage students and their todos. 
Answer the following question concisely and helpfully:\n\n{request.message}"""
        
        response = model.generate_content(prompt)
        return ChatResponse(response=response.text)
    except Exception as e:
        print(f"Gemini API error: {e}")
        raise HTTPException(status_code=500, detail="AI service temporarily unavailable")