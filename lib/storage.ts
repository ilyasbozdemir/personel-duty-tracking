// localStorage yönetimi için yardımcı fonksiyonlar

export interface Personnel {
  id: string
  name: string
  createdAt: string
}

export interface DutyType {
  id: string
  name: string
  createdAt: string
}

export interface DutyEntry {
  id: string
  date: string // YYYY-MM-DD formatında (başlangıç tarihi)
  dateEnd?: string // YYYY-MM-DD formatında (bitiş tarihi, opsiyonel)
  day: string // Artık sadece cumartesi/pazar değil, herhangi bir gün olabilir
  personnelId: string
  personnelName: string
  dutyTypeId: string
  dutyTypeName: string
  createdAt: string
}

export interface UploadedImage {
  id: string
  dataUrl: string
  uploadedAt: string
  description?: string
}

const STORAGE_KEYS = {
  PERSONNEL: "nobet_personnel",
  DUTY_TYPES: "nobet_duty_types",
  DUTY_ENTRIES: "nobet_duty_entries",
  IMAGES: "nobet_images",
}

// Personnel functions
export function getPersonnel(): Personnel[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.PERSONNEL)
  return data ? JSON.parse(data) : []
}

export function savePersonnel(personnel: Personnel[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.PERSONNEL, JSON.stringify(personnel))
}

export function addPersonnel(name: string): Personnel {
  const personnel = getPersonnel()
  const newPerson: Personnel = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
  }
  personnel.push(newPerson)
  savePersonnel(personnel)
  return newPerson
}

export function deletePersonnel(id: string): void {
  const personnel = getPersonnel().filter((p) => p.id !== id)
  savePersonnel(personnel)
}

// Duty Types functions
export function getDutyTypes(): DutyType[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.DUTY_TYPES)
  return data ? JSON.parse(data) : []
}

export function saveDutyTypes(dutyTypes: DutyType[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.DUTY_TYPES, JSON.stringify(dutyTypes))
}

export function addDutyType(name: string): DutyType {
  const dutyTypes = getDutyTypes()
  const newDutyType: DutyType = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
  }
  dutyTypes.push(newDutyType)
  saveDutyTypes(dutyTypes)
  return newDutyType
}

export function deleteDutyType(id: string): void {
  const dutyTypes = getDutyTypes().filter((d) => d.id !== id)
  saveDutyTypes(dutyTypes)
}

// Duty Entries functions
export function getDutyEntries(): DutyEntry[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.DUTY_ENTRIES)
  return data ? JSON.parse(data) : []
}

export function saveDutyEntries(entries: DutyEntry[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.DUTY_ENTRIES, JSON.stringify(entries))
}

export function addDutyEntry(
  date: string,
  day: string,
  personnelId: string,
  personnelName: string,
  dutyTypeId: string,
  dutyTypeName: string,
  dateEnd?: string,
): DutyEntry {
  const entries = getDutyEntries()
  const newEntry: DutyEntry = {
    id: crypto.randomUUID(),
    date,
    dateEnd,
    day,
    personnelId,
    personnelName,
    dutyTypeId,
    dutyTypeName,
    createdAt: new Date().toISOString(),
  }
  entries.push(newEntry)
  saveDutyEntries(entries)
  return newEntry
}

export function deleteDutyEntry(id: string): void {
  const entries = getDutyEntries().filter((e) => e.id !== id)
  saveDutyEntries(entries)
}

// Images functions
export function getImages(): UploadedImage[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.IMAGES)
  return data ? JSON.parse(data) : []
}

export function saveImages(images: UploadedImage[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images))
}

export function addImage(dataUrl: string, description?: string): UploadedImage {
  const images = getImages()
  const newImage: UploadedImage = {
    id: crypto.randomUUID(),
    dataUrl,
    uploadedAt: new Date().toISOString(),
    description,
  }
  images.push(newImage)
  saveImages(images)
  return newImage
}

export function deleteImage(id: string): void {
  const images = getImages().filter((i) => i.id !== id)
  saveImages(images)
}

// Statistics functions
export function getPersonnelStats(personnelId: string, year?: number, month?: number) {
  const entries = getDutyEntries()
  let filtered = entries.filter((e) => e.personnelId === personnelId)

  if (year) {
    filtered = filtered.filter((e) => new Date(e.date).getFullYear() === year)
  }
  if (month !== undefined) {
    filtered = filtered.filter((e) => new Date(e.date).getMonth() === month)
  }

  return {
    total: filtered.length,
    byDutyType: filtered.reduce(
      (acc, entry) => {
        acc[entry.dutyTypeName] = (acc[entry.dutyTypeName] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
    byDay: filtered.reduce(
      (acc, entry) => {
        acc[entry.day] = (acc[entry.day] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ),
  }
}

export function getAllStats(year?: number, month?: number) {
  const personnel = getPersonnel()
  return personnel.map((person) => ({
    person,
    stats: getPersonnelStats(person.id, year, month),
  }))
}
