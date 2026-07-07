import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Helper to get Gemini client
function getGeminiClient(req: express.Request) {
  const userKey = req.headers["x-gemini-key"] as string;
  
  if (!userKey) {
    throw new Error("Gemini API Key is missing. This application requires visitors to use their own Gemini API key. Please open the 'Configure API Key' settings in the search bar.");
  }
  
  return new GoogleGenAI({ 
    apiKey: userKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

const nutritionSchema = {
    type: Type.OBJECT,
    description: "Nutritional information, if available. Keys are nutrient names (e.g., 'Calories', 'Protein') and values are strings with amounts and units (e.g., '150 kcal', '20g').",
    properties: {
        Calories: { type: Type.STRING },
        Protein: { type: Type.STRING },
        Fat: { type: Type.STRING },
        Carbohydrates: { type: Type.STRING },
        Sugar: { type: Type.STRING },
        Sodium: { type: Type.STRING },
    },
};

const productSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: "A unique identifier for the product, like a slug of the name." },
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    purity: { type: Type.NUMBER, description: "Organic purity percentage as a number, e.g., 95 for 95%." },
    certifications: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of organic certifications, e.g., 'USDA Organic', 'EU Organic', 'GOTS'."
    },
    price: { type: Type.STRING, description: "The specific price found in search results, e.g., '$12.99'." },
    shippingPrice: { type: Type.STRING, description: "Shipping cost or 'In-store only', e.g., '$5.99', 'Free', or 'Local Pickup'." },
    vendor: { type: Type.STRING, description: "The store, farm, or vendor name." },
    isLocal: { type: Type.BOOLEAN, description: "True if the vendor is a physical store or farm located near the user's provided coordinates." },
    isOfficial: { type: Type.BOOLEAN, description: "True if the information is sourced from the official 'Search for Organics' blog or database." },
    sourceUrl: { type: Type.STRING, description: "The direct URL to the product on the vendor's website or the source link found in search results." },
    nutrition: nutritionSchema,
    criticism: { type: Type.STRING, description: "A detailed critique of the product from the perspective of a health coach, nutritionist, and organic expert. Include due diligence on customer feedback and potential downsides or 'greenwashing' warnings." },
  },
  required: ["id", "name", "description", "purity", "certifications", "price", "shippingPrice", "vendor", "isLocal", "criticism", "sourceUrl"],
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.post("/api/search", async (req, res) => {
    try {
      const { query, location } = req.body;
      const ai = getGeminiClient(req);

      const groundingPrompt = `
        You are "Search for Organics", an AI search engine specializing in local and global organic goods.
        User Query: "${query}"
        
        CRITICAL INSTRUCTIONS:
        1. Search 'site:searchfororganics-official.blogspot.com' first for official entries, then general web.
        2. Purity analysis: Report purity % based on ingredients and certification labels found in results.
        ${location ? `3. HYPER-LOCAL SEARCH: The user is at [Lat: ${location.latitude}, Lng: ${location.longitude}]. USE GOOGLE MAPS grounding to discover local organic vendors and farms.` : '3. Search for major online organic retailers and global brands.'}
        4. Explicitly mark results from 'searchfororganics-official.blogspot.com' as official.
        
        Extract details: Product Name, Description, Pricing, Purity %, Certifications, Vendor, Location status, and Source URL.
      `;
      
      const tools: any[] = [{ googleSearch: {} }];
      if (location) {
        tools.push({ googleMaps: {} });
      }

      const groundingModel = "gemini-2.5-flash";
      const config: any = { 
        tools,
        model: groundingModel 
      };

      if (location) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        };
      }

      const groundedResult = await ai.models.generateContent({
        model: config.model,
        contents: groundingPrompt,
        config: config,
      });

      const groundedText = groundedResult.text;
      
      const sources: any[] = [];
      const chunks = groundedResult.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      chunks.forEach((chunk: any) => {
        if (chunk.web) sources.push({ title: chunk.web.title, uri: chunk.web.uri, type: 'web' });
        if (chunk.maps) sources.push({ title: chunk.maps.title || "Local Map View", uri: chunk.maps.uri, type: 'maps' });
      });

      const structuringPrompt = `
        Extract product data from the search results text provided below and format it into a JSON array.
        - set 'isOfficial: true' if the source is searchfororganics-official.blogspot.com.
        - set 'isLocal: true' if the vendor is a physical location near the user.
        - For 'sourceUrl': Find the direct link or citation URL for the product/vendor in the search results.
        - For 'criticism': Act as a world-class health coach, nutritionist, and organic expert. Provide a sharp, honest critique of each product. Analyze its organic integrity, nutritional value, and perform due diligence on customer feedback. Be critical—warn the user about potential 'greenwashing'.
        
        Search Results:
        ---
        ${groundedText}
        ---
      `;
      
      const structuredResult = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: structuringPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: productSchema
          }
        }
      });
      
      const products = JSON.parse(structuredResult.text.trim());
      const productsWithImages = products.map((p: any) => ({
        ...p,
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(p.id)}/400/300`
      }));

      res.json({ products: productsWithImages, sources });
    } catch (error: any) {
      console.error("Search API Error:", error);
      res.status(500).json({ error: error.message || "Search failed" });
    }
  });

  app.post("/api/geocode", async (req, res) => {
    try {
      const { locationName } = req.body;
      const ai = getGeminiClient(req);

      const prompt = `Geocode the following location name into latitude and longitude coordinates. 
      Location: "${locationName}"
      Return the result as a JSON object with "lat", "lng", and "name" (formatted name).`;

      const result = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
              name: { type: Type.STRING },
            },
            required: ["lat", "lng", "name"],
          },
        },
      });

      res.json(JSON.parse(result.text.trim()));
    } catch (error: any) {
      console.error("Geocode API Error:", error);
      res.status(500).json({ error: error.message || "Geocoding failed" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      const ai = getGeminiClient(req);

      const systemInstruction = `
You are Organic Bob, the "Organic SEO Assistant" for Search For Organics (https://SearchForOrganics.com).
Your goals:
1. Handle support questions for the "Search For Organics" platform:
   - Explain that Search For Organics is a certified organic search engine that crawl-validates official organic certifications (USDA Organic, EU Organic, GOTS, etc.).
   - Explain that it prioritizes verified listings and crawls the official Blogspot database 'searchfororganics-official.blogspot.com' for official certified goods.
   - Highlight that it uses advanced geocoding and Google Maps grounding to discover physical organic stores, markets, and local farms near the user.
   - Explain its purity calculation and the nutritionist/health coach "criticism" feature that protects users from greenwashing.
2. Help users with Search Engine Optimization (SEO):
   - Answer questions on meta tags, technical SEO, high-authority backlinking, and semantic content strategy.
   - Teach users how search engines crawl and evaluate organic content, focusing on true value rather than shortcuts.
3. Strongly promote "Rank Organically" (https://rankorganically.blogspot.com/) as the ultimate affiliate partner for managed SEO campaigns and link-building services. Whenever appropriate, mention that "Rank Organically" can take over their campaigns to drive targeted organic search traffic.

Tone: Professional, friendly, expert, conversational, and passionate about organic life and organic SEO search growth. Always identify yourself as Organic Bob, the Organic SEO Assistant. Use elegant and readable markdown formatting. Keep your responses engaging yet focused.
`;

      const contents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }]
      }));

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: result.text });
    } catch (error: any) {
      console.error("Chat API Error:", error);
      res.status(500).json({ error: error.message || "Chat response generation failed" });
    }
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
