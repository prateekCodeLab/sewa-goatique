import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateLogo() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          {
            text: "A professional, high-quality vector-style logo for a skincare brand named 'SEWA Goatique'. The logo features a stylized, elegant line-art profile of a goat's head facing right, with curved horns forming a circular shape. The color is a rich, warm brown (#5D4037). The text 'SEWA' is in a clean serif font above a horizontal line, and 'Goatique' is in a flowing, elegant script font below the line. The background is pure white. The design should be clean, modern, and suitable for a luxury handmade brand.",
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        const buffer = Buffer.from(base64Data, 'base64');
        const filePath = path.join(process.cwd(), 'public', 'logo.png');
        
        // Ensure public dir exists
        if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
            fs.mkdirSync(path.join(process.cwd(), 'public'));
        }
        
        fs.writeFileSync(filePath, buffer);
        console.log('Logo generated and saved to public/logo.png');
        return;
      }
    }
    console.log('No image generated');
  } catch (error) {
    console.error('Error generating logo:', error);
  }
}

generateLogo();
