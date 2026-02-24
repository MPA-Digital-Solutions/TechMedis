import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppNumber } from "@/lib/actions/config";

export async function GET(request: NextRequest) {
  try {
    const number = await getWhatsAppNumber();
    
    // Sanitizar: solo dígitos para wa.me
    const sanitized = number ? number.replace(/\D/g, "") : null;
    console.log("WhatsApp API: Retrieved number:", sanitized);
    
    if (!sanitized) {
      console.warn("WhatsApp API: No number found, using default");
      return NextResponse.json({
        success: true,
        number: "5491112345678" // fallback
      });
    }
    
    return NextResponse.json({
      success: true,
      number: sanitized
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