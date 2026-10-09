import type { Pharmacy } from "@/lib/types" // Utiliser le type Pharmacy défini dans lib/types
import { getSupabaseClient, getSupabaseConfigurationError } from "@/lib/supabase"
import { DEMO_PHARMACIES } from "@/lib/mock-data"
import { slugify } from "@/lib/slugify"

export type PharmacyLookupResult =
  | { status: "found"; data: Pharmacy; error?: undefined }
  | { status: "not_found"; data: null; error?: undefined }
  | { status: "not_configured"; data: null; error: string }
  | { status: "error"; data: null; error: string }

export class PharmacyService {
  private static instance: PharmacyService
  private demoMode = false

  static getInstance(): PharmacyService {
    if (!PharmacyService.instance) {
      PharmacyService.instance = new PharmacyService()
    }
    return PharmacyService.instance
  }

  async getPharmacies(): Promise<{
    data: Pharmacy[]
    isDemo: boolean
    error?: string
  }> {
    // Si on est déjà en mode démo, retourner les données de démo
    if (this.demoMode) {
      return { data: DEMO_PHARMACIES, isDemo: true }
    }

    try {
      // Vérifier si Supabase est configuré
      const configurationError = getSupabaseConfigurationError()
      const supabase = getSupabaseClient()

      if (configurationError || !supabase) {
        return {
          data: DEMO_PHARMACIES,
          isDemo: true,
          error: configurationError ?? "Client Supabase indisponible.",
        }
      }

      // Essayer de récupérer les données depuis Supabase
      const { data, error } = await supabase.from("pharmacies").select("*").eq("is_active", true).order("name")

      if (error) {
        // Vérifier si c'est une erreur de table non trouvée
        if (
          error.message.includes('relation "public.pharmacies" does not exist') ||
          error.message.includes("does not exist") ||
          error.code === "PGRST116"
        ) {
          console.warn(
            "La table des pharmacies n'existe pas dans Supabase, basculement vers les données de démo. Veuillez exécuter les scripts SQL pour créer la table.",
        )
        return {
          data: DEMO_PHARMACIES,
          isDemo: true,
            error: `Supabase: ${error.message}`,
        }
      }

      console.warn("Erreur Supabase, basculement vers les données de démo:", error.message)
        return {
          data: DEMO_PHARMACIES,
          isDemo: true,
          error: `Supabase: ${error.message}`,
        }
      }

      // Si pas de données, utiliser les données de démo
      if (!data || data.length === 0) {
        console.log("Aucune donnée dans Supabase, utilisation des données de démo")
        return { data: DEMO_PHARMACIES, isDemo: true }
      }

      return { data, isDemo: false }
    } catch (error) {
      console.warn("Erreur de connexion, utilisation des données de démo:", error)
      return {
        data: DEMO_PHARMACIES,
        isDemo: true,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      }
    }
  }

  async checkConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
      const configurationError = getSupabaseConfigurationError()
      const supabase = getSupabaseClient()
      if (configurationError || !supabase) {
        return {
          connected: false,
          error: configurationError ?? "Client Supabase indisponible.",
        }
      }
      const { error } = await supabase.from("pharmacies").select("count", { count: "exact", head: true })
      if (error) {
        return { connected: false, error: error.message }
      }
      return { connected: true }
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : "Erreur de connexion",
      }
    }
  }

  async getPharmacyBySlug(slug: string): Promise<PharmacyLookupResult> {
    const normalizedSlug = slugify(slug)
    const configurationError = getSupabaseConfigurationError()
    const supabase = getSupabaseClient()

    if (configurationError || !supabase) {
      return {
        status: "not_configured",
        data: null,
        error: configurationError ?? "Client Supabase indisponible.",
      }
    }

    try {
      const nameCandidate = normalizedSlug.replace(/-/g, " ").trim()
      const baseQuery = supabase
        .from("pharmacies")
        .select("*")
        .eq("is_active", true)
        .order("name")

      const targetedQuery = nameCandidate
        ? baseQuery.ilike("name", `%${nameCandidate}%`).limit(10)
        : baseQuery.limit(10)

      const { data: targetedData, error: targetedError } = await targetedQuery

      if (targetedError) {
        return {
          status: "error",
          data: null,
          error: targetedError.message,
        }
      }

      const targetedMatch = (targetedData as Pharmacy[] | null)?.find(
        (pharmacy: Pharmacy) => slugify(pharmacy.name) === normalizedSlug
      )

      if (targetedMatch) {
        return { status: "found", data: targetedMatch }
      }

      // Fallback nécessaire pour les noms accentués ou les slugs historiques,
      // tant que la table ne possède pas de colonne slug normalisée.
      const { data, error } = await supabase
        .from("pharmacies")
        .select("*")
        .eq("is_active", true)
        .order("name")

      if (error) {
        return {
          status: "error",
          data: null,
          error: error.message,
        }
      }

      const pharmacy = (data as Pharmacy[] | null)?.find(
        (currentPharmacy: Pharmacy) => slugify(currentPharmacy.name) === normalizedSlug
      )

      return pharmacy
        ? { status: "found", data: pharmacy }
        : { status: "not_found", data: null }
    } catch (error) {
      return {
        status: "error",
        data: null,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      }
    }
  }

  setDemoMode(demo: boolean) {
    this.demoMode = demo
  }
}

export const pharmacyService = PharmacyService.getInstance()
