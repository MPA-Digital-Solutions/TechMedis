import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppNumber } from "@/lib/actions/config";

export async function GET(request: NextRequest) {
  try {
    const number = await getWhatsAppNumber();
    
    return NextResponse.json({
      success: true,
      number: number
    });
  } catch (error) {
    console.error("Error fetching WhatsApp config:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch WhatsApp configuration",
        number: "5491112345678" // fallback
      },
      { status: 500 }
    );
  }
}