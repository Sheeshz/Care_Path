import { type NextRequest, NextResponse } from "next/server"

interface SymptomAnswers {
  fever?: boolean
  chestPain?: boolean
  severeHeadache?: boolean
  nausea?: boolean
  cough?: boolean
  fatigue?: boolean
}

interface SymptomResult {
  result: string
  level: "green" | "yellow" | "red"
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const answers: SymptomAnswers = await request.json()

    // Rule-based decision engine
    const result = evaluateSymptoms(answers)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error processing symptoms:", error)
    return NextResponse.json({ error: "Failed to process symptoms" }, { status: 500 })
  }
}

function evaluateSymptoms(answers: SymptomAnswers): SymptomResult {
  // Red Alert - Urgent medical attention needed
  if (answers.chestPain) {
    return {
      result: "Seek urgent medical help",
      level: "red",
      message: "Chest pain can be serious. Please seek immediate medical attention or call emergency services.",
    }
  }

  // High fever with severe symptoms
  if (answers.fever && answers.severeHeadache) {
    return {
      result: "Seek urgent medical help",
      level: "red",
      message: "The combination of fever and severe headache requires immediate medical evaluation.",
    }
  }

  // Yellow Alert - Campus clinic visit recommended
  if (answers.fever || (answers.nausea && answers.severeHeadache)) {
    return {
      result: "Visit campus clinic",
      level: "yellow",
      message:
        "Your symptoms suggest you should see a healthcare professional. Visit your campus clinic for proper evaluation.",
    }
  }

  if (answers.cough && (answers.fever || answers.fatigue)) {
    return {
      result: "Visit campus clinic",
      level: "yellow",
      message: "Your combination of symptoms warrants medical attention. Consider visiting the campus clinic.",
    }
  }

  // Moderate symptoms
  if (answers.cough || answers.nausea || answers.severeHeadache) {
    return {
      result: "Visit campus clinic",
      level: "yellow",
      message: "Your symptoms may benefit from professional medical advice. Consider visiting the campus clinic.",
    }
  }

  // Green Alert - Rest at home
  return {
    result: "Rest at home",
    level: "green",
    message:
      "Your symptoms appear mild. Get plenty of rest, stay hydrated, and monitor your condition. Seek medical care if symptoms worsen.",
  }
}

// Enable CORS for frontend integration
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
