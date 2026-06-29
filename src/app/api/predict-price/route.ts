import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * Next.js API Route for Price Prediction Integration
 * This acts as a bridge between the Node.js backend and the Python Flask ML Service.
 */

const FLASK_API_URL = "http://localhost:5000/predict";
const MAX_RETRIES = 2;
const TIMEOUT = 5000; // 5 seconds

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { Commodity, State, minPrice, maxPrice } = body;

    // Validate Input
    if (!Commodity || !State || minPrice === undefined || maxPrice === undefined) {
      return NextResponse.json(
        { message: "Missing required fields for prediction", success: false },
        { status: 400 }
      );
    }

    // Call Flask ML API with Retry Logic
    let lastError: any = null;
    for (let i = 0; i <= MAX_RETRIES; i++) {
      try {
        const response = await axios.post(
          FLASK_API_URL,
          {
            "Commodity": Commodity,
            "State": State,
            "Min Price": minPrice,
            "Max Price": maxPrice,
          },
          {
            timeout: TIMEOUT,
          }
        );

        if (response.data.success) {
          return NextResponse.json({
            success: true,
            predicted_price: response.data.predicted_price,
            message: "Prediction successful",
          });
        }
      } catch (error: any) {
        lastError = error;
        console.warn(`Flask API attempt ${i + 1} failed: ${error.message}`);
        
        // Wait briefly before retry
        if (i < MAX_RETRIES) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    // If all retries fail
    console.error("All Flask API retries failed:", lastError?.message);
    return NextResponse.json(
      { 
        message: "ML Service is currently unavailable. Please try again later.", 
        success: false,
        error: lastError?.message 
      },
      { status: 503 }
    );

  } catch (error: any) {
    console.error("Internal Prediction Bridge Error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
