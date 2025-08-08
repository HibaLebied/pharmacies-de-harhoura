import { AlertCircle, Database } from "lucide-react"
import { isSupabaseConfigured } from "@/lib/supabase"

interface DemoBannerProps {
  showDatabaseError?: boolean
}

export function DemoBanner({ showDatabaseError = false }: DemoBannerProps) {
  if (!showDatabaseError && isSupabaseConfigured) return null

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        {showDatabaseError ? (
          <Database className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        ) : (
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        )}
        <div>
          <h3 className="font-medium text-blue-900 mb-1">
            {showDatabaseError ? "Base de données non initialisée" : "Mode Démonstration"}
          </h3>
          <p className="text-blue-800 text-sm">
            {showDatabaseError ? (
              <>
                La table des pharmacies n'existe pas encore dans votre base Supabase.
                <br />
                Exécutez les scripts SQL fournis pour créer la structure de données.
              </>
            ) : (
              "Cette application utilise des données de démonstration. Pour utiliser des données réelles, configurez votre intégration Supabase."
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
