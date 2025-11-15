"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  BadgeCheck,
  CalendarClock,
  Check,
  ChevronDown,
  ClipboardList,
  Clock,
  FileCog,
  MapPin,
  RefreshCw,
  Settings,
  Wrench,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

type MaintenanceInterval = {
  id: string
  title: string
  description: string
  frequency: string
  kitId?: string
}

type MaintenancePlan = {
  id: string
  name: string
  equipment: string
  category: string
  intervals: MaintenanceInterval[]
}

type MaintenanceKit = {
  id: string
  code: string
  description: string
  category: string
}

type MaintenanceRecord = {
  id: string
  name: string
  category: string
  equipment: string
  lastReading: number
  nextServiceReading: number
  readingDate: string
  operator: string
  observations: string
  nextServiceDate: string
  remaining: number
  lastMaintenanceDate: string
}

type UpdateFormState = {
  newReading: string
  readingDate: string
  operator: string
  observations: string
}

type RegisterFormState = {
  serviceDate: string
  serviceReading: string
  details: string
}

type ActiveInterval = {
  planId: string
  intervalId: string
} | null

const maintenancePlansSeed: MaintenancePlan[] = [
  {
    id: "plan-1",
    name: "Plan Excavadora 320",
    equipment: "Caterpillar 320 Excavadora",
    category: "Excavadora",
    intervals: [
      {
        id: "interval-1",
        title: "Intervalo PM1",
        description: "Servicio estándar cada 250 horas",
        frequency: "Servicio cada 250h",
        kitId: "kit-1",
      },
      {
        id: "interval-2",
        title: "Intervalo PM2",
        description: "Reemplazo de filtros y fluidos cada 500 horas",
        frequency: "Servicio cada 500h",
      },
      {
        id: "interval-3",
        title: "Intervalo PM3",
        description: "Revisión estructural completa",
        frequency: "Servicio anual",
      },
    ],
  },
  {
    id: "plan-2",
    name: "Plan Retroexcavadora 420",
    equipment: "Caterpillar 420F2",
    category: "Retropala",
    intervals: [
      {
        id: "interval-4",
        title: "Intervalo Diario",
        description: "Chequeo de seguridad y fluidos",
        frequency: "Diario",
      },
      {
        id: "interval-5",
        title: "Intervalo PM1",
        description: "Servicio cada 250 horas",
        frequency: "Servicio cada 250h",
      },
    ],
  },
]

const availableKits: MaintenanceKit[] = [
  {
    id: "kit-1",
    code: "CAT-EXC-320-PM1",
    description: "Kit PM1 Excavadora 320",
    category: "Excavadora",
  },
  {
    id: "kit-2",
    code: "CAT-EXC-320-PM2",
    description: "Kit PM2 Excavadora 320",
    category: "Excavadora",
  },
  {
    id: "kit-3",
    code: "CAT-RET-420-PM1",
    description: "Kit PM1 Retroexcavadora 420",
    category: "Retropala",
  },
  {
    id: "kit-4",
    code: "CAT-RET-420-PM2",
    description: "Kit PM2 Retroexcavadora 420",
    category: "Retropala",
  },
]

const maintenanceRecordsSeed: MaintenanceRecord[] = [
  {
    id: "record-1",
    name: "GRÚA BLANCA JAC - AC-003",
    category: "Grúa",
    equipment: "GRÚA BLANCA JAC",
    lastReading: 91313,
    nextServiceReading: 91042,
    readingDate: "2025-11-15",
    operator: "Operador de turno",
    observations: "Iniciar revisión de válvulas de seguridad",
    nextServiceDate: "2025-11-17",
    remaining: -271,
    lastMaintenanceDate: "2025-11-06",
  },
  {
    id: "record-2",
    name: "RETROEXCAVADORA CAT 420",
    category: "Retropala",
    equipment: "RETROEXCAVADORA CAT 420",
    lastReading: 58760,
    nextServiceReading: 59000,
    readingDate: "2025-11-12",
    operator: "Ernesto Gil",
    observations: "Actualizar mangueras de retorno",
    nextServiceDate: "2025-11-20",
    remaining: 240,
    lastMaintenanceDate: "2025-10-28",
  },
  {
    id: "record-3",
    name: "EXCAVADORA 320",
    category: "Excavadora",
    equipment: "EXCAVADORA 320",
    lastReading: 73214,
    nextServiceReading: 73500,
    readingDate: "2025-11-10",
    operator: "Soraya Méndez",
    observations: "Revisión pendiente de orugas",
    nextServiceDate: "2025-11-18",
    remaining: 286,
    lastMaintenanceDate: "2025-10-30",
  },
]

const categoryLabels: Record<string, string> = {
  Excavadora: "Excavadora",
  Retropala: "Retropala",
  Grúa: "Grúa",
}

export default function MaintenancePage() {
  const { toast } = useToast()

  const [plans, setPlans] = useState<MaintenancePlan[]>(maintenancePlansSeed)
  const [activeInterval, setActiveInterval] = useState<ActiveInterval>(null)
  const [kitDialogOpen, setKitDialogOpen] = useState(false)
  const [selectedKitId, setSelectedKitId] = useState<string>("")

  const [categoryFilter, setCategoryFilter] = useState<string>("todas")
  const [recordPopoverOpen, setRecordPopoverOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string>(maintenanceRecordsSeed[0]?.id ?? "")

  const [updateForm, setUpdateForm] = useState<UpdateFormState>({
    newReading: "",
    readingDate: "",
    operator: "",
    observations: "",
  })
  const [registerForm, setRegisterForm] = useState<RegisterFormState>({
    serviceDate: "",
    serviceReading: "",
    details: "",
  })

  const selectedRecord = useMemo(
    () => maintenanceRecordsSeed.find((record) => record.id === selectedRecordId) ?? null,
    [selectedRecordId]
  )

  const filteredRecords = useMemo(() => {
    if (categoryFilter === "todas") return maintenanceRecordsSeed
    return maintenanceRecordsSeed.filter((record) => record.category === categoryFilter)
  }, [categoryFilter])

  useEffect(() => {
    if (!selectedRecord) return

    setUpdateForm({
      newReading: selectedRecord.lastReading.toString(),
      readingDate: selectedRecord.readingDate,
      operator: selectedRecord.operator,
      observations: selectedRecord.observations,
    })

    setRegisterForm({
      serviceDate: selectedRecord.lastMaintenanceDate,
      serviceReading: selectedRecord.nextServiceReading.toString(),
      details: selectedRecord.observations,
    })
  }, [selectedRecord])

  const handleUpdateFormChange = (field: keyof UpdateFormState, value: string) => {
    setUpdateForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegisterFormChange = (field: keyof RegisterFormState, value: string) => {
    setRegisterForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitUpdate = () => {
    if (!selectedRecord) return

    toast({
      title: "Lectura actualizada",
      description: `Se actualizó la lectura de ${selectedRecord.name} a ${updateForm.newReading} km/horas.`,
    })
  }

  const handleSubmitRegister = () => {
    if (!selectedRecord) return

    toast({
      title: "Mantenimiento registrado",
      description: `Se registró el mantenimiento del ${registerForm.serviceDate} para ${selectedRecord.name}.`,
    })
  }

  const openAssignKitDialog = (planId: string, intervalId: string, currentKitId?: string) => {
    setActiveInterval({ planId, intervalId })
    setSelectedKitId(currentKitId ?? "")
    setKitDialogOpen(true)
  }

  const assignKitToInterval = () => {
    if (!activeInterval) return
    if (!selectedKitId) {
      toast({
        variant: "destructive",
        title: "Selecciona un kit",
        description: "Debes elegir un kit para vincularlo al intervalo.",
      })
      return
    }

    const kit = availableKits.find((item) => item.id === selectedKitId)
    if (!kit) return

    setPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id !== activeInterval.planId) return plan
        return {
          ...plan,
          intervals: plan.intervals.map((interval) =>
            interval.id === activeInterval.intervalId
              ? {
                  ...interval,
                  kitId: kit.id,
                }
              : interval
          ),
        }
      })
    )

    toast({
      title: "Kit asignado",
      description: `${kit.code} asignado correctamente al intervalo de mantenimiento.`,
    })

    setKitDialogOpen(false)
    setActiveInterval(null)
  }

  const currentPlanForDialog = useMemo(() => {
    if (!activeInterval) return null
    return plans.find((plan) => plan.id === activeInterval.planId) ?? null
  }, [activeInterval, plans])

  const kitOptionsForDialog = useMemo(() => {
    if (!currentPlanForDialog) return availableKits
    return availableKits.filter((kit) => kit.category === currentPlanForDialog.category)
  }, [currentPlanForDialog])

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="container space-y-8 py-10">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Wrench className="h-6 w-6 text-kadoshGreen-DEFAULT" />
            <h1 className="text-3xl font-semibold tracking-tight">Gestión de mantenimiento</h1>
          </div>
          <p className="text-muted-foreground">
            Administra los planes de mantenimiento, asigna kits y controla las lecturas para cada equipo.
          </p>
        </header>

        <Card className="border-kadoshGreen-DEFAULT/20 bg-card/60 backdrop-blur">
          <CardHeader className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <ClipboardList className="h-6 w-6 text-kadoshGreen-DEFAULT" />
              Planes de mantenimiento
            </CardTitle>
            <CardDescription className="leading-relaxed">
              Consulta los intervalos definidos para cada plan y vincula los kits correspondientes sin generar errores por
              asignaciones repetidas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {plans.map((plan) => (
                <div key={plan.id} className="space-y-4 rounded-xl border border-border/60 bg-background/40 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold tracking-normal">{plan.name}</h2>
                      <p className="text-sm text-muted-foreground">{plan.equipment}</p>
                    </div>
                    <Badge variant="outline" className="border-kadoshGreen-DEFAULT text-kadoshGreen-DEFAULT">
                      {categoryLabels[plan.category] ?? plan.category}
                    </Badge>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30%] text-muted-foreground">Intervalo</TableHead>
                        <TableHead className="text-muted-foreground">Descripción</TableHead>
                        <TableHead className="text-muted-foreground">Frecuencia</TableHead>
                        <TableHead className="text-center text-muted-foreground">Kit asignado</TableHead>
                        <TableHead className="text-right text-muted-foreground">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plan.intervals.map((interval) => {
                        const assignedKit = interval.kitId
                          ? availableKits.find((kit) => kit.id === interval.kitId)
                          : undefined
                        return (
                          <TableRow key={interval.id}>
                            <TableCell className="font-medium tracking-normal">{interval.title}</TableCell>
                            <TableCell className="text-sm leading-relaxed text-muted-foreground">
                              {interval.description}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{interval.frequency}</TableCell>
                            <TableCell className="text-center">
                              {assignedKit ? (
                                <Badge className="bg-kadoshGreen-DEFAULT/15 text-kadoshGreen-DEFAULT">
                                  {assignedKit.code}
                                </Badge>
                              ) : (
                                <span className="text-sm text-muted-foreground">Sin kit asignado</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-kadoshGreen-DEFAULT text-kadoshGreen-DEFAULT"
                                onClick={() => openAssignKitDialog(plan.id, interval.id, interval.kitId)}
                              >
                                <Settings className="mr-2 h-4 w-4" />
                                Asignar kit
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="space-y-6">
          <Card className="bg-card/70 backdrop-blur">
            <CardHeader className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileCog className="h-5 w-5 text-kadoshGreen-DEFAULT" />
                  <CardTitle className="text-xl">Control de mantenimiento</CardTitle>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Label htmlFor="category-filter" className="text-xs uppercase tracking-widest text-muted-foreground">
                    Filtrar categoría
                  </Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger id="category-filter" className="w-40">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      {Array.from(new Set(maintenanceRecordsSeed.map((record) => record.category))).map((category) => (
                        <SelectItem key={category} value={category}>
                          {categoryLabels[category] ?? category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <CardDescription className="max-w-2xl text-sm leading-relaxed">
                Selecciona una ficha para sincronizar automáticamente los datos de las secciones “Actualizar” y “Registrar”.
                El combobox admite búsqueda por nombre y respeta el filtro por categoría.
              </CardDescription>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Ficha seleccionada
                </Label>
                <Popover open={recordPopoverOpen} onOpenChange={setRecordPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={recordPopoverOpen}
                      className="w-full justify-between border-kadoshGreen-DEFAULT/40 text-left font-medium tracking-normal hover:border-kadoshGreen-DEFAULT"
                    >
                      {selectedRecord ? (
                        <span>
                          {selectedRecord.name}
                          <span className="block text-xs font-normal text-muted-foreground">
                            {categoryLabels[selectedRecord.category] ?? selectedRecord.category}
                          </span>
                        </span>
                      ) : (
                        "Selecciona una ficha"
                      )}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[320px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar ficha..." />
                      <CommandEmpty>No se encontraron fichas.</CommandEmpty>
                      <CommandList>
                        {filteredRecords.length > 0 && (
                          <CommandGroup heading="Fichas disponibles">
                            {filteredRecords.map((record) => (
                              <CommandItem
                                key={record.id}
                                value={record.name}
                                onSelect={() => {
                                  setSelectedRecordId(record.id)
                                  setRecordPopoverOpen(false)
                                }}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium tracking-tight">{record.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {categoryLabels[record.category] ?? record.category}
                                  </span>
                                </div>
                                {selectedRecordId === record.id && <Check className="ml-auto h-4 w-4" />}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                        <CommandSeparator />
                        <CommandGroup heading="Categorías disponibles">
                          {Array.from(new Set(maintenanceRecordsSeed.map((record) => record.category))).map((category) => (
                            <CommandItem
                              key={`category-${category}`}
                              value={category}
                              onSelect={() => {
                                setCategoryFilter(category)
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="border-kadoshGreen-DEFAULT text-xs uppercase tracking-widest">
                                  {categoryLabels[category] ?? category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">Filtrar categoría</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="relative overflow-hidden border border-border/80 bg-background/50">
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="h-5 w-5 text-kadoshGreen-DEFAULT" />
                  <CardTitle className="text-lg">Selecciona un mantenimiento</CardTitle>
                </div>
                {selectedRecord ? (
                  <div className="space-y-3 rounded-lg bg-muted/40 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium tracking-tight text-foreground">Equipo y ficha</span>
                      <span className="text-muted-foreground">{selectedRecord.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium tracking-tight text-foreground">Próximo mantenimiento</span>
                      <span className="text-muted-foreground">
                        {selectedRecord.nextServiceReading.toLocaleString()} km/h
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium tracking-tight text-foreground">Km/horas restantes</span>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs tracking-widest",
                          selectedRecord.remaining < 0
                            ? "bg-destructive/20 text-destructive"
                            : "bg-kadoshGreen-DEFAULT/20 text-kadoshGreen-DEFAULT"
                        )}
                      >
                        {selectedRecord.remaining}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium tracking-tight text-foreground">Último mantenimiento</span>
                      <span className="text-muted-foreground">
                        {new Date(selectedRecord.lastMaintenanceDate).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-destructive/5 p-3 text-xs text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="leading-relaxed">
                        Atención: el equipo superó el intervalo previsto. Prioriza este mantenimiento.
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Selecciona una ficha para visualizar la información del mantenimiento programado.
                  </p>
                )}
              </CardHeader>
            </Card>

            <Card className="border border-border/80 bg-background/50">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-kadoshGreen-DEFAULT" />
                  <CardTitle className="text-lg">Actualizar horas/km actuales</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Ajusta la lectura actual del equipo. Los cambios se guardarán en la ficha seleccionada.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="update-reading">Nueva lectura</Label>
                  <Input
                    id="update-reading"
                    value={updateForm.newReading}
                    onChange={(event) => handleUpdateFormChange("newReading", event.target.value)}
                    placeholder="Ingresa la lectura"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-date">Fecha de la lectura</Label>
                  <Input
                    id="update-date"
                    type="date"
                    value={updateForm.readingDate}
                    onChange={(event) => handleUpdateFormChange("readingDate", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-operator">Responsable</Label>
                  <Input
                    id="update-operator"
                    value={updateForm.operator}
                    onChange={(event) => handleUpdateFormChange("operator", event.target.value)}
                    placeholder="Nombre del operador"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="update-observations">Observaciones</Label>
                  <Textarea
                    id="update-observations"
                    value={updateForm.observations}
                    onChange={(event) => handleUpdateFormChange("observations", event.target.value)}
                    placeholder="Añade detalles relevantes de la lectura"
                    className="min-h-[100px]"
                  />
                </div>
                <Button className="w-full bg-kadoshGreen-DEFAULT text-kadoshBlack-DEFAULT hover:bg-kadoshGreen-DEFAULT/90" onClick={handleSubmitUpdate}>
                  <Clock className="mr-2 h-4 w-4" />
                  Actualizar lectura
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border/80 bg-background/50">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-5 w-5 text-kadoshGreen-DEFAULT" />
                  <CardTitle className="text-lg">Registrar mantenimiento realizado</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Guarda el detalle del mantenimiento ejecutado para mantener el historial actualizado.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-date">Fecha del mantenimiento</Label>
                  <Input
                    id="register-date"
                    type="date"
                    value={registerForm.serviceDate}
                    onChange={(event) => handleRegisterFormChange("serviceDate", event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-reading">Lectura al momento</Label>
                  <Input
                    id="register-reading"
                    value={registerForm.serviceReading}
                    onChange={(event) => handleRegisterFormChange("serviceReading", event.target.value)}
                    placeholder="Lectura actual"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-details">Detalles del servicio</Label>
                  <Textarea
                    id="register-details"
                    value={registerForm.details}
                    onChange={(event) => handleRegisterFormChange("details", event.target.value)}
                    placeholder="Describe el trabajo realizado y repuestos utilizados"
                    className="min-h-[100px]"
                  />
                </div>
                <Button className="w-full bg-kadoshGreen-DEFAULT text-kadoshBlack-DEFAULT hover:bg-kadoshGreen-DEFAULT/90" onClick={handleSubmitRegister}>
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Registrar mantenimiento
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <div className="fixed bottom-6 right-6 z-40 flex w-80 flex-col gap-3">
        <Card className="border border-kadoshGreen-DEFAULT/30 bg-background/80 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-kadoshGreen-DEFAULT" />
              Ruta de mantenimiento
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Próxima visita planificada para el 18/11/2025 en el taller central.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium tracking-tight text-foreground">Ubicación</span>
              <span className="text-muted-foreground">Planta Norte</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium tracking-tight text-foreground">Tiempo estimado</span>
              <span className="text-muted-foreground">45 minutos</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium tracking-tight text-foreground">Responsable</span>
              <span className="text-muted-foreground">Equipo PM</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-destructive/40 bg-destructive/10 shadow-lg">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Atención
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed text-destructive">
              La grúa AC-003 requiere intervención prioritaria. El equipo superó el intervalo recomendado en 271 km/h.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Dialog open={kitDialogOpen} onOpenChange={setKitDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Asignar kit al intervalo</DialogTitle>
            <DialogDescription>
              Selecciona un kit disponible para vincularlo al intervalo seleccionado. Puedes reasignar el mismo kit sin
              generar errores.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Kit disponible</Label>
              <Select value={selectedKitId} onValueChange={setSelectedKitId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un kit" />
                </SelectTrigger>
                <SelectContent>
                  {kitOptionsForDialog.map((kit) => (
                    <SelectItem key={kit.id} value={kit.id}>
                      <div className="flex flex-col">
                        <span className="font-medium tracking-tight">{kit.code}</span>
                        <span className="text-xs text-muted-foreground">{kit.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setKitDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-kadoshGreen-DEFAULT text-kadoshBlack-DEFAULT hover:bg-kadoshGreen-DEFAULT/90" onClick={assignKitToInterval}>
              <Wrench className="mr-2 h-4 w-4" />
              Asignar kit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
