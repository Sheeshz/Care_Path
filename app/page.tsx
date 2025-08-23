import { SymptomNavigator } from "@/components/symptom-navigator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Symptom Navigator</h1>
          <p className="text-gray-600">Get personalized guidance for your health concerns</p>
        </div>
        <SymptomNavigator />
      </div>
    </main>
  )
}
